const express = require('express');
const router = express.Router();
const controller = require('../controllers/facturasController');

// GET /api/facturas/:pedidoId
// Obtiene la factura HTML profesional de un pedido
router.get('/:pedidoId', controller.obtenerFacturaHTML);

module.exports = router;
