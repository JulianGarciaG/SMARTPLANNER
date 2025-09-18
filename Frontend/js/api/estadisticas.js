document.addEventListener("DOMContentLoaded", () => {
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
    
});
