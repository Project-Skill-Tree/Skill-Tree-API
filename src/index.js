require('dotenv').config();
var log = require('npmlog')
const express = require('express');

const expressLoader = require('./loaders/expressLoader');
const mongooseLoader = require('./loaders/mongooseLoader');

const swaggerUI = require('swagger-ui-express')
const swaggerFile = require('../swagger-output.json')

const PORT = process.env.APP_PORT;

const app = express();

mongooseLoader(); 
expressLoader(app);

app.disable('x-powered-by');
log.info(`Environment-type:${process.env.ENVIRONMENT_TYPE}`)

if (process.env.ENVIRONMENT_TYPE == 'development'){
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile, {explorer:true}));
  log.info(`API documentation: http://localhost:${PORT}/api-docs`);
  app.listen(PORT, () => log.info(`Listening on port ${PORT}`));
}
process.on('SIGTERM', () =>{
  log.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    log.info('HTTP server closed')
  })
})

  app.listen(process.env.PORT, () => console.log('Listening on port ' + process.env.PORT));
