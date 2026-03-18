const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/detallePedidoController');

router.post('/',                        controller.crear);
router.get('/pedido/:pedidoId',         controller.getPorPedido);

module.exports = router;