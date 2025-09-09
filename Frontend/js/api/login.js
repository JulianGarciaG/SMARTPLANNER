document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const correoElectronico = document.getElementById("correoElectronico").value.trim();
    const contrasena = document.getElementById("password").value.trim();

    console.log({correoElectronico, contrasena });


    try {
      const response = await fetch("http://localhost:8080/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({correoElectronico, contrasena }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Credenciales invalidas");
      }

      const data = await response.json();
      alert("Inicio sesion exitoso,Bienvenido ✅");
      window.location.href = "login.html";

    } catch (error) {
      console.error("Error:", error);
      alert("Error al iniciar: " + error.message);
    }
  });
});
