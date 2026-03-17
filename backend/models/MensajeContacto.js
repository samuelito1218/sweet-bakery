const mongoose = require('mongoose');

const mensajeContactoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    mensaje: {
      type: String,
      trim: true,
      default: '',
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MensajeContacto', mensajeContactoSchema);