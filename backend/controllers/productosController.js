// =====================================================
// controllers/productosController.js — Sweet Bakery by Angel
// =====================================================

const Producto = require('../models/Producto');

// ── GET /api/productos ────────────────────────────
const getTodos = async (req, res) => {
  try {
    const filtro = { activo: true };

    if (req.query.categoriaId) filtro.categoriaId = req.query.categoriaId;
    if (req.query.precioMax)   filtro.precio = { $lte: Number(req.query.precioMax) };

    const productos = await Producto.find(filtro)
      .populate('categoriaId', 'nombreCategoria')
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
      .populate('categoriaId', 'nombreCategoria');

    if (!producto || !producto.activo) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el producto', error: error.message });
  }
};

// ── POST /api/productos ───────────────────────────
const crear = async (req, res) => {
  try {
    const producto = new Producto(req.body);
    await producto.save();
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear producto', error: error.message });
  }
};

// ── PUT /api/productos/:id ────────────────────────
const actualizar = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('categoriaId', 'nombreCategoria');

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar producto', error: error.message });
  }
};

// ── DELETE /api/productos/:id ─────────────────────
// No borra el documento, solo lo desactiva (activo: false)
const eliminar = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto desactivado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar producto', error: error.message });
  }
};

module.exports = { getTodos, getUno, crear, actualizar, eliminar };