document.getElementById("update-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const idUsuario = 1; // Cambia por el ID del usuario logueado
    const nombre = document.getElementById("nombre").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();
    const confirmContrasena = document.getElementById("confirmContrasena").value.trim();
    const foto = document.getElementById("foto").value.trim();

    if (contrasena !== confirmContrasena) {
        alert("Las contraseñas no coinciden");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/usuarios/${idUsuario}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, contrasena, foto })
        });

        if (!response.ok) {
            throw new Error("Error al actualizar el usuario");
        }

        const data = await response.json();
        alert("Usuario actualizado con éxito ✅");
        console.log(data);

    } catch (error) {
        console.error(error);
        alert("Error: " + error.message);
    }
});
