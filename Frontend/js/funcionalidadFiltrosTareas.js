document.addEventListener("DOMContentLoaded", () => {
  const botonesFiltro = document.querySelectorAll(".filtros button");
  const tareas = document.querySelectorAll(".tarea");
  const checkboxes = document.querySelectorAll(".input-tarea");

  // 1️⃣ Inicializar todas como pendientes
  tareas.forEach((tarea) => tarea.classList.add("pendientes"));

  // 2️⃣ Marcar tareas como completadas o pendientes
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const li = this.closest(".tarea");
      if (this.checked) {
        li.classList.remove("pendientes");
        li.classList.add("completadas");
      } else {
        li.classList.remove("completadas");
        li.classList.add("pendientes");
      }
      console.log("Clase actual:", li.className); // 👈 debug
    });
  });

  // 3️⃣ Filtrar tareas
  botonesFiltro.forEach((boton) => {
    boton.addEventListener("click", function (e) {
      e.preventDefault();

      const texto = this.textContent.toLowerCase();

      tareas.forEach((tarea) => {
        if (texto.includes("todas")) {
          tarea.style.display = "flex";
        } else if (texto.includes("pendientes")) {
          tarea.style.display = tarea.classList.contains("pendientes")
            ? "flex"
            : "none";
        } else if (texto.includes("completadas")) {
          tarea.style.display = tarea.classList.contains("completadas")
            ? "flex"
            : "none";
        }
      });
    });
  });
});
