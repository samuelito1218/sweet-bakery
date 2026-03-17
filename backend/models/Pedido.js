const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema(
  {
    clienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente',             // referencia a la colección clientes (José)
      required: [true, 'El cliente es obligatorio'],
    },
    direccionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Direccion',           // referencia a la colección direcciones (José)
      required: false,            // solo aplica si metodoEntrega es 'domicilio'
    },
    fechaPedido: {
      type: Date,
      required: [true, 'La fecha del pedido es obligatoria'],
      default: Date.now,
    },
    fechaEntrega: {
      type: Date,
      required: false,
    },
    horarioEntrega: {
      type: String,
      trim: true,
      default: '',
    },
    metodoEntrega: {
      type: String,
      trim: true,
      // valores esperados: 'domicilio' o 'recoger_en_tienda'
      default: '',
    },
    metodoPago: {
      type: String,
      trim: true,
      // valores esperados: 'efectivo', 'transferencia', 'nequi', etc.
      default: '',
    },
    mensajeEspecial: {
      type: String,
      trim: true,
      default: '',
    },
    total: {
      type: Number,
      required: [true, 'El total es obligatorio'],
      min: [0, 'El total no puede ser negativo'],
    },
    estado: {
      type: String,
      trim: true,
      // valores esperados: 'pendiente', 'confirmado', 'entregado', 'cancelado'
      default: 'pendiente',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Pedido', pedidoSchema);