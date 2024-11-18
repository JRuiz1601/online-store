const express = require('express');
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', protect, admin, createProduct); // Crear producto
router.get('/', getProducts); // Obtener todos los productos
router.get('/:id', getProductById); // Obtener un producto por ID
router.put('/:id', protect, admin, updateProduct); // Actualizar producto
router.delete('/:id', protect, admin, deleteProduct); // Eliminar producto

module.exports = router;
