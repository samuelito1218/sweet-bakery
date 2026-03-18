const express = require('express');
const router = express.Router();
const controller = require('../controllers/pedidosController');

// Ruta de checkout ANTES de las rutas con parámetros
router.post('/checkout/procesar', controller.checkout);

router.post('/', controller.crear);
router.get('/:id', controller.getUno);
router.get('/cliente/:clienteId', controller.getPorCliente);

module.exports = router;