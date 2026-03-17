/**
 * components.js
 * Carga header, footer y bottom-nav desde archivos HTML externos.
 *
 * Uso en cada página:
 *   <div id="header-placeholder"></div>
 *   <div class="header-height"></div>
 *   ... contenido ...
 *   <div id="footer-placeholder"></div>
 *   <div id="bottomnav-placeholder"></div>
 *   <script src="js/components.js"></script>
 */

/* ── Cargar componente ── */
async function loadComponent(id, url) {
  const el = document.getElementById(id);
  if (!el) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error cargando ${url}`);
    el.innerHTML = await res.text();
  } catch (err) {
    console.error(err);
  }
}

/* ── Detectar página actual y marcar links activos ── */
function setActiveLinks() {
  // Obtener nombre del archivo actual (ej: "catalogo" de "catalogo.html")
  const path = window.location.pathname;
  const file = path.substring(path.lastIndexOf('/') + 1).replace('.html', '') || 'index';

  // Bottom nav
  document.querySelectorAll('.bottom-nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === file);
  });

  // Sidebar
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === file);
  });
}

/* ── Sidebar toggle ── */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('open');
  document.body.classList.toggle('no-scroll');
}

/* ── Contador del carrito en el header ── */
function updateHeaderCart() {
  const badge = document.getElementById('header-cart-count');
  if (!badge) return;
  const cart = JSON.parse(localStorage.getItem('carrito') || '[]');
  const total = cart.reduce((sum, item) => sum + (item.cantidad || 1), 0);
  badge.textContent = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    loadComponent('header-placeholder', 'components/header.html'),
    loadComponent('footer-placeholder', 'components/footer.html'),
    loadComponent('bottomnav-placeholder', 'components/bottom-nav.html')
  ]);
  setActiveLinks();
  updateHeaderCart();
});