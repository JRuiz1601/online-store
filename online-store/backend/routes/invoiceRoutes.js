const express = require('express');
const { createInvoice, getInvoices, getInvoiceById, updateInvoice, deleteInvoice } = require('../controllers/invoiceController');
const router = express.Router();

router.post('/', createInvoice); // Crear una factura
router.get('/', getInvoices); // Obtener todas las facturas
router.get('/:id', getInvoiceById); // Obtener factura por ID
router.put('/:id', updateInvoice); // Actualizar una factura
router.delete('/:id', deleteInvoice); // Eliminar una factura

module.exports = router;

const { getInvoiceWithUserDetails } = require('../controllers/invoiceController');

router.get('/:id/with-user-details', getInvoiceWithUserDetails);
