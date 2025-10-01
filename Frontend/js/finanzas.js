// js/finanzas.js
import { obtenerTransacciones, createTransaccion } from "./api/transaccion.js";

console.log("finanzas.js cargado (module)");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM listo - inicializando finanzas");

  const inputBuscar = document.getElementById("inputBuscar");
  let idEditando = null;
  let todasTransacciones = [];

  // Elementos
  const btnAbrir = document.getElementById("abrirMenuFinanza");
  const menuFinanza = document.getElementById("agregarFinanza");
  const btnCerrar = document.getElementById("cerrarMenuFinanzas");
  const btnCancelar = document.getElementById("cancelarFinanza");
  const formFinanza = document.getElementById("containerFinanza");
  const listaTransacciones = document.getElementById("lista-transacciones");
  const tituloForm = document.getElementById("tituloForm");
  const btnSubmit = formFinanza?.querySelector("button[type='submit']");
  const selectCategoria = document.getElementById("selectCategoria");
  const btnTodas = document.getElementById("btnTodas");
  const btnIngresos = document.getElementById("btnIngresos");
  const btnEgresos = document.getElementById("btnEgresos");
  const ingresosEl = document.getElementById("ingresosMes");
  const gastosEl = document.getElementById("gastosMes");
  const balanceEl = document.getElementById("balanceMes");

  const log = (...args) => console.log("[finanzas]", ...args);

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor);
  };

  const inpu = (id) => document.getElementById(id);

  const getIdUsuario = () => {
    const u = localStorage.getItem("usuario");
    if (!u) return null;
    try {
      const obj = JSON.parse(u);
      return obj.idUsuario ?? obj.id ?? obj.id_usuario ?? null;
    } catch {
      return null;
    }
  };

  // MODALES
  if (btnAbrir && menuFinanza && formFinanza) {
    btnAbrir.addEventListener("click", (e) => {
      e.preventDefault();
      idEditando = null;
      formFinanza.reset();
      tituloForm.textContent = "Nueva Transacción";
      if (btnSubmit) btnSubmit.textContent = "Crear";
      menuFinanza.style.display = "flex";
      log("Abrir modal - crear");
    });
  }

  const cerrarModal = () => {
    idEditando = null;
    tituloForm.textContent = "Nueva Transacción";
    if (btnSubmit) btnSubmit.textContent = "Crear";
    menuFinanza.style.display = "none";
  };

  btnCerrar?.addEventListener("click", cerrarModal);
  btnCancelar?.addEventListener("click", cerrarModal);

  // RENDER LISTA
  const renderizarTransacciones = (transacciones) => {
    listaTransacciones.innerHTML = "";
    if (!transacciones || transacciones.length === 0) {
      listaTransacciones.innerHTML = "<li>No hay transacciones registradas</li>";
      return;
    }

    transacciones.forEach((tx) => {
      const li = document.createElement("li");
      const esIngreso = String(tx.tipo).toLowerCase() === "ingreso";
      const signo = esIngreso ? "+" : "-";
      const colorClase = esIngreso ? "green" : "red";

      li.innerHTML = `
        <div class="informacion">
          <div class="${esIngreso ? "ingreso" : "egreso"}">
            ${esIngreso 
              ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                  <polyline points="16 7 22 7 22 13"></polyline>
                </svg>`
              : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline>
                  <polyline points="16 17 22 17 22 11"></polyline>
                </svg>`}
          </div>
          <div class="texto">
            <h1>${tx.descripcion}</h1>
            <h2>${tx.categoria} ${tx.fecha ? tx.fecha.substring(0,10) : ""}</h2>
          </div>
        </div>
        <div class="derecha">
          <div class="estados">
            <p class="${tx.categoria ? tx.categoria.toLowerCase() : ""}">${tx.categoria ?? ""}</p>
            <p class="${colorClase}">${signo}${formatearMoneda(tx.monto)}</p>
          </div>
          <div class="crud">
            <img class="editar" src="../img/editar.png" width="20" height="20" data-id="${tx.id_gasto}" style="cursor: pointer;" />
            <img class="eliminar" src="../img/eliminar.png" width="20" height="20" data-id="${tx.id_gasto}" style="cursor: pointer;" />
          </div>
        </div>
      `;
      listaTransacciones.appendChild(li);
    });
  };

  // RENDER RESUMEN
  const renderResumenCategorias = (transacciones) => {
    const contenedor = document.getElementById("contenedor-resumen");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    const resumen = {};
    transacciones.forEach((t) => {
      if (!resumen[t.categoria]) {
        resumen[t.categoria] = { total: 0, cantidad: 0 };
      }
      resumen[t.categoria].total += String(t.tipo).toLowerCase() === "ingreso" ? t.monto : -t.monto;
      resumen[t.categoria].cantidad += 1;
    });

    Object.entries(resumen).forEach(([categoria, datos]) => {
      const div = document.createElement("div");
      div.classList.add("categoria");

      let badgeClass = "badge-azul";
      if (categoria.toLowerCase().includes("aliment")) badgeClass = "badge-naranja";
      else if (categoria.toLowerCase().includes("transporte")) badgeClass = "badge-morado";
      else if (categoria.toLowerCase().includes("entreten")) badgeClass = "badge-rosa";

      const colorClass = datos.total >= 0 ? "green" : "red";

      div.innerHTML = `
        <h3>${categoria} <span class="badge ${badgeClass}">${datos.cantidad}</span></h3>
        <p class="${colorClass}">${formatearMoneda(datos.total)}</p>
      `;
      contenedor.appendChild(div);
    });
  };

  // ESTADÍSTICAS
  const actualizarContadores = () => {
    const total = todasTransacciones.length;
    const ingresos = todasTransacciones.filter(tx => String(tx.tipo).toLowerCase() === "ingreso").length;
    const egresos = todasTransacciones.filter(tx => String(tx.tipo).toLowerCase() === "egreso").length;

    if (btnTodas) btnTodas.textContent = `Todas (${total})`;
    if (btnIngresos) btnIngresos.textContent = `Ingresos (${ingresos})`;
    if (btnEgresos) btnEgresos.textContent = `Gastos (${egresos})`;
  };

  const actualizarEstadisticas = (transacciones) => {
  console.log("Función actualizarEstadisticas ejecutada");
  console.log("Transacciones recibidas:", transacciones);

  if (!ingresosEl || !gastosEl || !balanceEl) {
    console.error("Elementos no encontrados en el DOM");
    return;
  }

  const hoy = new Date();
  const mesActual = hoy.getMonth();
  const anioActual = hoy.getFullYear();

  let totalIngresos = 0;
  let totalGastos = 0;

  transacciones.forEach((tx) => {
    if (!tx.fecha) return;

    // ✅ Normalizar fecha para evitar problema de zona horaria
    const [anio, mes, dia] = tx.fecha.substring(0, 10).split("-").map(Number);
    const fechaTx = new Date(anio, mes - 1, dia);

    if (fechaTx.getMonth() === mesActual && fechaTx.getFullYear() === anioActual) {
      const monto = parseFloat(tx.monto) || 0;
      if (String(tx.tipo).toLowerCase() === "ingreso") {
        totalIngresos += monto;
      } else if (String(tx.tipo).toLowerCase() === "egreso") {
        totalGastos += monto;
      }
    }
  });

  const balance = totalIngresos - totalGastos;

  ingresosEl.textContent = formatearMoneda(totalIngresos);
  gastosEl.textContent = formatearMoneda(totalGastos);
  balanceEl.textContent = formatearMoneda(balance);

  if (balance >= 0) {
    balanceEl.classList.add("green");
    balanceEl.classList.remove("red");
  } else {
    balanceEl.classList.add("red");
    balanceEl.classList.remove("green");
  }
};

  // CARGA
  const cargarTransacciones = async () => {
    const idUsuario = getIdUsuario();
    if (!idUsuario) {
      listaTransacciones.innerHTML = "<li>Inicia sesión para ver las transacciones</li>";
      return;
    }
    try {
      const trans = await obtenerTransacciones(idUsuario);
      todasTransacciones = trans;
      
      console.log("Transacciones obtenidas:", trans.length);
      
      renderizarTransacciones(trans);
      actualizarContadores();
      actualizarEstadisticas(trans);
      renderResumenCategorias(trans);
    } catch (err) {
      console.error("Error al cargar transacciones:", err);
      listaTransacciones.innerHTML = "<li>Error al cargar transacciones</li>";
    }
  };

  // EVENTOS
  if (inputBuscar) {
    inputBuscar.addEventListener("input", () => {
      const texto = inputBuscar.value.trim().toLowerCase();
      if (!texto) {
        renderizarTransacciones(todasTransacciones);
      } else {
        const filtradas = todasTransacciones.filter(
          (tx) => tx.descripcion && tx.descripcion.toLowerCase().includes(texto)
        );
        renderizarTransacciones(filtradas);
      }
    });
  }

  if (selectCategoria) {
    selectCategoria.addEventListener("change", () => {
      const categoriaSeleccionada = selectCategoria.value;
      if (!categoriaSeleccionada) {
        renderizarTransacciones(todasTransacciones);
      } else {
        const filtradas = todasTransacciones.filter(
          (tx) => tx.categoria && tx.categoria.toLowerCase() === categoriaSeleccionada.toLowerCase()
        );
        renderizarTransacciones(filtradas);
      }
    });
  }

  btnTodas?.addEventListener("click", () => renderizarTransacciones(todasTransacciones));
  btnIngresos?.addEventListener("click", () => {
    const ingresos = todasTransacciones.filter(tx => String(tx.tipo).toLowerCase() === "ingreso");
    renderizarTransacciones(ingresos);
  });
  btnEgresos?.addEventListener("click", () => {
    const egresos = todasTransacciones.filter(tx => String(tx.tipo).toLowerCase() === "egreso");
    renderizarTransacciones(egresos);
  });

  // FORM SUBMIT
  formFinanza?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const idUsuario = getIdUsuario();
    if (!idUsuario) return alert("Debes iniciar sesión");

    const tipo = inpu("tipo")?.value || "egreso";
    const descripcion = inpu("descripcion")?.value || "";
    const monto = parseFloat(inpu("monto")?.value || 0);
    const categoria = inpu("categoria")?.value || "";
    const fecha = inpu("fecha")?.value || new Date().toISOString().split("T")[0];

    const payload = { tipo, descripcion, monto, categoria, fecha, id_usuario: idUsuario };

    try {
      if (idEditando) {
        const res = await fetch(`http://localhost:8080/api/transacciones/${idEditando}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          alert("Transacción editada ✅");
        } else {
          alert("Error al editar transacción");
        }
        idEditando = null;
        tituloForm.textContent = "Nueva Transacción";
        if (btnSubmit) btnSubmit.textContent = "Crear";
      } else {
        const res = await createTransaccion(payload);
        if (res) {
          alert("Transacción creada ✅");
        } else {
          alert("Error al crear transacción");
        }
      }

      menuFinanza.style.display = "none";
      formFinanza.reset();
      await cargarTransacciones();
    } catch (err) {
      console.error("Error:", err);
      alert("Error al procesar transacción");
    }
  });

  // EDITAR / ELIMINAR
  listaTransacciones?.addEventListener("click", async (e) => {
    const eliminarBtn = e.target.closest(".eliminar");
    const editarBtn = e.target.closest(".editar");

    if (eliminarBtn) {
      const id = eliminarBtn.dataset.id;
      if (!id) return;
      if (!confirm("¿Deseas eliminar esta transacción?")) return;
      try {
        await fetch(`http://localhost:8080/api/transacciones/${id}`, { method: "DELETE" });
        await cargarTransacciones();
      } catch (err) {
        console.error("Error eliminando:", err);
        alert("Error al eliminar");
      }
      return;
    }

    if (editarBtn) {
      const id = editarBtn.dataset.id;
      if (!id) return;

      const idUsuario = getIdUsuario();
      try {
        let trans = await obtenerTransacciones(idUsuario);
        let tx = trans?.find(t => String(t.id_gasto) === String(id));

        if (!tx) {
          const resp = await fetch(`http://localhost:8080/api/transacciones/${id}`);
          if (resp.ok) tx = await resp.json();
        }

        if (!tx) {
          alert("No se encontró la transacción para editar.");
          return;
        }

        inpu("tipo").value = tx.tipo ?? "egreso";
        inpu("descripcion").value = tx.descripcion ?? "";
        inpu("monto").value = tx.monto ?? "";
        inpu("categoria").value = tx.categoria ?? "";
        inpu("fecha").value = tx.fecha ? tx.fecha.substring(0,10) : "";

        tituloForm.textContent = "Editar Transacción";
        if (btnSubmit) btnSubmit.textContent = "Editar";
        menuFinanza.style.display = "flex";
        idEditando = tx.id_gasto ?? tx.id ?? id;
      } catch (err) {
        console.error("Error preparando edición:", err);
        alert("Error al preparar la edición");
      }
    }
  });

  cargarTransacciones();
});