const Direccion = require('../models/Direccion');

const crear = async (req, res) => {
  try {
    const direccion = new Direccion(req.body);
    await direccion.save();
    res.status(201).json(direccion);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al guardar dirección', error: error.message });
  }
};

const getPorCliente = async (req, res) => {
  try {
    const direcciones = await Direccion.find({ clienteId: req.params.clienteId });
    res.json(direcciones);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener direcciones', error: error.message });
  }
};

module.exports = { crear, getPorCliente };