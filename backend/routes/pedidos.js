const express = require('express');
const router = express.Router();
const controller = require('../controllers/pedidosController');

router.post('/', controller.crear);
router.get('/:id', controller.getUno);
router.get('/cliente/:clienteId', controller.getPorCliente);

module.exports = router;