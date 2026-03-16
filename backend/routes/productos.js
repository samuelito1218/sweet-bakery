const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/productosController');

// GET  /api/productos          → todos los productos (con filtros opcionales)
// GET  /api/productos/:id      → un producto por ID
router.get('/',    controller.getTodos);
router.get('/:id', controller.getUno);

module.exports = router;
