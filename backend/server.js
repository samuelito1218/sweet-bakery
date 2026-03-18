// =====================================================
// server.js — Sweet Bakery by Angel
// Punto de entrada del servidor Node.js + Express
// =====================================================

require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const path      = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ───────────────────────────────────
app.use(cors());
app.use(express.json());

// Sirve las imágenes del frontend como archivos estáticos
// Acceso: http://localhost:3000/img/rollos-canela.jpg
app.use('/img', express.static(path.join(__dirname, '../frontend/img')));

// ── Rutas ─────────────────────────────────────────
app.use('/api/productos',        require('./routes/productos'));
app.use('/api/pedidos',          require('./routes/pedidos'));
app.use('/api/categorias',       require('./routes/categorias'));
app.use('/api/clientes',         require('./routes/clientes'));
app.use('/api/direcciones',      require('./routes/direcciones'));
app.use('/api/detalle-pedido',   require('./routes/detallePedido'));
app.use('/api/metodos-pago',     require('./routes/metodosPago'));
app.use('/api/mensajes-contacto',require('./routes/mensajesContacto'));
app.use('/api/imagenes-producto',require('./routes/imagenesProducto'));
app.use('/api/facturas',         require('./routes/facturas'));
app.use('/api/pdf',              require('./routes/pdf'));
app.use('/api/whatsapp',         require('./routes/whatsapp'));

// ── Ruta de prueba ────────────────────────────────
app.get('/', (req, res) => {
  res.json({ mensaje: '🍰 Sweet Bakery API corriendo correctamente' });
});

// ── Conexión a MongoDB Atlas ──────────────────────

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
  });