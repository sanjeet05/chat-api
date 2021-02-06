// make bluebird default Promise
Promise = require("bluebird"); // eslint-disable-line no-global-assign
const { port, env } = require("./config/vars");
const app = require("./config/express");
// const mongoose = require('./config/mongoose');
// redis
const redis = require("./config/redis");

// socket
const http = require("http");
const socketIo = require("socket.io");

// open mongoose connection
// mongoose.connect();

// open redis connection
redis.connect();

const server = http.createServer(app);

const io = socketIo(server);
// io.set("transports", ["websocket"]);

io.on("connection", (socket) => {
  console.log("New socket.io client connected");

  console.log("connection", socket.id);

  // for getting a message
  socket.on("subscribeToRoom", () => {
    console.log("client is subscribing to room");
  });

  socket.on("disconnect", async () => {
    console.log("disconnect", socket.id);
    const userSessionKey = "user!session!active";
    try {
      let ses = await redis.asyncRedisClient.get(userSessionKey);
      if (ses) {
        ses = JSON.parse(ses);
        if (ses.session_id == socket.id) {
          await redis.asyncRedisClient.del(userSessionKey);
        }
      }
    } catch (err) {
      console.log("session error", err);
    }
    console.log("Client socket.io disconnected");
  });
});

// for global access
global.io = io;

// listen to requests
server.listen(port, () => console.info(`server started on port ${port} (${env})`));

/**
 * Exports express
 * @public
 */
module.exports = app;
