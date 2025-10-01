document.addEventListener("DOMContentLoaded", async () => {
  const usuarioJSON = localStorage.getItem("usuario");
  if (!usuarioJSON) return;
  const usuario = JSON.parse(usuarioJSON);
  const userId = usuario.idUsuario;

  cargarTareas(userId);
  cargarFinanzas(userId);
  cargarPlanesAhorro(userId);
  cargarCalendarios();
  cargarEventos();
});

// ================== TAREAS ==================
async function cargarTareas(userId) {
  try {
    const res = await fetch(`http://localhost:8080/api/tareas/${userId}`);
    const tareas = await res.json();

    const lista = document.getElementById("listaTareas");
    lista.innerHTML = "";

    let completadas = tareas.filter(t => !!t.estado_de_tarea).length;
    tareas.forEach(t => {
      const li = document.createElement("li");
      li.innerHTML = `
        <input type="checkbox" ${t.estado_de_tarea ? "checked" : ""} data-id="${t.id_tarea}">
        <span>${t.nombre}</span>
        <h5 class="prioridad ${t.prioridad?.toLowerCase() || ''}">${t.prioridad}</h5>
      `;

      const checkbox = li.querySelector("input");
      checkbox.addEventListener("change", async (e) => {
        const checked = e.target.checked;
        if (checked) completadas++; else completadas--;
        document.getElementById("tareasCompletadas").textContent = `${completadas}/${tareas.length}`;

        try {
          // 🔹 Armamos el payload completo que espera el backend
          const payload = {
            nombre: t.nombre,
            descripcion: t.descripcion,
            prioridad: t.prioridad || "media",
            fecha_limite: t.fecha_limite,
            categoria: t.categoria || "sin_asociar",
            estado_de_tarea: checked,
            id_usuario: t.id_usuario
          };

          await fetch(`http://localhost:8080/api/tareas/actualizar/${t.id_tarea}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });

          // 🔹 Refrescamos lista después de actualizar
          window.refreshTareas && window.refreshTareas();

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

// ================== FINANZAS ==================
async function cargarFinanzas(userId) {
  try {
    const res = await fetch(`http://localhost:8080/api/transacciones/usuario/${userId}`);
    const transacciones = await res.json();

    const hoy = new Date().toISOString().split("T")[0];
    let gastosHoy = 0;
    let balance = 0;

    transacciones.forEach(tx => {
      if (tx.tipo === "gasto") balance -= tx.monto;
      if (tx.tipo === "ingreso") balance += tx.monto;
      if (tx.fecha === hoy && tx.tipo === "gasto") gastosHoy += tx.monto;
    });

    document.getElementById("balanceMensual").textContent = `$${balance.toLocaleString()}`;
  } catch (err) {
    console.error("Error cargando finanzas:", err);
  }
}

// ================== PLANES DE AHORRO ==================
async function cargarPlanesAhorro(userId) {
  try {
    const resp = await fetch(`http://localhost:8080/api/planes-ahorro/usuario/${userId}`);
    if (!resp.ok) throw new Error("Error al cargar planes de ahorro");
    const planes = await resp.json();
    document.getElementById("planesAhorro").textContent = planes.length;
  } catch (err) {
    console.error("No se pudieron cargar los planes de ahorro", err);
    document.getElementById("planesAhorro").textContent = "0";
  }
}

// ================== CALENDARIOS ==================
async function cargarCalendarios() {
  try {
    const res = await fetch("http://localhost:8080/api/calendarios");
    const calendarios = await res.json();

    const lista = document.getElementById("listaCalendarios");
    lista.innerHTML = "";

    calendarios.forEach(c => {
      const li = document.createElement("li");
      li.classList.add("evento");
      li.innerHTML = `
        <span class="punto" style="background-color: ${c.color}"></span>
        <div>
          <p class="evento-nombre">${c.nombre}</p>
          <p class="evento-hora">0 Eventos</p>
        </div>
        <div class="detalles">
          <img src="../img/tres-puntos.png" width="20" height="20">
        </div>
      `;
      lista.appendChild(li);
    });
  } catch (err) {
    console.error("Error cargando calendarios:", err);
  }
}

// ================== EVENTOS ==================
function cargarEventos() {
  const lista = document.getElementById("listaEventos");
  lista.innerHTML = `
    <li class="evento">
      <span class="punto verde"></span>
      <div>
        <p class="evento-nombre">Reunión de equipo</p>
        <p class="evento-hora">10:00 AM - 11:00 AM</p>
      </div>
    </li>
    <li class="evento">
      <span class="punto azul"></span>
      <div>
        <p class="evento-nombre">Cita médica</p>
        <p class="evento-hora">3:00 PM - 4:00 PM</p>
      </div>
    </li>
  `;
}
