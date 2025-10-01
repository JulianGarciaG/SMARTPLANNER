// Seleccionamos todas las tareas para el efecto visual
const tareas = document.querySelectorAll(".tarea");

tareas.forEach(tarea => {
  const input = tarea.querySelector(".input-tarea");
  const texto = tarea.querySelector(".texto-titulo");

  if (input && texto) {
    input.addEventListener("click", () => {
      if (input.checked) {
        tarea.style.backgroundColor = "rgb(236 253 245)";
        texto.style.textDecoration = "line-through";
        texto.style.color = "#6b7280";
      } else {
        tarea.style.backgroundColor = "white";
        texto.style.textDecoration = "none";
        texto.style.color = "#1e293b";
      }
    });
  }
});

// =====================================================
// MANEJO DEL CHECKBOX "Asociar con un gasto"
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  const checkboxAsociar = document.getElementById("abrirAsociarGasto");
  const divAsociarGasto = document.getElementById("asociarGasto");
  const selectAsociarGasto = divAsociarGasto?.querySelector("select");

  // Función para cargar las transacciones del usuario
  const cargarTransacciones = async () => {
    const usuarioJSON = localStorage.getItem("usuario");
    if (!usuarioJSON) return [];

    try {
      const usuario = JSON.parse(usuarioJSON);
      const idUsuario = usuario.idUsuario || usuario.id || usuario.id_usuario;
      
      if (!idUsuario) return [];

      const response = await fetch(`http://localhost:8080/api/transacciones/usuario/${idUsuario}`);
      if (!response.ok) return [];

      const transacciones = await response.json();
      return Array.isArray(transacciones) ? transacciones : [];
    } catch (error) {
      console.error("Error cargando transacciones:", error);
      return [];
    }
  };

  // Función para formatear moneda
  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor);
  };

  // Función para popular el select con transacciones
  const popularSelect = async () => {
    if (!selectAsociarGasto) return;

    const transacciones = await cargarTransacciones();
    
    // Limpiar select excepto la primera opción
    selectAsociarGasto.innerHTML = '<option value="" selected>Seleccionar gasto...</option>';

    // Verificar si hay una transacción preseleccionada de localStorage
    const transaccionPreseleccionada = localStorage.getItem("transaccionParaTarea");
    let idPreseleccionado = null;

    if (transaccionPreseleccionada) {
      try {
        const trans = JSON.parse(transaccionPreseleccionada);
        idPreseleccionado = trans.id;
      } catch (e) {
        console.error("Error parseando transacción preseleccionada:", e);
      }
    }

    // Agregar todas las transacciones
    transacciones.forEach(tx => {
      const option = document.createElement("option");
      option.value = tx.id_gasto || tx.id;
      option.textContent = `${tx.descripcion} - ${formatearMoneda(tx.monto)}`;
      
      // Si esta es la transacción preseleccionada, marcarla
      if (idPreseleccionado && String(tx.id_gasto || tx.id) === String(idPreseleccionado)) {
        option.selected = true;
      }
      
      selectAsociarGasto.appendChild(option);
    });
  };

  // Manejar el cambio del checkbox
  if (checkboxAsociar && divAsociarGasto) {
    checkboxAsociar.addEventListener("change", async () => {
      if (checkboxAsociar.checked) {
        divAsociarGasto.style.display = "block";
        // Cargar transacciones al mostrar
        await popularSelect();
      } else {
        divAsociarGasto.style.display = "none";
      }
    });

    // Si el checkbox ya está marcado al cargar (por la transacción preseleccionada)
    if (checkboxAsociar.checked) {
      divAsociarGasto.style.display = "block";
      popularSelect();
    }
  }
});