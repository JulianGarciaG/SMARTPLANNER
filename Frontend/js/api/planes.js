document.addEventListener("DOMContentLoaded", async () => {
  const API_URL = 'http://localhost:8080/api';
  
  // 🔹 Verificar sesión
  const usuarioJSON = localStorage.getItem("usuario");
  if (!usuarioJSON) {
    window.location.href = "../index.html";
    return;
  }
  const usuario = JSON.parse(usuarioJSON);
  window.usuarioActual = usuario; // Hacer disponible globalmente

  // 🔹 Referencias al DOM
  const imgPerfil = document.getElementById("imgPerfil");
  const inputFoto = document.getElementById("inputFoto");
  const btnCambiarFoto = document.getElementById("btnCambiarFoto");
  const formPerfil = document.getElementById("profileForm");
  const nombreInput = document.getElementById("nombre");
  const contrasenaInput = document.getElementById("contrasena");
  const confirmContrasenaInput = document.getElementById("confirmContrasena");
  const logoutBtn = document.getElementById("logoutBtn");
  const nameH2 = document.querySelector(".name");
  const emailDiv = document.querySelector(".email");

  let archivoFoto = null; // archivo temporal

  // 🔹 Cargar datos del usuario logueado y suscripción
  function cargarDatosUsuario() {
    if (usuario.foto) imgPerfil.src = usuario.foto;
    if (usuario.nombre) {
      nombreInput.value = usuario.nombre;
      if (nameH2) nameH2.textContent = usuario.nombre;
    }
    if (usuario.correoElectronico && emailDiv) {
      emailDiv.textContent = usuario.correoElectronico;
    }
  }
  
  // 🔹 Cargar información de la suscripción actual
  async function cargarSuscripcionEnPerfil() {
    try {
        const response = await fetch(`${API_URL}/planes/suscripcion/usuario/${usuario.idUsuario}`);
        
        if (response.ok) {
            const suscripcion = await response.json();
            actualizarInfoPlanEnPerfil(suscripcion);
        } else {
            // Plan gratuito por defecto
            actualizarInfoPlanEnPerfil(null);
        }
        
    } catch (error) {
        console.error('Error al cargar suscripción:', error);
        actualizarInfoPlanEnPerfil(null);
    }
  }

  function actualizarInfoPlanEnPerfil(suscripcion) {
    const planNameElement = document.querySelector('.plan-name');
    const planPriceElement = document.querySelector('.plan-price');
    const planNextBillingElement = document.querySelector('.plan-next-billing span');
    
    if (suscripcion && suscripcion.estado === 'activa') {
        planNameElement.textContent = suscripcion.nombrePlan;
        planPriceElement.textContent = `$${suscripcion.precio.toLocaleString()} COP/mes`;
        
        const fechaFin = new Date(suscripcion.fechaFin);
        planNextBillingElement.textContent = `Próximo cobro: ${fechaFin.toLocaleDateString('es-ES')}`;
    } else {
        planNameElement.textContent = 'Gratuito';
        planPriceElement.textContent = '$0 COP/mes';
        planNextBillingElement.textContent = 'Próximo cobro: Plan gratuito';
    }
  }

  // Cargar datos iniciales
  cargarDatosUsuario();
  await cargarSuscripcionEnPerfil();

  // 🔹 Cambiar foto
  btnCambiarFoto.addEventListener("click", (e) => {
    e.preventDefault();
    inputFoto.click();
  });

  inputFoto.addEventListener("change", () => {
    const file = inputFoto.files[0];
    if (!file) return;

    archivoFoto = file;

    // Mostrar preview
    const reader = new FileReader();
    reader.onload = function (e) {
      imgPerfil.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  // 🔹 Validación de contraseña
  function validarContrasena(pass) {
    if (pass.length < 8) return false;
    if (!/[A-Z]/.test(pass)) return false;
    if (!/[0-9]/.test(pass)) return false;
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) return false;
    return true;
  }

  // 🔹 Mostrar/Ocultar contraseña
  window.togglePassword = function (id, btn) {
    const input = document.getElementById(id);
    if (!input) return;
    if (input.type === "password") {
      input.type = "text";
      btn.querySelector(".eye-open").style.display = "block";
      btn.querySelector(".eye-closed").style.display = "none";
    } else {
      input.type = "password";
      btn.querySelector(".eye-open").style.display = "none";
      btn.querySelector(".eye-closed").style.display = "block";
    }
  };

  // 🔹 Submit del formulario de perfil
  formPerfil.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = nombreInput.value.trim();
    const contrasena = contrasenaInput.value.trim();
    const confirmContrasena = confirmContrasenaInput.value.trim();

    if (!nombre) {
      alert("El nombre no puede estar vacío.");
      return;
    }

    if (contrasena || confirmContrasena) {
      if (contrasena !== confirmContrasena) {
        alert("Las contraseñas no coinciden.");
        return;
      }
      if (!validarContrasena(contrasena)) {
        alert(
          "La contraseña debe tener mínimo 8 caracteres, al menos una mayúscula, un número y un carácter especial."
        );
        return;
      }
    }

    try {
      // Enviar los datos al backend
      const formData = new FormData();
      formData.append("nombre", nombre);
      if (contrasena) formData.append("contrasena", contrasena);
      if (archivoFoto) formData.append("foto", archivoFoto);

      const response = await fetch(
        `${API_URL}/usuarios/${usuario.idUsuario}`,
        {
            method: "PUT",
            body: formData,
        }
        );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al actualizar usuario");
      }

      const usuarioActualizado = await response.json();

      // Guardar cambios en localStorage
      localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));

      alert("Perfil actualizado correctamente ✅");
      Object.assign(usuario, usuarioActualizado);
      cargarDatosUsuario();

      // Limpiar contraseñas y archivo
      contrasenaInput.value = "";
      confirmContrasenaInput.value = "";
      archivoFoto = null;
      inputFoto.value = "";
    } catch (error) {
      console.error(error);
      alert("Error al actualizar perfil: " + error.message);
    }
  });

  // 🔹 Logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.href = "../index.html";
  });
});

// Función global para cambiar de plan (llamada desde el HTML)
function cambiarPlan() {
    // Guardar ID del usuario en sessionStorage para la página de planes
    if (window.usuarioActual && window.usuarioActual.idUsuario) {
        sessionStorage.setItem('idUsuario', window.usuarioActual.idUsuario);
        window.location.href = 'planes.html';
    } else {
        alert('Error: No se pudo identificar el usuario');
    }
}