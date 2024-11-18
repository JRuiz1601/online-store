const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('online_store', 'root', 'admin123', {
  host: 'localhost',
  dialect: 'mysql', // Cambiar a 'postgres' si usas PostgreSQL
});

module.exports = sequelize;
