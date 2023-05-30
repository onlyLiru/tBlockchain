const SHA256 = require("crypto-js/sha256");

exports.Block = class Block {
  constructor(timestamp = Date.now(), data = null, previousHash) {
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }
  calculateHash = () => {
    return SHA256(
      this.timestamp +
        JSON.stringify(this.data) +
        this.previousHash +
        this.nonce
    ).toString();
  };
  mineBlock = (difficulty) => {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block is mined:", this.hash);
  };
};
