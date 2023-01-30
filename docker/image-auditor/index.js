const dgram = require('node:dgram');
const udpSocket = dgram.createSocket('udp4');
const net = require('net');
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
const {TEMPS_INACTIVITE, MULTICAST_PORT, TCP_PORT, INSTRUMENTS_SOUNDS, MULTICAST_GROUP} = require("./conf");

dayjs.extend(relativeTime);

// PARTIE UDP

let musicians = new Map();

udpSocket.on('message', (msg) => {
    const content = JSON.parse(msg.toString());

    // Contrôle que le bruit reçu est bien un bruit d'instrument
    if (!Object.values(INSTRUMENTS_SOUNDS).includes(content.sound)) {
        console.log('Invalid instrument received');
        return;
    }

    const instrument = Object.keys(INSTRUMENTS_SOUNDS).find(key => INSTRUMENTS_SOUNDS[key] === content.sound);

    // Si le musicien n'est pas dans la liste, on l'ajoute
    // Sinon, on met à jour la date de dernière activité
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

// Fonction qui fait le tri et retourne les musiciens actifs
const getActiveMusicians = () => {
    updateActiveMusicians();
    return Array.from(musicians.values()).map((m) => {
        let returnedMusician = {...m};
        delete returnedMusician.lastActive;
        return returnedMusician;
    });
}

// Binding du socket UDP et écoute sur le groupe multicast
udpSocket.bind(MULTICAST_PORT, () => {
    udpSocket.addMembership(MULTICAST_GROUP)
});

// PARTIE TCP

// Création du serveur TCP
const tcpServer = net.createServer(function(socket) {
    socket.write(JSON.stringify(getActiveMusicians()));
    socket.end();
});

// Ecoute du port TCP
tcpServer.listen(TCP_PORT);
