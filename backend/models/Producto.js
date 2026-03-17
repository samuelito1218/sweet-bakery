const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
  {
    categoriaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categoria',           // referencia a la colección categorias (José)
      required: false,
    },
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
      default: '',
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    ingredientes: {
      type: String,
      trim: true,
      default: '',
    },
    alergenos: {
      type: String,
      trim: true,
      default: '',
    },
    imagenPrincipal: {
      // Solo el nombre del archivo, ej: "rollos-canela.jpg"
      // En el frontend se usa como: src="img/${producto.imagenPrincipal}"
      type: String,
      default: 'placeholder.jpg',
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Producto', productoSchema);