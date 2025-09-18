const cerrarMenuPlanAhorro = document.getElementById('cerrarMenuPlanAhorro');
const abrirMenuPlanAhorro = document.getElementById('abrirMenuPlanAhorro'); 
const agregarPlanAhorro = document.getElementById('agregarPlanAhorro');
const containerPlanAhorro = document.getElementById('containerPlanAhorro');
const cancelarPlanAhorro = document.getElementById('cancelarPlanAhorro');

abrirMenuPlanAhorro.addEventListener('click', () => {
    agregarPlanAhorro.style.display = 'flex';
});

cerrarMenuPlanAhorro.addEventListener('click', () => {
    agregarPlanAhorro.style.display = 'none';
});

cancelarPlanAhorro.addEventListener('click', () => {
    agregarPlanAhorro.style.display = 'none';
});
