var EC = require('elliptic').ec;
var ec = new EC('secp256k1');
var key = ec.genKeyPair();

console.log(key.getPrivate('hex').toString())
console.log(JSON.stringify(key.getPublic('hex')))