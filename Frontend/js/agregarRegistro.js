const cerrarMenuRegistros = document.getElementById('cerrarMenuRegistros');
const abrirMenuRegistro = document.getElementById('abrirMenuRegistro');
const agregarRegistro = document.getElementById('agregarRegistro');
const containerRegistro = document.getElementById('containerRegistro');
const cancelarRegistro = document.getElementById('Cancelar-registro');

const abrirAsociarGasto = document.getElementById('abrirAsociarGasto');
const asociarGasto = document.getElementById('asociarGasto');

abrirMenuRegistro.addEventListener('click', () => {
    agregarRegistro.style.display = 'flex';
    // Restaurar título y botón en modo creación
    const tituloModal = document.querySelector('#containerRegistro > h1');
    if (tituloModal) tituloModal.textContent = 'Nueva Tarea';
    const crearBtn = document.getElementById('Crear-registro');
    if (crearBtn) crearBtn.textContent = 'Crear';
});

cerrarMenuRegistros.addEventListener('click', () => {
    agregarRegistro.style.display = 'none';
});

cancelarRegistro.addEventListener('click', (e) => {
    e.preventDefault();
    agregarRegistro.style.display = 'none';
});

abrirAsociarGasto.addEventListener('change', () => {
    if (abrirAsociarGasto.checked) {
        asociarGasto.style.display = 'flex';
        containerRegistro.style.height = 'auto';
    } else {
        asociarGasto.style.display = 'none';
        containerRegistro.style.height = '500px';
    }
});
