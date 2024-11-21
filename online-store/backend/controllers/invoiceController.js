const Invoice = require('../modelsRelational/Invoice');
const jwt = require('jsonwebtoken');

// Crear una factura
exports.createInvoice = async (req, res) => {
  const { userId, total } = req.body;
  try {
    const invoice = await Invoice.create({ userId, total });
    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener todas las facturas
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll();
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener una factura por ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Factura no encontrada' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar una factura
exports.updateInvoice = async (req, res) => {
  const { total } = req.body;
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Factura no encontrada' });

    invoice.total = total || invoice.total;
    const updatedInvoice = await invoice.save();
    res.json(updatedInvoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar una factura
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Factura no encontrada' });

    await invoice.destroy();
    res.json({ message: 'Factura eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const User = require('../models/User'); // Modelo de MongoDB

// Obtener una factura específica con detalles del usuario
exports.getInvoiceWithUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar la factura en MySQL
    console.log(`Buscando factura con ID: ${id}`);
    const invoice = await Invoice.findByPk(id);

    if (!invoice) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }

    // Buscar el usuario en MongoDB
    console.log(`Buscando usuario con ID: ${invoice.userId}`);
    const user = await User.findById(invoice.userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Combinar datos de factura y usuario
    const enrichedInvoice = {
      ...invoice.toJSON(), // Convertir factura a objeto JSON
      user: {
        name: user.name,
        email: user.email,
      },
    };

    res.json(enrichedInvoice);
  } catch (err) {
    console.error('Error al obtener factura con detalles del usuario:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getUserInvoices = async (req, res) => {
  try {
    // Obtener el token desde los encabezados
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No autorizado, token no proporcionado' });
    }

    // Decodificar el token para obtener el userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // Extraer el ID del usuario del token

    console.log('User ID extraído del token:', userId);

    // Buscar facturas asociadas al userId y ordenarlas por fecha descendente
    const invoices = await Invoice.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']], // Ordenar por fecha más reciente
      include: [
        {
          model: require('../modelsRelational/invoiceDetails'),
          attributes: ['productName', 'quantity', 'price'], // Obtener detalles del producto
        },
      ],
    });

    if (!invoices || invoices.length === 0) {
      return res.status(404).json({ error: 'No se encontraron facturas para este usuario' });
    }

    res.json(invoices);
  } catch (err) {
    console.error('Error al obtener facturas del usuario:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
