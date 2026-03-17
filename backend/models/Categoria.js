const mongoose = require('mongoose');

const direccionSchema = new mongoose.Schema(
  {
    clienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente',
      required: [true, 'El cliente es obligatorio'],
    },
    direccion: {
      type: String,
      required: [true, 'La dirección es obligatoria'],
      trim: true,
    },
    ciudad: {
      type: String,
      required: [true, 'La ciudad es obligatoria'],
      trim: true,
      default: 'Cali',
    },
    referencia: {
      type: String,
      required: [true, 'La referencia es obligatoria'],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Direccion', direccionSchema);