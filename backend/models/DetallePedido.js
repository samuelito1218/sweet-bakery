const mongoose = require('mongoose');

const detallePedidoSchema = new mongoose.Schema(
  {
    pedidoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pedido',
      required: [true, 'El pedido es obligatorio'],
    },
    productoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: [true, 'El producto es obligatorio'],
    },
    cantidad: {
      type: Number,
      required: [true, 'La cantidad es obligatoria'],
      min: [1, 'La cantidad mínima es 1'],
    },
    precioUnitario: {
      type: Number,
      default: 0,
    },
    subtotal: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.DetallePedido  || mongoose.model('DetallePedido', detallePedidoSchema);