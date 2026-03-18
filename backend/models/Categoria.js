const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema(
  {
    nombreCategoria: {
      type: String,
      required: [true, 'El nombre de la categoría es obligatorio'],
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);


module.exports = mongoose.models.Categoria      || mongoose.model('Categoria', categoriaSchema);