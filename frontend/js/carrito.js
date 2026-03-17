/* =====================================================
   carrito.js — Sweet Bakery by Angel
   Lógica del carrito con LocalStorage.
   Este archivo es importado por TODAS las páginas
   que necesiten leer o modificar el carrito.
   ===================================================== */

// ── Leer / guardar ────────────────────────────────
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem('carrito')) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContadorCarrito();
}

// ── Agregar producto ──────────────────────────────
// Recibe el id del producto y el array de productos disponibles en la página
function agregarAlCarrito(id, listaProductos) {
  const carrito = obtenerCarrito();
  const existente = carrito.find(p => p.id === id);

  if (existente) {
    existente.cantidad++;
  } else {
    const producto = listaProductos.find(p => p.id === id);
    if (!producto) return;
    carrito.push({ ...producto, cantidad: 1 });
  }

  guardarCarrito(carrito);
  mostrarNotificacion('¡Agregado al carrito! 🛒');

  // Feedback visual en el botón
  const btns = document.querySelectorAll(`.btn-carrito`);
  btns.forEach(btn => {
    if (btn.getAttribute('onclick')?.includes(`${id}`)) {
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="bi bi-check-lg"></i>';
      btn.style.background = 'var(--menta-dark)';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
      }, 1000);
    }
  });
}

// ── Eliminar producto ─────────────────────────────
function eliminarDelCarrito(id) {
  const carrito = obtenerCarrito().filter(p => p.id !== id);
  guardarCarrito(carrito);
}

// ── Cambiar cantidad ──────────────────────────────
function cambiarCantidad(id, nuevaCantidad) {
  const carrito = obtenerCarrito();
  const item = carrito.find(p => p.id === id);
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

// ── Actualizar contador en el ícono del header ────
function actualizarContadorCarrito() {
  const carrito = obtenerCarrito();
  const total = carrito.reduce((sum, p) => sum + p.cantidad, 0);

  // Badge del viejo navbar (si existe)
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = total;

  // Badge del nuevo header (componente reutilizable)
  const headerBadge = document.getElementById('header-cart-count');
  if (headerBadge) {
    headerBadge.textContent = total;
    headerBadge.style.display = total > 0 ? 'flex' : 'none';
  }
}

// ── Renderizar lista del carrito (carrito.html) ───
function renderizarCarrito() {
  const carrito = obtenerCarrito();
  const lista   = document.getElementById('lista-carrito');
  const totalEl = document.getElementById('total-carrito');
  const emptyEl = document.getElementById('carrito-vacio');
  const contenidoEl = document.getElementById('carrito-contenido');

  if (!lista) return; // Solo ejecutar en carrito.html

  if (carrito.length === 0) {
    if (emptyEl)    emptyEl.style.display    = 'block';
    if (contenidoEl) contenidoEl.style.display = 'none';
    return;
  }

  if (emptyEl)    emptyEl.style.display    = 'none';
  if (contenidoEl) contenidoEl.style.display = 'block';

  lista.innerHTML = carrito.map(p => `
    <div class="carrito-item d-flex align-items-center gap-3 p-3 bg-white rounded-3 shadow-sm mb-3">
      <img src="${p.imagen}" alt="${p.nombre}"
           style="width:70px;height:70px;object-fit:cover;border-radius:10px;" />
      <div class="flex-grow-1">
        <p class="fw-bold mb-0" style="font-size:.9rem;">${p.nombre}</p>
        <p class="text-muted mb-1" style="font-size:.78rem;">${p.subtitulo}</p>
        <span style="color:var(--rosa);font-weight:700;font-size:.9rem;">
          $${(p.precio * p.cantidad).toLocaleString('es-CO')}
        </span>
      </div>
      <div class="d-flex flex-column align-items-center gap-2">
        <div class="d-flex align-items-center gap-2">
          <button class="btn-cantidad" onclick="cambiarCantidad(${p.id}, ${p.cantidad - 1}); renderizarCarrito()">−</button>
          <span style="font-weight:700;min-width:20px;text-align:center;">${p.cantidad}</span>
          <button class="btn-cantidad" onclick="cambiarCantidad(${p.id}, ${p.cantidad + 1}); renderizarCarrito()">+</button>
        </div>
        <button class="btn-eliminar" onclick="eliminarDelCarrito(${p.id}); renderizarCarrito()">
          <i class="bi bi-trash3"></i>
        </button>
      </div>
    </div>`).join('');

  if (totalEl) totalEl.textContent = `$${calcularTotal().toLocaleString('es-CO')}`;
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
  renderizarCarrito(); // Solo hace algo si está en carrito.html
});