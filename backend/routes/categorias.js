const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/categoriasController');

router.get('/',    controller.getTodas);
router.get('/:id', controller.getUna);

module.exports = router;