const fs = require("fs");

const EC = require("elliptic").ec;

class Keypair {
  fileName = "./keypairs.json";
  ec = new EC("secp256k1");
  keypairs = {};

  constructor() {
    this.key = this.ec.genKeyPair();
  }

  genKeyPair = () => {
    let keypairs = null;

    try {
      const file = fs.readFileSync(this.fileName, "utf-8");
      keypairs = JSON.parse(file);
      this.key = this.ec.keyFromPrivate(keypairs.private);

      if (
        !keypairs.public ||
        !keypairs.private ||
        this.key.getPublic("hex") !== keypairs.public
      ) {
        throw new Error("invalid keypair");
      }
    } catch (error) {
      console.log(error);
      keypairs = this.reGenKeyPair();
    }

    this.keypairs = keypairs;

    return keypairs;
  };

  reGenKeyPair = () => {
    const keypairs = {
      private: this.key.getPrivate("hex").toString(),
      public: this.key.getPublic("hex").toString(),
    };

    fs.writeFileSync(this.fileName, JSON.stringify(keypairs));
    this.keypairs = keypairs;
    return keypairs;
  };

  sign = ({ from, to, amount }) => {
    const signature = this.key.sign(`${from}-${to}-${amount}`);
    const derSign = signature.toDER();

    return derSign;
  };

  verify = () => {};
}

module.exports = {
  Keypair,
};
