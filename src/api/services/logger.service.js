const path = require("path");
const winston = require("winston");
const moment = require("moment");

const logPath = process.env.LOG_PATH || "./";

// define the custom settings for each transport (file, console)
const options = {
  file: {
    level: "info",
    filename: path.join(logPath, "logs", "app.log"),
    handleExceptions: true,
    json: true,
    maxSize: process.env.LOG_SIZE || 5242880, // 5MB
    maxFiles: process.env.LOG_ROTATION_DAYS || 5,
    colorize: false,
    timestamp: true,
  },
};

const devTransport = [
  new winston.transports.File(options.file),
  new winston.transports.Console({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp({
        format: () => {
          return moment().format("YYYY-MM-DD HH:mm:ss");
        },
      }),
      winston.format.colorize(),
      winston.format.splat(),
      winston.format.simple()
    ),
  }),
];

let logger = winston.createLogger({
  level: "info",
  transports: devTransport,
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
// if (process.env.NODE_ENV !== "production") {
//   logger.add(
//     new winston.transports.Console({
//       format: winston.format.combine(
//         winston.format.timestamp({
//           format: () => {
//             return moment().format("YYYY-MM-DD HH:mm:ss");
//           },
//         }),
//         winston.format.colorize(),
//         winston.format.splat(),
//         winston.format.simple()
//       ),
//     })
//   );
// }

module.exports = logger;
