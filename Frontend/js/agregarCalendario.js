const abrirMenuCalendario = document.getElementById('abrirMenuCalendario');
const cerrarMenuCalendarios = document.getElementById('cerrarMenuCalendarios');
const cancelarCalendario = document.getElementById('cancelarCalendario');
const agregarCalendario = document.getElementById('agregarCalendario');

const compartirCalendario = document.getElementById('compartirCalendario');
const permisosCompartir = document.getElementById('permisosCompartir');

// Abrir formulario
abrirMenuCalendario.addEventListener('click', () => {
  agregarCalendario.style.display = 'flex';
});

// Cerrar formulario
cerrarMenuCalendarios.addEventListener('click', () => {
  agregarCalendario.style.display = 'none';
});
cancelarCalendario.addEventListener('click', () => {
  agregarCalendario.style.display = 'none';
});

// Mostrar/ocultar permisos
compartirCalendario.addEventListener('change', () => {
  if (compartirCalendario.checked) {
    permisosCompartir.style.display = 'block';
  } else {
    permisosCompartir.style.display = 'none';
  }
});


document.querySelectorAll(".color-circle").forEach(circle => {
  circle.addEventListener("click", function() {
    // Quitar selección previa
    document.querySelectorAll(".color-circle").forEach(c => c.classList.remove("selected"));
    
    // Agregar selección a este
    this.classList.add("selected");
    
    // Guardar el valor en el input oculto
    document.getElementById("colorSeleccionado").value = this.dataset.color;
    
    console.log("Color elegido:", this.dataset.color); // solo para verificar
  });
});
