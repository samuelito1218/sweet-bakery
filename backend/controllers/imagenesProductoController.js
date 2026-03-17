const ImagenProducto = require('../models/ImagenProducto');

const getPorProducto = async (req, res) => {
  try {
    const imagenes = await ImagenProducto.find({ productoId: req.params.productoId });
    res.json(imagenes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener imágenes', error: error.message });
  }
};

module.exports = { getPorProducto };