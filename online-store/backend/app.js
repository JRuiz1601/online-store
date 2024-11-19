require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Simple Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const mongoose = require('mongoose');

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(`Error: ${err.message}`));

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

const sequelize = require('./databaseRelational');

sequelize.authenticate()
  .then(() => console.log('Conexión con la base de datos relacional establecida'))
  .catch(err => console.error('Error conectando con la base de datos relacional:', err));


const Invoice = require('./modelsRelational/Invoice');

sequelize.sync({ force: false }) // 'force: true' recreará las tablas cada vez
  .then(() => console.log('Modelos sincronizados con la base de datos relacional'))
  .catch(err => console.error('Error sincronizando modelos:', err));

const invoiceRoutes = require('./routes/invoiceRoutes');
app.use('/api/invoices', invoiceRoutes);


const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);

const InvoiceDetails = require('./modelsRelational/invoiceDetails');

sequelize.sync({ force: false }) // Cambiar a `force: true` si necesitas recrear las tablas
  .then(() => console.log('Tablas sincronizadas'))
  .catch((err) => console.error('Error al sincronizar tablas:', err));

  sequelize.sync({ force: false }) // Cambiar a `true` si necesitas recrear las tablas
  .then(() => console.log('Tablas sincronizadas'))
  .catch((err) => console.error('Error al sincronizar tablas:', err));

const multer = require('multer');
const path = require('path');


// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nombre único para cada archivo
  },
});

const upload = multer({ storage });

// Middleware para servir archivos estáticos (imágenes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

module.exports = { app, upload };

