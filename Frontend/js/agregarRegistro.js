const cerrarMenuRegistros = document.getElementById('cerrarMenuRegistros');
const abrirMenuRegistro = document.getElementById('abrirMenuRegistro');
const agregarRegistro = document.getElementById('agregarRegistro');
const containerRegistro = document.getElementById('containerRegistro');
const cancelarRegistro = document.getElementById('cancelarRegistro');

const abrirAsociarGasto = document.getElementById('abrirAsociarGasto');
const asociarGasto = document.getElementById('asociarGasto');

abrirMenuRegistro.addEventListener('click', () => {
    agregarRegistro.style.display = 'flex';
});

cerrarMenuRegistros.addEventListener('click', () => {
    agregarRegistro.style.display = 'none';
});

cancelarRegistro.addEventListener('click', () => {
    agregarRegistro.style.display = 'none';
});

abrirAsociarGasto.addEventListener('click', () => {
    if (abrirAsociarGasto.checked) {
        asociarGasto.style.display = 'flex';
        containerRegistro.style.height = 'auto';
    } else {
        asociarGasto.style.display = 'none';
        containerRegistro.style.height = '500px';
    }
});