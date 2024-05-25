const fs = require('node:fs');
const path = require('node:path');
const { DataTypes } = require('sequelize');

const models = {};

/**
 * 
 * @param {String} modelName - Name of the Table/Model
 * @returns {Object}
 */
function getModel(modelName) {
  return models[modelName];
}

function loadModels(sequelize) {
  const files = fs.readdirSync(__dirname);
  const modelFiles = files.filter((file) => (file !== 'index.js') && (file.slice(-3) === '.js') && (file.indexOf('model.js') !== 1));

  modelFiles.map(async (file) => {
    const filePath = path.join(__dirname, file);
    try {
      const fileStats = fs.statSync(filePath);
      if (fileStats.isFile()) {
        const model = require(filePath)(sequelize, DataTypes);
        models[model.name] = model;
      }
    } catch (error) {
      console.error("Error while loading models", error);
      throw error;
    }
  });
}

module.exports = {
  loadModels,
  getModel,
};
