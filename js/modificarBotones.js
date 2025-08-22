document.querySelectorAll(".toggle-ocultar").forEach(boton => {
  boton.addEventListener("click", () => {
    boton.textContent = boton.textContent === "Ocultar" ? "Mostrar" : "Ocultar";
  });
});

document.querySelectorAll(".toggle-compartir").forEach(boton => {
  boton.addEventListener("click", () => {
    boton.textContent = boton.textContent === "Personal" ? "Compartirdo" : "Personal";
  });
});
