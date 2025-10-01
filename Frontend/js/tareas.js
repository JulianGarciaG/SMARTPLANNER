document.addEventListener("DOMContentLoaded", async () => {
    // Validar usuario logueado
    const usuarioJSON = localStorage.getItem("usuario");
    if (!usuarioJSON) {
        window.location.href = "login.html";
        return;
    }
    const usuario = JSON.parse(usuarioJSON);

    const lista = document.getElementById("lista-tareas");
    const tituloSeccion = document.querySelector('.tareas h1');
    const inputBuscar = document.getElementById('inputBuscar');
    const selectPrioridad = document.getElementById('selectPrioridad');
    const totalTareas = document.getElementById("totalTareas");
    const tareasCompletadas = document.getElementById("tareasCompletadas");
    const tareasAltaPrioridad = document.getElementById("tareasAltaPrioridad");

    const btnTodas = document.getElementById("btnTodas");
    const btnPendientes = document.getElementById("btnPendientes");
    const btnCompletadas = document.getElementById("btnCompletadas");

    // ---------- Datos en memoria ----------
    let todasLasTareas = Array.isArray(window.tareasData) ? window.tareasData : [];
    let estadoFiltro = 'todas'; // 'todas' | 'pendientes' | 'completadas'
    let textoBusqueda = '';
    let prioridadFiltro = 'todas';

    async function crearTarea(tarea) {
        try {
            const response = await fetch(`http://localhost:8080/api/tareas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...tarea, usuarioId: usuario.id })
            });
            if (!response.ok) throw new Error("Error al crear tarea");
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // ---------- Render ----------
    function renderizarTareas(tareas) {
        lista.innerHTML = "";
        if (!tareas.length) {
            const li = document.createElement('li');
            li.textContent = 'No hay tareas registradas';
            lista.appendChild(li);
            return;
        }
        tareas.forEach(tarea => lista.appendChild(crearElementoTarea(tarea)));
    }

    function crearElementoTarea(tarea) {
        const li = document.createElement("li");
        li.classList.add("tarea");

        const checked = (tarea.estado_de_tarea === true || tarea.completada);

        if (checked) {
            li.classList.add("completada"); // 👈 Agregamos clase al li
        }

        li.innerHTML = `
            <div class="informacion">
                <div class="container-input">
                    <img src="../img/controlar.png" width="10" height="10" />
                    <input type="checkbox" class="input-tarea" ${checked ? "checked" : ""} data-id="${tarea.id_tarea || tarea.id}" />
                </div>
                <div class="texto">
                    <h1 class="texto-titulo">${tarea.nombre || tarea.titulo}</h1>
                    <h2>${tarea.descripcion ?? ""}</h2>
                    <p><img src="../img/calendario.png" width="15" height="15" /> 
                        ${(tarea.fecha_limite || tarea.fechaLimite || '').toString().substring(0,10)}
                    </p>
                </div>
            </div>
            <div class="derecha">
                <div class="estados">
                    <p class="${(tarea.prioridad||'').toLowerCase()}">${(tarea.prioridad||'').toLowerCase()}</p>
                    ${tarea.valor ? `<p class="valor">$${tarea.valor}</p>` : ""}
                </div>
                <div class="crud">
                    <img class="editar" src="../img/editar.png" width="20" height="20" data-id="${tarea.id}" />
                    <img class="eliminar" src="../img/eliminar.png" width="20" height="20" data-id="${tarea.id}" />
                </div>
            </div>
        `;

        // 🔹 Evento para marcar/desmarcar completada
        const checkbox = li.querySelector(".input-tarea");
        checkbox.addEventListener("change", async (e) => {
            const checked = e.target.checked;

            if (checked) {
                li.classList.add("completada");
            } else {
                li.classList.remove("completada");
            }

            try {
                // Mandar actualización al backend
                const payload = {
                    nombre: tarea.nombre,
                    descripcion: tarea.descripcion,
                    prioridad: tarea.prioridad || "media",
                    fecha_limite: tarea.fecha_limite,
                    categoria: tarea.categoria || "sin_asociar",
                    estado_de_tarea: checked,
                    id_usuario: tarea.id_usuario
                };

                await fetch(`http://localhost:8080/api/tareas/actualizar/${tarea.id_tarea}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                // Refrescar vista
                aplicarFiltros();

            } catch (err) {
                console.error("Error actualizando tarea:", err);
            }
        });

        return li;
    }


    function actualizarResumen(tareas) {
        const total = todasLasTareas.length;
        const completadas = todasLasTareas.filter(t => t.estado_de_tarea === true || t.completada).length;
        const altaPrioridad = todasLasTareas.filter(t => (t.prioridad || '').toLowerCase() === "alta").length;

        totalTareas.textContent = total;
        tareasCompletadas.textContent = completadas;
        tareasAltaPrioridad.textContent = altaPrioridad;

        btnTodas.textContent = `Todas (${total})`;
        btnPendientes.textContent = `Pendientes (${total - completadas})`;
        btnCompletadas.textContent = `Completadas (${completadas})`;
    }

    // ---------- Filtro combinado ----------
    function aplicarFiltros() {
        let base = [...todasLasTareas];

        // estado
        if (estadoFiltro === 'pendientes') base = base.filter(t => !(t.estado_de_tarea === true || t.completada));
        if (estadoFiltro === 'completadas') base = base.filter(t => (t.estado_de_tarea === true || t.completada));

        // prioridad
        if (prioridadFiltro !== 'todas') base = base.filter(t => (t.prioridad || '').toLowerCase() === prioridadFiltro);

        // búsqueda
        const q = textoBusqueda.trim().toLowerCase();
        if (q) base = base.filter(t =>
            (t.nombre || t.titulo || '').toLowerCase().includes(q) ||
            (t.descripcion || '').toLowerCase().includes(q)
        );

        renderizarTareas(base);
        // actualizar contadores con todas las tareas en memoria
        actualizarResumen(todasLasTareas);

        // actualizar título
        if (tituloSeccion) {
            if (estadoFiltro === 'todas') tituloSeccion.textContent = 'Todas las tareas';
            if (estadoFiltro === 'pendientes') tituloSeccion.textContent = 'Tareas pendientes';
            if (estadoFiltro === 'completadas') tituloSeccion.textContent = 'Tareas completadas';
        }
    }

    // ---------- Eventos ----------
    const form = document.getElementById("containerRegistro");
    if (form) {
        // Evitar doble manejo: la creación/edición la gestiona js/api/tareas.js
        form.addEventListener("submit", (e) => {
            e.preventDefault();
        });
    }

    // Botones de estado
    btnTodas.addEventListener('click', () => { estadoFiltro = 'todas'; aplicarFiltros(); });
    btnPendientes.addEventListener('click', () => { estadoFiltro = 'pendientes'; aplicarFiltros(); });
    btnCompletadas.addEventListener('click', () => { estadoFiltro = 'completadas'; aplicarFiltros(); });

    // Búsqueda
    inputBuscar.addEventListener('input', (e) => { textoBusqueda = e.target.value; aplicarFiltros(); });

    // Prioridad
    selectPrioridad.addEventListener('change', (e) => { prioridadFiltro = e.target.value; aplicarFiltros(); });

    // Cuando el otro script cargue tareas del backend
    window.addEventListener('tareas:loaded', (ev) => {
        todasLasTareas = Array.isArray(ev.detail) ? ev.detail : [];
        aplicarFiltros();
    });

    // ---------- Init ----------
    aplicarFiltros();
});
