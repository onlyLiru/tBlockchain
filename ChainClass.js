const { Block } = require("./BlockClass");

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
    this.data = [];
  }
  createGenesisBlock = () => {
    return new Block(Date.now(), "Genesis Block", "0");
  };
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;

    if (newBlock.data) {
      this.data.push(newBlock.data);
    }

    newBlock.data = this.data;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
    this.data = [];
  }
  getLatestBlock = () => {
    return this.chain[this.chain.length - 1];
  };
  isChainValid = () => {
    for (let i = this.chain.length - 1; i > 0; i--) {
      let currentBlock = this.chain[i];
      let previousBlock = this.chain[i - 1];
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
    }

    return true;
  };

  trade = (from, to, amount, signature) => {
    this.data.push({
      from,
      to,
      amount,
      signature,
    });
  };

  balance = (address) => {
    let total = 0;
    this.chain
      .map((chain) => {
        return chain.data;
      })
      .forEach((data) => {
        if (Array.isArray(data)) {
          data.forEach((obj) => {
            if (obj.to === address) {
              total += obj.amount;
            }
            if (obj.from === address) {
              total -= obj.amount;
            }
          });
        }
      });
    return total;
  };
}

const myBlockChain = new BlockChain();

// myBlockChain.addBlock(new Block(Date.now(), { amount: 100 }));

// 改变区块数据，使其验证不通过
// myBlockChain.chain[myBlockChain.chain.length - 1].data.amount = 99;
// myBlockChain.addBlock(new Block(Date.now(), { amount: 90 }));

// console.log(myBlockChain.chain);

// 验证区块链是否有效
// console.log("Is blockchain valid? " + myBlockChain.isChainValid());

module.exports = {
  myBlockChain,
  Block,
};
