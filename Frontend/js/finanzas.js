// js/finanzas.js
import { createTransaccion } from "./api/transaccion.js";

document.addEventListener("DOMContentLoaded", () => {
  const btnAbrir = document.getElementById("abrirMenuFinanza");
  const menuFinanza = document.getElementById("agregarFinanza");
  const btnCerrar = document.getElementById("cerrarMenuFinanzas");
  const btnCancelar = document.getElementById("cancelarFinanza");
  const formFinanza = document.getElementById("containerFinanza");

  // seguridad: si algún elemento no existe, salir con mensaje en console
  if (!formFinanza) {
    console.error("form #containerFinanza no encontrado en DOM");
    return;
  }

  // Abrir modal (btnAbrir puede estar fuera del form)
  if (btnAbrir) {
    btnAbrir.addEventListener("click", (e) => {
      e.preventDefault(); // evita comportamiento por defecto (si fuese submit)
      formFinanza.reset(); // limpia campos al abrir
      menuFinanza.style.display = "flex";
    });
  }

  // Cerrar modal
  if (btnCerrar) {
    btnCerrar.addEventListener("click", (e) => {
      e.preventDefault();
      menuFinanza.style.display = "none";
    });
  }
  if (btnCancelar) {
    btnCancelar.addEventListener("click", (e) => {
      e.preventDefault();
      menuFinanza.style.display = "none";
    });
  }

  // IMPORTANT — submit handler (evita que el form haga submit por defecto)
  formFinanza.addEventListener("submit", async (e) => {
    e.preventDefault(); // **** esto evita el '?' en la URL ****

    // validar que hay usuario en localStorage
    const usuarioJSON = localStorage.getItem("usuario");
    if (!usuarioJSON) {
      alert("Debes iniciar sesión");
      return;
    }
    const usuario = JSON.parse(usuarioJSON);

    // recoger valores (defensivo: comprueba que existen los elementos)
    const tipoEl = document.getElementById("tipo");
    const descEl = document.getElementById("descripcion");
    const montoEl = document.getElementById("monto");
    const catEl = document.getElementById("categoria");
    const fechaEl = document.getElementById("fecha");
    const tareaEl = document.getElementById("tarea");

    const transaccion = {
      tipo: tipoEl ? tipoEl.value : "",
      descripcion: descEl ? descEl.value : "",
      monto: montoEl ? parseFloat(montoEl.value || 0) : 0,
      categoria: catEl ? catEl.value : "",
      fecha: fechaEl ? fechaEl.value : null, // yyyy-MM-dd
      id_tarea: tareaEl && tareaEl.value ? tareaEl.value : null,
      id_usuario: usuario.id_usuario ?? usuario.id ?? usuario.userId
    };

    console.log("Enviando transacción:", transaccion);

    const result = await createTransaccion(transaccion);

    if (result) {
      alert("✅ Transacción creada");
      formFinanza.reset();
      menuFinanza.style.display = "none";
      // actualizar UI en lugar de reload si prefieres
      location.reload();
    } else {
      alert("❌ Error al crear transacción (ver consola)");
    }
  });
});
