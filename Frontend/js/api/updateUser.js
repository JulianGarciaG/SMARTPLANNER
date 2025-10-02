document.addEventListener("DOMContentLoaded", () => {
  const API_URL = 'http://localhost:8080/api';
  
  // 🔹 Verificar sesión
  const usuarioJSON = localStorage.getItem("usuario");
  if (!usuarioJSON) {
    window.location.href = "../index.html";
    return;
  }
  const usuario = JSON.parse(usuarioJSON);
  window.usuarioActual = usuario; // ✅ Hacer disponible globalmente

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

  let archivoFoto = null;

  // 🔹 Cargar datos del usuario logueado
function cargarDatosUsuario() {
  if (usuario.foto) {
    if (!usuario.foto.startsWith('http')) {
      usuario.foto = `http://localhost:8080${usuario.foto}`;
    }
    imgPerfil.src = usuario.foto;
  }
  if (usuario.nombre) {
    nombreInput.value = usuario.nombre;
    if (nameH2) nameH2.textContent = usuario.nombre;
  }
  if (usuario.correoElectronico && emailDiv) {
    emailDiv.textContent = usuario.correoElectronico;
  }
}

  cargarDatosUsuario();

  // 🔹 Cambiar foto
  btnCambiarFoto.addEventListener("click", (e) => {
    e.preventDefault();
    inputFoto.click();
  });

  inputFoto.addEventListener("change", () => {
    const file = inputFoto.files[0];
    if (!file) return;

    archivoFoto = file;

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

  // ✅ Construir URL completa para la foto
  if (usuarioActualizado.foto && !usuarioActualizado.foto.startsWith('http')) {
      usuarioActualizado.foto = `http://localhost:8080${usuarioActualizado.foto}`;
  }

localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));

      alert("Perfil actualizado correctamente ✅");
      Object.assign(usuario, usuarioActualizado);
      cargarDatosUsuario();

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

// ✅ Función GLOBAL para cambiar de plan (FUERA del DOMContentLoaded)
function cambiarPlan() {
  console.log("🔵 Función cambiarPlan ejecutada");
  
  const usuarioJSON = localStorage.getItem('usuario');
  if (!usuarioJSON) {
    alert('Error: No hay usuario logueado');
    return;
  }
  
  const usuario = JSON.parse(usuarioJSON);
  console.log("🔵 Usuario encontrado:", usuario);
  
  if (usuario && usuario.idUsuario) {
    console.log("🔵 Navegando a planes.html");
    window.location.href = 'planes.html';
  } else {
    alert('Error: No se pudo identificar el usuario');
  }
}