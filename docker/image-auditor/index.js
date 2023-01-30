const dgram = require('node:dgram');
const udpSocket = dgram.createSocket('udp4');
const net = require('net');
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
const {TEMPS_INACTIVITE, MULTICAST_PORT, TCP_PORT, INSTRUMENTS_SOUNDS, TCP_HOST} = require("../conf");

dayjs.extend(relativeTime);

// PARTIE UDP

let musicians = new Map();

udpSocket.on('message', (msg) => {
    const content = JSON.parse(msg.toString());

    if (!Object.values(INSTRUMENTS_SOUNDS).includes(content.sound)) {
        console.log('Invalid instrument received');
        return;
    }

    const instrument = Object.keys(INSTRUMENTS_SOUNDS).find(key => INSTRUMENTS_SOUNDS[key] === content.sound);

    if (musicians.has(content.uuid)) {
        musicians.get(content.uuid).lastActive = dayjs();
    } else {
        musicians.set(content.uuid, {
            uuid: content.uuid,
            instrument,
            activeSince: dayjs().toISOString(),
            lastActive: dayjs()
        });
    }
});

// Fonction qui permet de supprimer les musiciens inactifs
//
// Nous avons expérimenté l'utilisation d'un setInterval afin
// d'exécuter cette fonction périodiquement; cela réduirait le
// temps de réponse du serveur TCP, mais pourrait fournir des
// résultats faux (musiciens inactifs depuis 5.0 - 5.9 secondes)
const updateActiveMusicians = () => {
    musicians.forEach((value, key) => {
        if (dayjs().diff(dayjs(value.lastActive)) > TEMPS_INACTIVITE) {
            musicians.delete(key)
        }
    });
}

const getActiveMusicians = () => {
    updateActiveMusicians();
    return Array.from(musicians.values()).map((m) => {
        let returnedMusician = {...m};
        delete returnedMusician.lastActive;
        return returnedMusician;
    });
}

// PARTIE TCP

const tcpServer = net.createServer(function(socket) {
    socket.write(JSON.stringify(getActiveMusicians()));
    socket.end();
});

tcpServer.listen(TCP_PORT, TCP_HOST);

udpSocket.bind(MULTICAST_PORT);
