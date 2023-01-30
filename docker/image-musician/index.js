const dgram = require('dgram');
const {v4: uuidv4} = require('uuid');
const {MULTICAST_ADDRESS, MULTICAST_PORT, INSTRUMENTS_SOUNDS, TEMPS_ENVOI} = require("./conf");

//======================================
// Création du datagramme en fonction de
// l'instrument passé en argument
//======================================

// Récupération du nom de l'instrument

if (process.argv.length < 3) {
    console.log('Usage: node index.js instrument');
    process.exit(1);
}

const instrument = process.argv[2];
const instruments = Object.keys(INSTRUMENTS_SOUNDS);

if (!instruments.includes(instrument)) {
    console.log('Invalid instrument');
    process.exit(1);
}

// Récupération du son de l'instrument

const sounds = Object.values(INSTRUMENTS_SOUNDS);

const emitted_sound = sounds[instruments.indexOf(instrument)];

// Création du datagramme

const datagram = {
    uuid: uuidv4(), // Utilisation d'un uuid pour pouvoir identifier chaque musicien
    sound: emitted_sound
};

//============================
// Création du client et envoi
// périodique du datagramme
//============================

const client = dgram.createSocket('udp4');

console.log("Starting to emit the sound " + emitted_sound + " every " + TEMPS_ENVOI + " ms");

// Envoi d'un datagramme toutes les secondes
setInterval(() => {
    client.send(JSON.stringify(datagram), MULTICAST_PORT, MULTICAST_ADDRESS);
}, TEMPS_ENVOI);
