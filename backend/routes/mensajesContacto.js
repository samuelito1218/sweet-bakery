const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/mensajesContactoController');

router.post('/', controller.crear);

module.exports = router;