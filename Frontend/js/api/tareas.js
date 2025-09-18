document.addEventListener("DOMContentLoaded", () => {
  const crearBtn = document.getElementById("Crear-registro");
  const usuarioJSON = localStorage.getItem("usuario");
    const imgUsuarioHeader = document.getElementById("imgUsuarioHeader");

    if (!imgUsuarioHeader) return; // Si no existe la imagen, salimos

    if (usuarioJSON) {
        const usuario = JSON.parse(usuarioJSON);
        // Si el usuario tiene foto, la ponemos
        if (usuario.foto) {
            imgUsuarioHeader.src = usuario.foto;
        }
    }

  crearBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const idUsuario = localStorage.getItem("id_usuario"); // 👈 recuperamos el usuario guardado
    if (!idUsuario) {
      alert("Debes iniciar sesión primero");
      window.location.href = "login.html";
      return;
    }

    const tarea = {
      nombre: document.querySelector(".titulo input").value,
      descripcion: document.querySelector(".descripcion input").value,
      prioridad: document.querySelector(".prioridad select").value,
      fecha_limite: document.querySelector(".fecha-limite input").value,
      categoria: document.getElementById("abrirAsociarGasto").checked ? "asociada" : "sin_asociar",
      estado_de_tarea: false, // 👈 pendiente por defecto
      id_usuario: parseInt(idUsuario) // 👈 enviar número, no objeto
    };


    try {
      const response = await fetch("http://localhost:8080/api/tareas/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarea),
      });

      if (response.ok) {
        alert("Tarea creada con éxito ✅");
      } else {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear tarea ❌: " + error.message);
    }
  });


});
