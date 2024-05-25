const fs = require('node:fs');
const path = require('node:path');

function loadRoutes(app) {
  const files = fs.readdirSync(__dirname);
  const routeFiles = files.filter((file) => (file !== 'index.js') && (file.slice(-3) === '.js') && (file.indexOf('routes.js') !== 1));

  routeFiles.forEach((file) => {
    const filePath = path.join(__dirname, file);
    try {
      const fileStats = fs.statSync(filePath);
      if (fileStats.isFile()) {
        const { router, prefix } = require(filePath);
        app.use(prefix, router);
      }
    } catch (error) {
      console.error("Error while loading routes", error);
      throw error;
    }
  });
}

module.exports = {
  loadRoutes
};
