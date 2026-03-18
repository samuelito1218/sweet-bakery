const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/clientesController');

router.post('/',    controller.crear);
router.get('/:id',  controller.getUno);

module.exports = router;