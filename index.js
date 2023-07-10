const vorpal = require("vorpal")();
const { myBlockChain, Block } = require("./ChainClass");
const { Keypair } = require("./rsa");

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
    const signature = new Keypair().sign({
      from,
      to,
      amount,
    });

    myBlockChain.trade(from, to, amount, signature);
    callback();
  });

vorpal.command("balance <address>", "🈷余额").action(function (args, callback) {
  const { address } = args;
  const balance = myBlockChain.balance(address);
  this.log(balance);
  callback();
});

vorpal.command("keypair", "生成公私钥").action(function (args, callback) {
  const keypairs = new Keypair().genKeyPair();
  this.log(keypairs);
  callback();
});

vorpal
  .command("sign  <from> <to> <amount>", "交易签名")
  .action(function (args, callback) {
    const { from, to, amount } = args;
    const keypair = new Keypair();
    const derSign = keypair.sign({
      from,
      to,
      amount,
    });
    // console.log(keypair.key)
    // this.log(keypair.key.sign(`${from}-${to}-${amount}`).toDER())
    this.log(keypair.key.verify(`${from}-${to}-${amount}`, derSign));
    this.log(keypair.key.verify(`${from}-${to}-10`, derSign));
    callback();
  });

console.log("欢迎来到Tony区块链交流群");
vorpal.exec("help");

vorpal.delimiter("<==tBlockchain===>").show();
