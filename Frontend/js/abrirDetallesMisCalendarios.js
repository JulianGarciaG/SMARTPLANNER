// Selecciona todos los botones de "detalles"
const botonesDetalles = document.querySelectorAll('.evento .detalles');

botonesDetalles.forEach(boton => {
    boton.addEventListener('click', () => {
        const opciones = boton.nextElementSibling; // el div.opciones que viene justo después
        opciones.style.display = (opciones.style.display === 'flex') ? 'none' : 'flex';
    });
});

window.addEventListener('click', (event) => {
    botonesDetalles.forEach(boton => {
        const opciones = boton.nextElementSibling;
        if (opciones.style.display === 'flex' && !boton.contains(event.target) && !opciones.contains(event.target)) {
            opciones.style.display = 'none';
        }
    });
});