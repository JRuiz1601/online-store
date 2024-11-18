const { DataTypes } = require('sequelize');
const sequelize = require('../databaseRelational');

const InvoiceDetails = sequelize.define('InvoiceDetails', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    invoiceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Invoices',
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productName: { // Agregar el nombre del producto
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });
  
module.exports = InvoiceDetails;
