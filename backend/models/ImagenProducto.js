const mongoose = require('mongoose');

const imagenProductoSchema = new mongoose.Schema(
  {
    productoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: [true, 'El producto es obligatorio'],
    },
    urlImagen: {
      type: String,
      required: [true, 'La URL de la imagen es obligatoria'],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.ImagenProducto || mongoose.model('ImagenProducto', imagenProductoSchema);