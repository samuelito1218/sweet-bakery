const DetallePedido = require('../models/DetallePedido');

const crear = async (req, res) => {
  try {
    const detalle = new DetallePedido(req.body);
    await detalle.save();
    res.status(201).json(detalle);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al guardar detalle', error: error.message });
  }
};

const getPorPedido = async (req, res) => {
  try {
    const detalles = await DetallePedido.find({ pedidoId: req.params.pedidoId })
      .populate('productoId', 'nombre imagenPrincipal precio');
    res.json(detalles);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener detalles', error: error.message });
  }
};

module.exports = { crear, getPorPedido };