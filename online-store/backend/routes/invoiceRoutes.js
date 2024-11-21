const express = require('express');
const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  getUserInvoices,
  getInvoiceWithUserDetails,
} = require('../controllers/invoiceController');

const router = express.Router();

router.post('/', createInvoice); // Crear una factura
router.get('/user', getUserInvoices); // Obtener facturas de un usuario (mover antes de /:id)
router.get('/:id', getInvoiceById); // Obtener factura por ID
router.put('/:id', updateInvoice); // Actualizar una factura
router.delete('/:id', deleteInvoice); // Eliminar una factura
router.get('/:id/with-user-details', getInvoiceWithUserDetails); // Obtener factura con detalles del usuario

module.exports = router;
