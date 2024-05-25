const path = require('node:path');
const { Sequelize } =  require('sequelize');
const { loadModels } = require('./models');

let sequelize;

async function initDBConnection() {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '../../mnt/db.sqlite'),
  });
  
  try {
    await sequelize.authenticate();
    loadModels(sequelize);
    await sequelize.sync();
  } catch (error) {
    console.error("Error while initializing the connection", error);
    throw error;
  }
}

function getSequelizeInstance() {
  return sequelize;
}

module.exports = {
  initDBConnection,
  getSequelizeInstance,
};
