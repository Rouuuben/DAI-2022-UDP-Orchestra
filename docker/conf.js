const MULTICAST_PORT=9907;
const MULTICAST_ADDRESS="localhost";

const TCP_PORT=2205;
const TCP_HOST="0.0.0.0";

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
    MULTICAST_PORT,
    MULTICAST_ADDRESS,
    TCP_PORT,
    TCP_HOST,
    TEMPS_ENVOI,
    TEMPS_INACTIVITE,
    INSTRUMENTS_SOUNDS
}
