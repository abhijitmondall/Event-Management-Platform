const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const morgan = require("morgan");

// Unhandled Exception
process.on("uncaughtException", (err) => {
  console.log("Unhandled Exception! App Shutting down...");
  console.error(err.name, err.message, err.stack);

  process.exit(1);
});

const mongoose = require("mongoose");
const app = require("./app");
const { setupWebSocket } = require("./socketIo");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// MongoDB configuration
mongoose.connect(DB, {}).then((con) => {
  console.log("DB connection established");
});

const PORT = process.env.PORT || 2000;

// Server
const expServer = app.listen(PORT, () => {
  console.log("listening on port", PORT);
});

// Socket.IO connection
setupWebSocket(expServer);

// Unhandled Rejection
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection! App Shutting down...");
  console.error(err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});
