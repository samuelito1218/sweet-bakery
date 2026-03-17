const Pedido = require('../models/Pedido');

const crear = async (req, res) => {
    try {
        const pedido = new Pedido(req.body);
        await pedido.save();
        res.status(201).json(pedido);
    }
    catch (error) {
        res.status(400).json({ mensaje: 'Error al crear pedido', error: error.message });
    }
};

const getUno = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) return res.status(404).json({ mensaje: 'Pedido no encontrado' });
        res.json(pedido);
    }
    catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener pedido', error: error.message });
    }
};

const getPorCliente = async (req, res) => {
    try {
        const pedidos = await Pedido.find({ clienteId: req.params.clienteId });
        res.json(pedidos);
    }
    catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener pedidos', error: error.message });
    }
};

module.exports = { crear, getUno, getPorCliente };