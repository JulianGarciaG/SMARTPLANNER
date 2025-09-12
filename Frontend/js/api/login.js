document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const correoElectronico = document.getElementById("correoElectronico").value.trim();
    const contrasena = document.getElementById("password").value.trim();

    try {
      const response = await fetch("http://localhost:8080/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correoElectronico, contrasena }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Credenciales inválidas");
      }

      const data = await response.json();

      localStorage.setItem("usuario", JSON.stringify(data));

      alert("Inicio de sesión exitoso, Bienvenido ✅");

      window.location.href = "./views/home.html";

    } catch (error) {
      console.error("Error:", error);
      alert("Error al iniciar sesión: " + error.message);
    }
  });
});
