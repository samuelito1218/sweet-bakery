const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/metodosPagoController');

router.get('/', controller.getTodos);

module.exports = router;