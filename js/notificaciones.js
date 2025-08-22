const abrirNotificacion = document.getElementById('abrirNotificacion');
const notificaciones = document.getElementById('notificaciones');

abrirNotificacion.addEventListener('click', () => {
    if (notificaciones.style.display === 'flex') {
        notificaciones.style.display = 'none';
    } else {
        notificaciones.style.display = 'flex';
    }
})