const express = require('express');
const { addToCart, getCart, updateCart, removeFromCart, checkoutCart } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/add', protect, addToCart); // Agregar producto al carrito
router.get('/', protect, getCart); // Obtener carrito del usuario
router.put('/update/:productId', protect, updateCart); // Actualizar cantidad
router.delete('/remove/:productId', protect, removeFromCart); // Eliminar producto
router.post('/checkout', protect, checkoutCart); // Finalizar compra

module.exports = router;
