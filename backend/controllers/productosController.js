const Producto = require('../models/Producto');

// ── GET /api/productos ────────────────────────────
// Query params opcionales: ?categoria=galletas&precioMax=15000&destacado=true
const getTodos = async (req, res) => {
  try {
    const filtro = { activo: true };

    if (req.query.categoria)  filtro.categoria  = req.query.categoria;
    if (req.query.destacado)  filtro.destacado   = req.query.destacado === 'true';
    if (req.query.precioMax)  filtro.precio      = { $lte: Number(req.query.precioMax) };

    const productos = await Producto.find(filtro).sort({ createdAt: -1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message });
  }
};

// ── GET /api/productos/:id ────────────────────────
const getUno = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto || !producto.activo) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el producto', error: error.message });
  }
};


module.exports = { getTodos, getUno };
