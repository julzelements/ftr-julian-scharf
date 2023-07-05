const EventEmitter = require("events");
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

wss.on("connection", (ws) => {
  myEmitter.on("event", (data) => {
    ws.send(JSON.stringify(data));
  });
});

// emit event
myEmitter.emit("event", { data: "Hello, world!" });
