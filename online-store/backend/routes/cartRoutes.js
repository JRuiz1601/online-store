const express = require('express');
const { addToCart, getCart, updateCart, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');
const { checkoutCart } = require('../controllers/cartController');
const router = express.Router();

router.post('/add', protect, addToCart); // Agregar producto al carrito
router.get('/', protect, getCart); // Obtener carrito del usuario
router.put('/update', protect, updateCart); // Actualizar cantidad
router.delete('/remove', protect, removeFromCart); // Eliminar producto
router.post('/checkout', protect, checkoutCart);

module.exports = router;
