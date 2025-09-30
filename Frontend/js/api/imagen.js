document.addEventListener("DOMContentLoaded", () => {
  const usuarioJSON = localStorage.getItem("usuario");
  if (!usuarioJSON) return;

  const usuario = JSON.parse(usuarioJSON);

  const imgPerfil = document.getElementById("imgPerfil");
  const imgUsuarioHeader = document.getElementById("imgUsuarioHeader");

  function cargarDatosUsuario() {
    // 🔹 Si hay foto guardada en el usuario, la ponemos en ambas imágenes
    if (usuario.foto) {
      if (imgPerfil) imgPerfil.src = usuario.foto;
      if (imgUsuarioHeader) imgUsuarioHeader.src = usuario.foto;
    } else {
      // 🔹 Si NO hay foto, mostramos la default
      if (imgPerfil) imgPerfil.src = "../img/usuario-perfil.png";
      if (imgUsuarioHeader) imgUsuarioHeader.src = "../img/usuario-perfil.png";
    }
  }

  cargarDatosUsuario();
});
