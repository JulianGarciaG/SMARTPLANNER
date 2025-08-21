function mostrarContraseña() {
    const passwordInput = document.getElementById("password");
    const toggleBtn = document.querySelector(".toggle-password svg"); 
    
    // Alternar tipo de input
    const isPassword = passwordInput.getAttribute("type") === "password";
    passwordInput.setAttribute("type", isPassword ? "text" : "password");
    console.log(passwordInput)

    // Cambiar ícono según el estado
    if (isPassword) {
        // Ojo abierto 
        toggleBtn.innerHTML = `
            <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 
                     11-7 11-7-4-7-11-7zm0 
                     12c-2.8 0-5-2.2-5-5s2.2-5 
                     5-5 5 2.2 5 5-2.2 5-5 
                     5zm0-8a3 3 0 1 0 0 6 
                     3 3 0 0 0 0-6z"/>`;
    } else {
        // Tachado de ojo
        toggleBtn.innerHTML = `

            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20
                    C5 20 1 12 1 12s4-8 11-8c2 0 3.9.6 5.5 1.7"/>
            <path d="M9.88 9.88A3 3 0 0 0 12 15
                    a3 3 0 0 0 2.12-5.12"/>
            <line x1="1" y1="1" x2="23" y2="23"/>`;
}
}

document.querySelector('.login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const usuario = document.getElementById('usuario').value.trim();
    const password = document.getElementById('password').value.trim();
    if (usuario === "" || password === "") {
        alert("Por favor, ingresa usuario y contraseña.");
        return;
    }
    window.location.href = "/inicio/page.html";
});
