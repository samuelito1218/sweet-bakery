/* =====================================================
   whatsapp.js — Sweet Bakery by Angel
   Genera el mensaje automático de WhatsApp con
   el resumen del pedido y redirige al checkout.
   ===================================================== */

const NUMERO_WHATSAPP = '573014132284'; // ← Reemplazar con el número real

// ── Generar y enviar pedido por WhatsApp ──────────
function enviarPedidoPorWhatsApp() {
  const carrito    = obtenerCarrito();        // viene de carrito.js
  const datosCrudo = localStorage.getItem('datosPedido');

  if (carrito.length === 0) {
    mostrarNotificacion('Tu carrito está vacío 😕');
    return;
  }

  if (!datosCrudo) {
    mostrarNotificacion('Completa tus datos primero');
    return;
  }

  const datos = JSON.parse(datosCrudo);

  // ── Armar el mensaje ───────────────────────────
  let msg = `🍰 *NUEVO PEDIDO — Sweet Bakery by Angel*\n\n`;
  msg += `👤 *Cliente:* ${datos.nombre}\n`;
  msg += `📞 *Teléfono:* ${datos.telefono}\n`;
  msg += `📦 *Método de entrega:* ${datos.metodo === 'domicilio' ? '🛵 Domicilio' : '🏠 Recoge en tienda'}\n`;

  if (datos.metodo === 'domicilio' && datos.direccion) {
    msg += `📍 *Dirección:* ${datos.direccion}\n`;
  }

  msg += `📅 *Fecha deseada:* ${datos.fecha}\n`;
  msg += `⏰ *Horario:* ${datos.horario || 'A convenir'}\n\n`;
  msg += `🛒 *Productos del pedido:*\n`;

  carrito.forEach(p => {
    msg += `  • ${p.nombre} × ${p.cantidad}  →  $${(p.precio * p.cantidad).toLocaleString('es-CO')}\n`;
  });

  const total = calcularTotal(); // viene de carrito.js
  msg += `\n💰 *TOTAL: $${total.toLocaleString('es-CO')} COP*`;

  if (datos.nota) {
    msg += `\n\n📝 *Nota especial:* ${datos.nota}`;
  }

  msg += `\n\n_Pedido generado desde sweetbakery.com_`;

  const orderNumber = Math.floor(Math.random() * 900000) + 100000;
  localStorage.setItem('lastOrder', JSON.stringify({
    orderNumber,
    items: carrito,
    total: calcularTotal(),
    date: new Date().toISOString()
  }));

  limpiarYRedirigir(msg);
}

// ── Limpiar datos y redirigir ─────────────────────
function limpiarYRedirigir(mensaje) {
  const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;

  // Limpiar carrito y datos del formulario
  vaciarCarrito();                             // viene de carrito.js
  localStorage.removeItem('datosPedido');

  // Abrir WhatsApp en nueva pestaña y redirigir a confirmación
  window.open(url, '_blank');
  window.location.href = 'confirmacion.html';
}

// ── Guardar datos del formulario de checkout ──────
// Llamar desde checkout.html al enviar el formulario
function guardarDatosPedido(formData) {
  localStorage.setItem('datosPedido', JSON.stringify(formData));
}
