const MetodoPago = require('../models/MetodoPago');

const getTodos = async (req, res) => {
  try {
    const metodos = await MetodoPago.find().sort({ nombre: 1 });
    res.json(metodos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener métodos de pago', error: error.message });
  }
};

module.exports = { getTodos };