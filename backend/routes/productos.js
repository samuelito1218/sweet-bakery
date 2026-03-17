const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/productosController');

router.get('/',     controller.getTodos);
router.get('/:id',  controller.getUno);
router.post('/',    controller.crear);
router.put('/:id',  controller.actualizar);
router.delete('/:id', controller.eliminar);

module.exports = router;