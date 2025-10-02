console.log("Script de abrir detalles cargado");

const botonesDetalles = document.querySelectorAll('.evento .detalles');

botonesDetalles.forEach(boton => {
    boton.addEventListener('click', (e) => {
        e.stopPropagation(); // para que no se cierre inmediatamente
        const opciones = boton.nextElementSibling;
        opciones.style.display = 'flex';
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
