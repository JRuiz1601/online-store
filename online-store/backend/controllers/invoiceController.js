const Invoice = require('../modelsRelational/Invoice');

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
