const { DataTypes } = require('sequelize');
const sequelize = require('../databaseRelational'); // Conexión a MySQL

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false, // Usuario relacionado (ID desde MongoDB)
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false, // Total de la factura
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Fecha de creación
  },
});

module.exports = Invoice;

const InvoiceDetails = require('./invoiceDetails');

Invoice.hasMany(InvoiceDetails, { foreignKey: 'invoiceId' });
InvoiceDetails.belongsTo(Invoice, { foreignKey: 'invoiceId' });
