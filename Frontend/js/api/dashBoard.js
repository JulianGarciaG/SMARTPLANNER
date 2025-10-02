// ../js/api/dashboard.js

document.addEventListener("DOMContentLoaded", async () => {
  const usuarioJSON = localStorage.getItem("usuario");
  if (!usuarioJSON) return;
  const usuario = JSON.parse(usuarioJSON);
  const userId = usuario.idUsuario;

  cargarTareas(userId);

  // Balance mensual desde transacciones
  cargarBalanceMensualDesdeTransacciones(userId);

  // Gastos del día desde tareas (solo pendientes)
  cargarGastosDelDiaDesdeTareas(userId);

  cargarPlanesAhorro(userId);
  await cargarCalendarios(userId);
  await cargarEventos(userId);
});

// ================== Helpers comunes ==================
const hoyStr = () => new Date().toISOString().slice(0, 10);
const toCOP = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n || 0);

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitizeColor(c) {
  if (!c) return "#cccccc";
  const s = String(c).trim();
  const isHex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s);
  return isHex ? s : "#cccccc";
}

function formatearRangoHora(inicio, fin) {
  try {
    const d1 = new Date(inicio);
    const d2 = fin ? new Date(fin) : null;

    const fecha = d1.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    const h1 = d1.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const h2 = d2 ? d2.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : null;

    return h2 ? `${fecha} · ${h1} - ${h2}` : `${fecha} · ${h1}`;
  } catch {
    return "";
  }
}

// ================== TAREAS ==================
async function cargarTareas(userId) {
  try {
    const res = await fetch(`http://localhost:8080/api/tareas/${userId}`);
    const tareas = await res.json();

    const lista = document.getElementById("listaTareas");
    if (!lista) return;
    lista.innerHTML = "";

    let completadas = tareas.filter((t) => !!t.estado_de_tarea).length;

    tareas.forEach((t) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <input type="checkbox" ${t.estado_de_tarea ? "checked" : ""} data-id="${t.id_tarea}">
        <span>${t.nombre}</span>
        <h5 class="prioridad ${t.prioridad?.toLowerCase() || ""}">${t.prioridad}</h5>
      `;

      const checkbox = li.querySelector("input");
      checkbox.addEventListener("change", async (e) => {
        const checked = e.target.checked;
        if (checked) completadas++;
        else completadas--;
        document.getElementById("tareasCompletadas").textContent = `${completadas}/${tareas.length}`;

        try {
          const payload = {
            nombre: t.nombre,
            descripcion: t.descripcion,
            prioridad: t.prioridad || "media",
            fecha_limite: t.fecha_limite,
            categoria: t.categoria || "sin_asociar",
            estado_de_tarea: checked,
            id_usuario: t.id_usuario,
            id_transaccion: t.id_transaccion ?? null,
          };

          await fetch(`http://localhost:8080/api/tareas/actualizar/${t.id_tarea}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          // 🔄 Actualiza inmediatamente la tarjeta "Gastos del día"
          await cargarGastosDelDiaDesdeTareas(t.id_usuario);
        } catch (err) {
          console.error("Error actualizando tarea:", err);
        }
      });

      lista.appendChild(li);
    });

    document.getElementById("tareasCompletadas").textContent = `${completadas}/${tareas.length}`;
  } catch (err) {
    console.error("Error cargando tareas:", err);
  }
}

// ================== FINANZAS — Balance mensual desde transacciones ==================
async function cargarBalanceMensualDesdeTransacciones(userId) {
  try {
    const res = await fetch(`http://localhost:8080/api/transacciones/usuario/${userId}`);
    const transacciones = await res.json();

    let balance = 0;
    transacciones.forEach((tx) => {
      const monto = Number(tx.monto) || 0;
      if (tx.tipo === "egreso") balance -= monto;
      if (tx.tipo === "ingreso") balance += monto;
    });

    const balanceEl = document.getElementById("balanceMensual");
    if (!balanceEl) return;

    balanceEl.textContent = toCOP(balance);
    balanceEl.classList.remove("positivo", "negativo");
    if (balance > 0) balanceEl.classList.add("positivo");
    else if (balance < 0) balanceEl.classList.add("negativo");
  } catch (err) {
    console.error("Error cargando balance mensual:", err);
  }
}

// ================== GASTOS DEL DÍA — desde tareas asociadas (solo pendientes) ==================
async function cargarGastosDelDiaDesdeTareas(userId) {
  try {
    const [resT, resTx] = await Promise.all([
      fetch(`http://localhost:8080/api/tareas/${userId}`),
      fetch(`http://localhost:8080/api/transacciones/usuario/${userId}`),
    ]);

    if (!resT.ok) throw new Error(await resT.text());
    if (!resTx.ok) throw new Error(await resTx.text());

    const tareas = await resT.json();
    const transacciones = await resTx.json();

    // id_transaccion (tarea) -> transacción (usa id_gasto en backend)
    const mapTx = {};
    (transacciones || []).forEach((tx) => {
      mapTx[tx.id_gasto] = tx;
    });

    const hoy = hoyStr();
    let gastosHoy = 0;

    (tareas || []).forEach((t) => {
      // ❗ Solo tareas PENDIENTES
      if (t.estado_de_tarea) return;

      // Necesita transacción asociada
      if (!t.id_transaccion) return;
      const tx = mapTx[t.id_transaccion];
      if (!tx) return;

      // Solo egresos
      const esEgreso = String(tx.tipo).toLowerCase() === "egreso";
      if (!esEgreso) return;

      // Cuenta si la fecha de la transacción es hoy;
      // si no viene fecha en la transacción, usa la fecha límite de la tarea
      const fechaTx = tx.fecha || null; // 'YYYY-MM-DD'
      const fechaTarea = t.fecha_limite ? new Date(t.fecha_limite).toISOString().slice(0, 10) : null;

      const cuentaHoy = (fechaTx && fechaTx === hoy) || (fechaTarea && fechaTarea === hoy);
      if (cuentaHoy) gastosHoy += Number(tx.monto) || 0;
    });

    const el = document.querySelector(".tarjeta.gastos .cantidad");
    if (el) el.textContent = toCOP(gastosHoy);
  } catch (err) {
    console.error("Error calculando gastos del día desde tareas:", err);
    const el = document.querySelector(".tarjeta.gastos .cantidad");
    if (el) el.textContent = toCOP(0);
  }
}

// ================== PLANES DE AHORRO ==================
async function cargarPlanesAhorro(userId) {
  try {
    const resp = await fetch(`http://localhost:8080/api/planes-ahorro/usuario/${userId}`);
    if (!resp.ok) throw new Error("Error al cargar planes de ahorro");
    const planes = await resp.json();

    const completadosResp = await fetch(`http://localhost:8080/api/planes-ahorro/usuario/${userId}/completados`);
    const completados = completadosResp.ok ? await completadosResp.json() : [];

    document.getElementById("planesAhorro").textContent = `${completados.length}/${planes.length}`;
  } catch (err) {
    console.error("No se pudieron cargar los planes de ahorro", err);
    document.getElementById("planesAhorro").textContent = "0/0";
  }
}

// ================== CALENDARIOS ==================
async function cargarCalendarios(userId) {
  const lista = document.getElementById("listaCalendarios");
  if (!lista) return;

  lista.innerHTML = "";

  try {
    const res = await fetch(`http://localhost:8080/api/calendarios-compartidos/usuario/${userId}`);
    if (!res.ok) throw new Error(await res.text());
    const calendarios = await res.json(); // [{ idCalendario, nombre, color, permiso }]

    if (!Array.isArray(calendarios) || calendarios.length === 0) {
      lista.innerHTML = `<li class="evento" style="opacity:.7">No tienes calendarios disponibles.</li>`;
      return;
    }

    for (const c of calendarios) {
      let totalEventos = 0;
      try {
        const rCount = await fetch(`http://localhost:8080/api/eventos/calendario/${c.idCalendario}/count`);
        if (rCount.ok) totalEventos = await rCount.json();
      } catch (e) {
        console.warn("No se pudo obtener conteo de eventos para calendario", c.idCalendario, e);
      }

      const li = document.createElement("li");
      li.classList.add("evento");
      li.innerHTML = `
        <span class="punto" style="background-color: ${sanitizeColor(c.color)}"></span>
        <div>
          <p class="evento-nombre">${escapeHtml(c.nombre)}</p>
          <p class="evento-hora">${Number(totalEventos)} evento${Number(totalEventos) !== 1 ? "s" : ""}</p>
        </div>
      `;
      lista.appendChild(li);
    }
  } catch (err) {
    console.error("Error cargando calendarios:", err);
    lista.innerHTML = `<li class="evento" style="opacity:.7">No se pudieron cargar los calendarios.</li>`;
  }
}

// ================== EVENTOS ==================
async function cargarEventos(userId) {
  const ul = document.getElementById("listaEventos");
  if (!ul) return;
  ul.innerHTML = "";

  try {
    const resCals = await fetch(`http://localhost:8080/api/calendarios-compartidos/usuario/${userId}`);
    if (!resCals.ok) throw new Error(await resCals.text());
    const calendarios = await resCals.json(); // [{ idCalendario, nombre, color, permiso }]

    if (!Array.isArray(calendarios) || calendarios.length === 0) {
      ul.innerHTML = `<li class="evento" style="opacity:.7">No hay calendarios para mostrar eventos.</li>`;
      return;
    }

    const eventosPorCal = await Promise.all(
      calendarios.map(async (cal) => {
        try {
          const rEv = await fetch(`http://localhost:8080/api/eventos/calendario/${cal.idCalendario}`);
          if (!rEv.ok) return [];
          const eventos = await rEv.json();
          return eventos.map((ev) => ({ ...ev, _calColor: cal.color, _calNombre: cal.nombre }));
        } catch {
          return [];
        }
      })
    );

    const eventos = eventosPorCal.flat().filter(Boolean);
    if (eventos.length === 0) {
      ul.innerHTML = `<li class="evento" style="opacity:.7">No hay eventos próximos.</li>`;
      return;
    }

    eventos.sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));

    const ahora = new Date();
    const proximos = eventos
      .filter((ev) => new Date(ev.fechaFin || ev.fechaInicio) >= ahora)
      .slice(0, 10);

    if (proximos.length === 0) {
      ul.innerHTML = `<li class="evento" style="opacity:.7">No hay eventos próximos.</li>`;
      return;
    }

    proximos.forEach((ev) => {
      const li = document.createElement("li");
      li.classList.add("evento");
      const color = sanitizeColor(ev._calColor);
      const rango = formatearRangoHora(ev.fechaInicio, ev.fechaFin);
      li.innerHTML = `
        <span class="punto" style="background-color: ${color}"></span>
        <div>
          <p class="evento-nombre">${escapeHtml(ev.nombre || "(Sin título)")}</p>
          <p class="evento-hora">${rango}${ev.lugar ? " · " + escapeHtml(ev.lugar) : ""}</p>
        </div>
      `;
      ul.appendChild(li);
    });
  } catch (err) {
    console.error("Error cargando eventos:", err);
    ul.innerHTML = `<li class="evento" style="opacity:.7">No se pudieron cargar los eventos.</li>`;
  }
}
