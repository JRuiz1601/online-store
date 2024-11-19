const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String, required: true }, // Campo para la URL de la imagen
});

module.exports = mongoose.model('Product', productSchema);
