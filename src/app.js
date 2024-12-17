const Express = require("express");
const App = Express();
const { createServer: CreateServer } = require("node:http");
const { Server: IoServer } = require("socket.io");
const morgan = require("morgan");

const Server = CreateServer(App);
const Io = new IoServer(Server);

App.use(Express.json());
App.use(morgan("dev"));

App.get("/", (req, res) => res.send({ status: true }));
App.use("/youtube", require("./Router/youtube"));

Io.on("connection", (socket) => {
  socket.on("news", (data) => {
    if (data.type === "register") {
      let room_id = require("node:crypto")
        .randomInt(1, 99999999999)
        .toString()
        .padEnd(16, "0");
      socket.emit("news", {
        message: "i got a news message",
        room_id: room_id,
      });
    }
    if (data.type === "join") {
      console.log("new join", data.room_id);
      socket.join(data.room_id);
    }
    if (data.type === "message") {
      data.client_id = socket.client.id;
      data.unique_id = data.room_id + "_" + require("node:crypto").randomUUID();
      Io.to(data.room_id).emit("message", data);
    }
  });
  socket.on("music", (data) => {
    Io.to(data.room_id).emit("music", data);
  });
  socket.on("disconnect", () => {});
});

Server.listen(process.env.PORT || 3000, () => {
  console.log("listening on port 3000");
});
