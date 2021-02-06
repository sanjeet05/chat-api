const dotenvFlow = require("dotenv-flow");

dotenvFlow.config(); // default will take .env file

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  jwtRefreshToken: process.env.JWT_REFRESH_TOKEN_DAYS,
  mongo: {
    uri: process.env.NODE_ENV === "test" ? process.env.MONGO_URI_TESTS : process.env.MONGO_URI,
  },
  logs: process.env.NODE_ENV === "production" ? "combined" : "dev",  
  redisUrl: process.env.REDIS_URL,
  swaggerHost: process.env.SWAGGER_HOST,  
};
