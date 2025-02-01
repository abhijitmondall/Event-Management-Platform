const { Server } = require("socket.io");

const socketObj = {};

const setupWebSocket = (expServer) => {
  const io = new Server(expServer, {
    path: "/socket",
    transports: ["polling", "websocket"],

    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("a user is connected", socket.id);

    socketObj.socket = socket;

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  socketObj.io = io;
};

module.exports = { setupWebSocket, socketObj };
