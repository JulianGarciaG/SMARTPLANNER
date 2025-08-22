// function mostrarContraseña() {
//     const passwordInput = document.getElementById("password");
//     const toggleBtn = document.querySelector(".toggle-password svg"); 
    
//     // Alternar tipo de input
//     const isPassword = passwordInput.getAttribute("type") === "password";
//     passwordInput.setAttribute("type", isPassword ? "text" : "password");
//     console.log(passwordInput)

//     // Cambiar ícono según el estado
//     if (isPassword) {
//         // Ojo abierto 
//         toggleBtn.innerHTML = `
//             <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 
//                     11-7 11-7-4-7-11-7zm0 
//                     12c-2.8 0-5-2.2-5-5s2.2-5 
//                     5-5 5 2.2 5 5-2.2 5-5 
//                     5zm0-8a3 3 0 1 0 0 6 
//                     3 3 0 0 0 0-6z"/>`;

                    
//     } else {
//         // Tachado de ojo
//         toggleBtn.innerHTML = `
//         <path d="M12 5c-7 0-11 7-11 7s4 7 
//            11 7 11-7 11-7-4-7-11-7zM12 
//            17c-2.8 0-5-2.2-5-5 0-.8.2-1.6.6-2.3l6.7 
//            6.7c-.7.4-1.5.6-2.3.6zM12 
//            7c2.8 0 5 2.2 5 5 0 .8-.2 
//            1.6-.6 2.3l-6.7-6.7C10.4 
//            7.2 11.2 7 12 7z"/>
//          <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" stroke-width="2"/>`;
// }
// }

// document.querySelector('.login-form').addEventListener('submit', function(e) {
//     e.preventDefault();
//     const usuario = document.getElementById('usuario').value.trim();
//     const password = document.getElementById('password').value.trim();
//     if (usuario === "" || password === "") {
//         alert("Por favor, ingresa usuario y contraseña.");
//         return;
//     }
//     window.location.href = "/inicio/page.html";
// });

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const eyeOpen = btn.querySelector(".eye-open");
  const eyeClosed = btn.querySelector(".eye-closed");

  if (input.type === "password") {
    input.type = "text";
    eyeOpen.style.display = "block";
    eyeClosed.style.display = "none";
  } else {
    input.type = "password";
    eyeOpen.style.display = "none";
    eyeClosed.style.display = "block";
  }
}