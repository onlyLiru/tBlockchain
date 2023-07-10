const dgram = require("dgram");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const port = process.argv.length > 2 ? 0 : 3000;

let nodes = [];
const nodesFileName = "./nodes.json";

const socket = dgram.createSocket("udp4");

try {
  nodes = JSON.parse(fs.readFileSync(nodesFileName)) || [];
} catch (error) {
  nodes = [];
  fs.writeFileSync(nodesFileName, JSON.stringify(nodes));
}

socket.on("message", (msg, rinfo) => {
  const message = msg.toString();
  console.log(
    `Received message from ${rinfo.address}:${rinfo.port}: ${message}`
  );
});

socket.on("error", (err) => {
  console.log(`Socket error: ${err}`);
  socket.close();
});

socket.on("listening", () => {
  const address = socket.address();
  addNode(address);
  console.log(`P2P network running on ${address.address}:${address.port}`);
});

function addNode(rinfo) {
  const newNode = {
    id: uuidv4(),
    address: rinfo.address,
    port: rinfo.port,
  };
  nodes.push(newNode);
  fs.writeFileSync(nodesFileName, JSON.stringify(nodes));
  console.log(
    `Node connected: ${newNode.id} (${newNode.address}:${newNode.port})`
  );
  console.log(nodes);
}

function removeNode(rinfo) {
  const index = nodes.findIndex(
    (node) => node.address === rinfo.address && node.port === rinfo.port
  );
  if (index !== -1) {
    const removedNode = nodes.splice(index, 1)[0];
    console.log(
      `Node disconnected: ${removedNode.id} (${removedNode.address}:${removedNode.port})`
    );
  }
}

function broadcastMessage(message, senderRinfo) {
  try {
    nodes = JSON.parse(fs.readFileSync(nodesFileName)) || [];
  } catch (error) {
    nodes = nodes || [];
  }

  nodes.forEach((node) => {
    if (
      node.address !== senderRinfo.address ||
      node.port !== senderRinfo.port
    ) {
      socket.send(Buffer.from(message), node.port, node.address);
    }
  });
}

process.stdin.on("data", (data) => {
  const message = data.toString().trim();
  broadcastMessage(message, { address: "localhost", port });
});

process.on("SIGINT", () => {
  console.log("Closing P2P network...");
  socket.close();
  process.exit();
});

socket.bind(port);

// if(process.argv.length > 2) {
//   socket.send(Buffer.from("TTTTTT"), '3000', '0.0.0.0');
// }
