const Product = require('../models/Product');

// Crear un producto
exports.createProduct = async (req, res) => {
  const { name, description, price, stock } = req.body;
  try {
    const product = new Product({ name, description, price, stock });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener todos los productos
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un producto por ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar un producto
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
  
      // Utilizar deleteOne() o findByIdAndDelete()
      await Product.deleteOne({ _id: req.params.id }); // Opción 1
      // Alternativamente: await Product.findByIdAndDelete(req.params.id); // Opción 2
  
      res.json({ message: 'Producto eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
  