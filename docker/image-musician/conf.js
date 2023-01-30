const MULTICAST_GROUP="239.255.22.5";
const MULTICAST_PORT=9907;

const TCP_HOST="0.0.0.0";
const TCP_PORT=2205;

const TEMPS_ENVOI=1000;
const TEMPS_INACTIVITE=5000;

const INSTRUMENTS_SOUNDS = {
    'piano': 'ti-ta-ti',
    'trumpet': 'pouet',
    'flute': 'trulu',
    'violin': 'gzi-gzi',
    'drum': 'boum-boum'
}

module.exports = {
    MULTICAST_GROUP,
    MULTICAST_PORT,
    TCP_HOST,
    TCP_PORT,
    TEMPS_ENVOI,
    TEMPS_INACTIVITE,
    INSTRUMENTS_SOUNDS
}
