// ── Leer / guardar ────────────────────────────────
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem('carrito')) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContadorCarrito();
}

// ── Obtener ID compatible con MongoDB y arrays locales ──
function getId(p) {
  return p._id || p.id;
}

// ── Agregar producto ──────────────────────────────
function agregarAlCarrito(id, listaProductos) {
  const carrito = obtenerCarrito();
  const existente = carrito.find(p => getId(p) === id);

  if (existente) {
    existente.cantidad++;
  } else {
    const producto = listaProductos.find(p => getId(p) === id);
    if (!producto) return;
    carrito.push({ ...producto, cantidad: 1 });
  }

  guardarCarrito(carrito);
  mostrarNotificacion('¡Agregado al carrito! 🛒');
}

// ── Eliminar producto ─────────────────────────────
function eliminarDelCarrito(id) {
  const carrito = obtenerCarrito().filter(p => getId(p) !== id);
  guardarCarrito(carrito);
}

// ── Cambiar cantidad ──────────────────────────────
function cambiarCantidad(id, nuevaCantidad) {
  const carrito = obtenerCarrito();
  const item = carrito.find(p => getId(p) === id);
  if (!item) return;

  const cantidad = parseInt(nuevaCantidad);
  if (cantidad <= 0) {
    eliminarDelCarrito(id);
  } else {
    item.cantidad = cantidad;
    guardarCarrito(carrito);
  }
}

// ── Calcular total ────────────────────────────────
function calcularTotal() {
  return obtenerCarrito().reduce((total, p) => total + (p.precio * p.cantidad), 0);
}

// ── Vaciar carrito ────────────────────────────────
function vaciarCarrito() {
  localStorage.removeItem('carrito');
  actualizarContadorCarrito();
}

// ── Actualizar contador en el header ─────────────
function actualizarContadorCarrito() {
  const carrito = obtenerCarrito();
  const total = carrito.reduce((sum, p) => sum + p.cantidad, 0);

  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = total;

  const headerBadge = document.getElementById('header-cart-count');
  if (headerBadge) {
    headerBadge.textContent = total;
    headerBadge.style.display = total > 0 ? 'flex' : 'none';
  }
}

// ── Toast de notificación ─────────────────────────
function mostrarNotificacion(mensaje) {
  const n = document.createElement('div');
  n.className = 'notificacion';
  n.textContent = mensaje;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 2500);
}

// ── Inicializar al cargar cualquier página ────────
document.addEventListener('DOMContentLoaded', () => {
  actualizarContadorCarrito();
});