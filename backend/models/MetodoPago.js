const mongoose = require('mongoose');

const metodoPagoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
      default: '',
    },
    descripcion: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MetodoPago', metodoPagoSchema);