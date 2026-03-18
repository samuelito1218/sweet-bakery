const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/direccionesController');

router.post('/',                          controller.crear);
router.get('/cliente/:clienteId',         controller.getPorCliente);

module.exports = router;