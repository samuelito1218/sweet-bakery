const MensajeContacto = require('../models/MensajeContacto');

const crear = async (req, res) => {
  try {
    const mensaje = new MensajeContacto(req.body);
    await mensaje.save();
    res.status(201).json({ mensaje: 'Mensaje enviado correctamente' });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al enviar mensaje', error: error.message });
  }
};

module.exports = { crear };