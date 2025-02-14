const express = require('express');
const bodyParser = require('body-parser');

const { initDBConnection } = require('./db');
const { loadRoutes } = require('./routes');

async function bootstrap() {
  await initDBConnection();
  console.log("Connected to DB successfully");

  const app = express();
  const PORT = 3000;
  
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  loadRoutes(app);

  app.listen(PORT, (error) => {
    if (error) {
      console.error("Error while starting server", error);
    }
    console.log(`Server listening on ${PORT}`);
  });
}

bootstrap();
