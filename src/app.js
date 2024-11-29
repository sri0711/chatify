const Express = require("express");
const App = Express();
const { createServer: CreateServer } = require("node:http");
const { Server: IoServer } = require("socket.io");

const Server = CreateServer(App);
const Io = new IoServer(Server);

App.use(Express.json());

Io.on("connection", (socket) => {
  console.log("a user connected");
  socket.emit("news", socket.client.id);
  socket.on("news", (data) => {
    if (data.type === "register") {
      let room_id = require("node:crypto")
        .randomInt(1, 9999999999999)
        .toString()
        .padEnd(16, "0");
      socket.emit("news", {
        message: "i got a news message",
        room_id: room_id,
      });
    }
    if (data.type === "join") {
      socket.join(data.room_id);
    }
    if (data.type === "message") {
      Io.to(data.room_id).emit("message", data.message);
    }
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

Server.listen(process.env.PORT || 3000, () => {
  console.log("listening on port 3000");
});
