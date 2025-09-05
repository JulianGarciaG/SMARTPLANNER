const cerrarMenuEventos = document.getElementById('cerrarMenuEventos');
const abrirMenuEvento = document.getElementById('abrirMenuEvento');
const agregarEvento = document.getElementById('agregarEvento');
const containerEvento = document.getElementById('containerEvento');
const cancelarEvento = document.getElementById('cancelarEvento');

const abrirAsociarGasto = document.getElementById('abrirAsociarGasto');
const asociarGasto = document.getElementById('asociarGasto');

abrirMenuEvento.addEventListener('click', () => {
    agregarEvento.style.display = 'flex';
});

cerrarMenuEventos.addEventListener('click', () => {
    agregarEvento.style.display = 'none';
});

cancelarEvento.addEventListener('click', () => {
    agregarEvento.style.display = 'none';
});

abrirAsociarGasto.addEventListener('click', () => {
    if (abrirAsociarGasto.checked) {
        asociarGasto.style.display = 'flex';
        containerEvento.style.height = 'auto';
    } else {
        asociarGasto.style.display = 'none';
        containerEvento.style.height = '500px';
    }
});
