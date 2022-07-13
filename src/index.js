require('dotenv').config();
const log = require("npmlog");
const express = require('express');
const morgan = require("morgan")

const expressLoader = require('./loaders/expressLoader');
const mongooseLoader = require('./loaders/mongooseLoader');

const swaggerUI = require("swagger-ui-express");
const swaggerFile = require("../swagger-output.json");

const PORT = process.env.PORT;

const app = express();

mongooseLoader();
expressLoader(app);
const cors = require("cors");


app.disable("x-powered-by");
log.info(`Environment-type:${process.env.ENVIRONMENT_TYPE}`);

if (process.env.ENVIRONMENT_TYPE === "development") {
  const swagger_port = parseInt(PORT)+1;
  app.use(cors());
  app.use(morgan("tiny"))
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerFile, {explorer:true}));
  log.info(`API documentation: http://localhost:${swagger_port}/api-docs`);
  app.listen(swagger_port, () => log.info(`Swagger: Listening on port ${swagger_port}`));
}


process.on("SIGTERM", () =>{
  log.info("SIGTERM signal received: closing HTTP server");
  app.close(() => log.info("HTTP server closed"));
});

app.listen(PORT, () => console.log("Listening on port " + process.env.PORT))
  .on("error", function() {
    process.once("SIGUSR2", function() {
      process.kill(process.pid, "SIGUSR2");
    });
    process.on("SIGINT", function() {
    // this is only called on ctrl+c, not restart
      process.kill(process.pid, "SIGINT");
    });
  });
