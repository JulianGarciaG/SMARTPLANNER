const abrirEditarProgresoAhorro = document.getElementById('abrirEditarProgresoAhorro');
const editarProgresoAhorro = document.getElementById('editarProgresoAhorro');
const cerrarEditarProgresoAhorro = document.getElementById('cerrarEditarProgresoAhorro');
const cancelar = document.getElementById('cancelar');

abrirEditarProgresoAhorro.addEventListener('click', () => {
    if (editarProgresoAhorro.style.display === "flex") {
        editarProgresoAhorro.style.display = "none";
    } else {
        editarProgresoAhorro.style.display = "flex";
    }
});

cerrarEditarProgresoAhorro.addEventListener('click', () => {
    editarProgresoAhorro.style.display = "none";
});

cancelar.addEventListener('click', () => {
    editarProgresoAhorro.style.display = "none";
});