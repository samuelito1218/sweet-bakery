// =====================================================
// routes/productos.js — Sweet Bakery by Angel
// Define las rutas del recurso /api/productos.
// El controlador con la lógica está en controllers/productosController.js
// =====================================================

const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/productosController');

// GET  /api/productos          → todos los productos (con filtros opcionales)
// GET  /api/productos/:id      → un producto por ID
router.get('/',    controller.getTodos);
router.get('/:id', controller.getUno);

// Samuel / José: aquí irán las rutas de admin (POST, PUT, DELETE)
// router.post('/',    controller.crear);
// router.put('/:id',  controller.actualizar);
// router.delete('/:id', controller.eliminar);

module.exports = router;