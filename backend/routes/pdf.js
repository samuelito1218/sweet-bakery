// routes/pdf.js - Rutas para descargar facturas en PDF

const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');

// GET /api/pdf/factura/:pedidoId - Descargar factura en PDF
router.get('/factura/:pedidoId', pdfController.generarFacturaPDF);

module.exports = router;
