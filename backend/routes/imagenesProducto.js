const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/imagenesProductoController');

router.get('/producto/:productoId', controller.getPorProducto);

module.exports = router;