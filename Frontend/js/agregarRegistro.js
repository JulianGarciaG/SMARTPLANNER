// agregarRegistro.js - Solo abre/cierra el modal

const abrirModal = document.getElementById("abrirMenuRegistro");
const cerrarModal = document.getElementById("cerrarMenuRegistros");
const cancelarModal = document.getElementById("Cancelar-registro");
const modal = document.getElementById("agregarRegistro");

if (abrirModal) {
  abrirModal.addEventListener("click", () => {
    if (modal) modal.style.display = "flex";
  });
}

if (cerrarModal) {
  cerrarModal.addEventListener("click", () => {
    if (modal) modal.style.display = "none";
  });
}

if (cancelarModal) {
  cancelarModal.addEventListener("click", (e) => {
    e.preventDefault();
    if (modal) modal.style.display = "none";
  });
}