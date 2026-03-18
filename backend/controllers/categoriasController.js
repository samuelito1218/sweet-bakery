const Categoria = require('../models/Categoria');

const getTodas = async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener categorías', error: error.message });
    }
};

const getUna = async (req, res) => {
    try {
        const categoria = await Categoria.findById(req.params.id);
        if (!categoria) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        res.json(categoria);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener categoría', error: error.message });
    }
};

module.exports = { getTodas, getUna };
