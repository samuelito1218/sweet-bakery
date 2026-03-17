// =====================================================
// controllers/productosController.js — Sweet Bakery by Angel
// Lógica de los endpoints de productos.
// =====================================================

const Producto = require('../models/Producto');

// ── GET /api/productos ────────────────────────────
// Query params opcionales: ?categoriaId=xxx&precioMax=15000&activo=true
const getTodos = async (req, res) => {
  try {
    const filtro = { activo: true };

    if (req.query.categoriaId) filtro.categoriaId = req.query.categoriaId;
    if (req.query.precioMax)   filtro.precio = { $lte: Number(req.query.precioMax) };

    const productos = await Producto.find(filtro)
      .populate('categoriaId', 'nombre')  // trae el nombre de la categoría
      .sort({ createdAt: -1 });

    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message });
  }
};

// ── GET /api/productos/:id ────────────────────────
const getUno = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id)
      .populate('categoriaId', 'nombre');

    if (!producto || !producto.activo) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el producto', error: error.message });
  }
};

module.exports = { getTodos, getUno };