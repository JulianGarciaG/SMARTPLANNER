document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".register-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // evita recargar la página

    const nombre = document.getElementById("nombre").value.trim();
    const correoElectronico = document.getElementById("correoElectronico").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    console.log({ nombre, correoElectronico, contrasena, confirmPassword }); // debug

    if (contrasena !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/usuarios/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correoElectronico, contrasena }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error en el registro");
      }

      const data = await response.json();

      // 🔔 NUEVO: enviar correo de bienvenida (no bloquea si falla)
      if (window.emailService && typeof window.emailService.sendRegistrationConfirmationEmail === "function") {
        try {
          const resMail = await window.emailService.sendRegistrationConfirmationEmail(
            correoElectronico, // se mostrará como {{to_email}} en la plantilla
            nombre,            // se usará como {{user_name}}
            null               // (opcional) link de verificación si luego lo implementas
          );
          if (!resMail.success) {
            console.warn("Bienvenida enviada con advertencia:", resMail.message);
          }
        } catch (mailErr) {
          console.warn("No se pudo enviar el correo de bienvenida:", mailErr);
        }
      } else {
        console.warn("EmailService no disponible en esta vista");
      }

      // Continúa tu flujo normal
      alert("Usuario registrado con éxito ✅");
      window.location.href = "../index.html";

    } catch (error) {
      console.error("Error:", error);
      alert("Error al registrar: " + error.message);
    }
  });
});
