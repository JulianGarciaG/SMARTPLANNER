document.querySelectorAll(".toggle-ocultar").forEach(boton => {
  boton.addEventListener("click", () => {
    boton.textContent = boton.textContent === "Ocultar" ? "Mostrar" : "Ocultar";
  });
});

document.querySelectorAll(".toggle-compartir").forEach(boton => {
  boton.addEventListener("click", () => {
    boton.textContent = boton.textContent === "Personal" ? "Compartir" : "Personal";
  });
});

document.querySelectorAll(".toggle-compartir").forEach(btn => {
  btn.addEventListener("click", () => {
    const contenedor = btn.closest(".elep-calendario");
    const badge = contenedor.querySelector(".badge-compartido");
     if (badge.style.display === "inline-block") {
      badge.style.display = "none";   // lo oculta
    } else {
      badge.style.display = "inline-block";  // lo muestra
    }
  });
});
