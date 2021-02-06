const asyncRedis = require("async-redis");

// vars
const { env, redisUrl } = require("./vars");

// const REDIS_URL = "redis://127.0.0.1:6379";
const client = asyncRedis.createClient(redisUrl);
// client.auth("ssadmin1234");

client.on("error", function (err) {
  console.log("Error " + err);
});

// print mongoose logs in dev env
if (env === "development") {
  client.debug_mode = true;
}

exports.connect = () => {
  client.on("connect", () => {
    console.log("Redis server connected: ", redisUrl);
  });
  return client;
};

exports.asyncRedisClient = client;
