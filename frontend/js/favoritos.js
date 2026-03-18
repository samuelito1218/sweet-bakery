// ── Leer / guardar ────────────────────────────────
function obtenerFavoritos() {
  return JSON.parse(localStorage.getItem('favoritos')) || [];
}

function guardarFavoritos(lista) {
  localStorage.setItem('favoritos', JSON.stringify(lista));
  actualizarContadorFavoritos();
}

// ── Agregar o quitar (toggle) ─────────────────────
function toggleFavorito(producto) {
  const lista = obtenerFavoritos();
  const existe = lista.find(p => (p._id || p.id) === (producto._id || producto.id));

  if (existe) {
    guardarFavoritos(lista.filter(p => (p._id || p.id) !== (producto._id || producto.id)));
    return false; // quitado
  } else {
    lista.push(producto);
    guardarFavoritos(lista);
    return true; // agregado
  }
}

function esFavorito(id) {
  return obtenerFavoritos().some(p => (p._id || p.id) === id);
}

