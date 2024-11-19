const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Crear producto (con imagen)
router.post('/', protect, admin, upload.single('image'), createProduct);

// Obtener todos los productos
router.get('/', getProducts);

// Obtener un producto por ID
router.get('/:id', getProductById);

// Actualizar producto (con imagen)
router.put('/:id', protect, admin, upload.single('image'), updateProduct);

// Eliminar producto
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
