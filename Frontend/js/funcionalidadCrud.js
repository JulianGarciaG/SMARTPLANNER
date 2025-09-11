document.addEventListener("DOMContentLoaded", () => {
    const editarBtns = document.querySelectorAll(".crud .editar");
    const eliminarBtns = document.querySelectorAll(".crud .eliminar");

    const menuEditar = document.querySelector(".editar-tarea");
    const menuEliminar = document.querySelector("#menuEliminar");

    const cerrarMenuEditar = document.getElementById("cerrarMenuEditar");
    const cancelarEditar = document.getElementById("CancelarEditar");

    const cancelarEliminar = document.getElementById("cancelarEliminar");

    // Abrir menú editar
    editarBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            menuEditar.style.display = "flex";
        });
    });

    // Cerrar menú editar
    [cerrarMenuEditar, cancelarEditar].forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault(); // prevenir que recargue formulario
            menuEditar.style.display = "none";
        });
    });

    // Abrir menú eliminar
    eliminarBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            menuEliminar.style.display = "flex";
        });
    });

    // Cerrar menú eliminar
    cancelarEliminar.addEventListener("click", () => {
        menuEliminar.style.display = "none";
    });
});
