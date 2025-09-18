const cerrarMenuFinanzas = document.getElementById('cerrarMenuFinanzas');
const abrirMenuFinanza = document.getElementById('abrirMenuFinanza'); 
const agregarFinanza = document.getElementById('agregarFinanza');
const containerFinanza = document.getElementById('containerFinanza');
const cancelarFinanza = document.getElementById('cancelarFinanza');

const abrirAsociarGasto = document.getElementById('abrirAsociarGasto');
const asociarGasto = document.getElementById('asociarGasto');

abrirMenuFinanza.addEventListener('click', () => {
    agregarFinanza.style.display = 'flex';
});

cerrarMenuFinanzas.addEventListener('click', () => {
    agregarFinanza.style.display = 'none';
});

cancelarFinanza.addEventListener('click', () => {
    agregarFinanza.style.display = 'none';
});

if (abrirAsociarGasto) {
    abrirAsociarGasto.addEventListener('click', () => {
        if (abrirAsociarGasto.checked) {
            asociarGasto.style.display = 'flex';
            containerFinanza.style.height = 'auto';
        } else {
            asociarGasto.style.display = 'none';
            containerFinanza.style.height = '500px';
        }
    });
}
