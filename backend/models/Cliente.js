const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema(
  {
    nombreCompleto: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    telefono: {
      type: String,
      required: [true, 'El teléfono es obligatorio'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Cliente        || mongoose.model('Cliente', clienteSchema);