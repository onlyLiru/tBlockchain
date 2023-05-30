const vorpal = require("vorpal")();
const { myBlockChain, Block } = require("./ChainClass");

vorpal.command("mine <who> <amount>", "挖矿").action(function (args, callback) {
  myBlockChain.addBlock(
    new Block(Date.now(), {
      from: "0",
      to: args.who,
      amount: args.amount || 20,
    })
  );
  callback();
});

vorpal.command("chain", "查看区块链").action(function (args, callback) {
  this.log(JSON.stringify(myBlockChain.chain, null, 2));
  callback();
});

vorpal.command("isChainValid", "验证区块链").action(function (args, callback) {
  this.log(myBlockChain.isChainValid());
  callback();
});

vorpal
  .command("trade <from> <to> <amount>", "交易")
  .action(function (args, callback) {
    const { from, to, amount } = args;
    myBlockChain.trade(from, to, amount);
    callback();
  });

console.log("欢迎来到Tony区块链交流群");
vorpal.exec("help");

vorpal.delimiter("<==tBlockchain===>").show();
