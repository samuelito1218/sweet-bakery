const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
      maxlength: [100, 'El nombre no puede superar 100 caracteres'],
    },
    descripcion: {
      type: String,
      trim: true,
      default: '',
    },
    subtitulo: {
      // Texto corto para mostrar bajo el nombre en la tarjeta
      type: String,
      trim: true,
      default: '',
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    categoria: {
      type: String,
      enum: ['rollos', 'galletas', 'waffles', 'tortas', 'especial'],
      required: [true, 'La categoría es obligatoria'],
    },
    imagen_url: {
      type: String,
      default: '/img/placeholder.jpg',
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    activo: {
      // false = producto oculto en la tienda
      type: Boolean,
      default: true,
    },
    destacado: {
      // true = aparece en la sección "Nuestros favoritos" del inicio
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // agrega createdAt y updatedAt automáticamente
  }
);

module.exports = mongoose.model('Producto', productoSchema);
