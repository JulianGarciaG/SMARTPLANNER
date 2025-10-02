// ../js/api/tareas.js

document.addEventListener("DOMContentLoaded", async () => {
    console.log("🚀 Iniciando tareas.js...");

    // ==============================
    // 🔧 Variables globales de estado
    // ==============================
    let isEditing = false;
    let editId = null;
    let transaccionesCache = {};
    let todasLasTareas = [];
    let estadoFiltro = "todas";
    let textoBusqueda = "";
    let prioridadFiltro = "todas";

    // ==============================
    // 📌 Referencias del DOM
    // ==============================
    const crearBtn = document.getElementById("Crear-registro");
    const listaTareas = document.getElementById("lista-tareas");
    const inputBuscar = document.getElementById("inputBuscar");
    const selectPrioridad = document.getElementById("selectPrioridad");
    const btnTodas = document.getElementById("btnTodas");
    const btnPendientes = document.getElementById("btnPendientes");
    const btnCompletadas = document.getElementById("btnCompletadas");
    const abrirMenuRegistro = document.getElementById("abrirMenuRegistro");

    // REFERENCIAS DEL FORMULARIO DE REGISTRO
    const modalRegistro = document.getElementById("agregarRegistro");
    const formRegistro = document.getElementById("containerRegistro");
    const checkboxAsociar = document.getElementById("abrirAsociarGasto");
    const selectGasto = document.querySelector("#asociarGasto select");
    const tituloInput = document.querySelector(".titulo input");
    const descripcionInput = document.querySelector(".descripcion input");
    const prioridadSelect = document.querySelector(".prioridad select");
    const fechaInput = document.querySelector(".fecha-limite input");

    // ==============================
    // 🛠️ Utilidades
    // ==============================
    const getIdUsuario = () => {
        const usuarioJSON = localStorage.getItem("usuario");
        if (!usuarioJSON) {
            console.warn("⚠️ No hay usuario en localStorage");
            return null;
        }
        try {
            const usuario = JSON.parse(usuarioJSON);
            return usuario.idUsuario || null;
        } catch (e) {
            console.error("❌ Error parseando usuario:", e);
            return null;
        }
    };

    const formatearMoneda = (valor) =>
        new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(valor);

    const formatearFecha = (iso) => {
        if (!iso) return "";
        try {
            return new Date(iso).toLocaleString("es-CO", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (_) {
            return iso;
        }
    };

    // ==============================
    // 📌 Transacciones
    // ==============================
    const cargarTransacciones = async () => {
        const idUsuario = getIdUsuario();
        if (!idUsuario) {
            console.warn("❌ No hay idUsuario para cargar transacciones");
            return;
        }

        try {
            console.log(`🔄 Cargando transacciones para usuario: ${idUsuario}`);
            const resp = await fetch(
                `http://localhost:8080/api/transacciones/usuario/${idUsuario}`
            );

            if (!resp.ok) {
                throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
            }

            const data = await resp.json();
            console.log("📦 Transacciones recibidas:", data);

            // Guardar en cache - Usando id_gasto (que debería ser el ID referenciado en la Tarea)
            transaccionesCache = {};
            if (Array.isArray(data)) {
                data.forEach((tx) => {
                    transaccionesCache[tx.id_gasto] = tx; 
                });
            }
            console.log(`✅ ${Object.keys(transaccionesCache).length} transacciones en cache`);
        } catch (err) {
            console.error("❌ Error cargando transacciones:", err);
        }
    };

    const poblarSelectTransacciones = () => {
        if (!selectGasto) {
            console.warn("❌ No se encontró el select de gastos (#asociarGasto select)");
            return;
        }

        // Limpiar opciones anteriores
        selectGasto.innerHTML = '<option value="">-- Selecciona una transacción --</option>';

        const transacciones = Object.values(transaccionesCache);
        console.log(`🔄 Poblando select con ${transacciones.length} transacciones`);

        if (transacciones.length === 0) {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "No hay transacciones disponibles";
            option.disabled = true;
            selectGasto.appendChild(option);
            return;
        }

        transacciones.forEach((tx) => {
            const option = document.createElement("option");
            option.value = tx.id_gasto; 
            option.textContent = `${tx.descripcion} - ${formatearMoneda(tx.monto)} (${tx.tipo})`;
            selectGasto.appendChild(option);
        });

        console.log("✅ Select poblado con opciones:", selectGasto.children.length);
    };

    // ----------------------------------------------------
    // 🟢 FUNCIÓN CLAVE PARA LA EDICIÓN
    // ----------------------------------------------------
    const iniciarEdicion = (tarea) => {
        console.log(`🔄 Iniciando edición para tarea ID: ${tarea.id_tarea}`);
        
        // 1. Rellenar campos de la tarea
        tituloInput.value = tarea.nombre || "";
        descripcionInput.value = tarea.descripcion || "";
        prioridadSelect.value = tarea.prioridad?.toLowerCase() || "media";

        if (tarea.fecha_limite) {
            const date = new Date(tarea.fecha_limite);
            if (!isNaN(date.getTime())) {
                fechaInput.value = new Date(
                    date.getTime() - date.getTimezoneOffset() * 60000
                )
                    .toISOString()
                    .slice(0, 16);
            }
        }
        
        // 2. Lógica de Transacción: Preselección y visibilidad
        poblarSelectTransacciones(); // Asegurar que las opciones estén disponibles
        
        if (tarea.id_transaccion) {
            console.log(`Asociando ID de Transacción: ${tarea.id_transaccion}`);
            
            // Marcar el checkbox
            checkboxAsociar.checked = true;
            
            // Forzar el evento 'change' para que tu script 'input-check.js' muestre el contenedor
            if (checkboxAsociar) checkboxAsociar.dispatchEvent(new Event("change"));
            
            // Asignar el valor de la transacción asociada
            selectGasto.value = String(tarea.id_transaccion); 
        } else {
            console.log("No hay transacción asociada.");
            checkboxAsociar.checked = false;
            
            // Forzar el evento 'change' para que tu script 'input-check.js' oculte el contenedor
            if (checkboxAsociar) checkboxAsociar.dispatchEvent(new Event("change"));
            selectGasto.value = "";
        }

        // 3. Configurar estado de edición y UI
        modalRegistro.style.display = "flex";
        isEditing = true;
        editId = String(tarea.id_tarea);
        crearBtn.textContent = "Guardar cambios";
        formRegistro.querySelector("h1").textContent = "Actualizar tarea";
    };
    // ----------------------------------------------------
    
    // ==============================
    // 📌 Renderizado de tareas
    // ==============================
    const renderTareas = (tareas) => {
        if (!listaTareas) {
            console.warn("❌ No se encontró #lista-tareas");
            return;
        }

        listaTareas.innerHTML = "";

        if (!tareas.length) {
            listaTareas.innerHTML = "<li style='padding: 20px; text-align: center;'>No hay tareas registradas</li>";
            return;
        }

        tareas.forEach((t) => {
            const li = document.createElement("li");
            li.classList.add("tarea");
            if (t.estado_de_tarea) li.classList.add("completada");

            const prioridad = (t.prioridad || "media").toLowerCase();
            const fecha = formatearFecha(t.fecha_limite);

            // Info transacción: buscamos en cache por id_transaccion
            let infoTransaccion = "";
            const tx = t.id_transaccion && transaccionesCache[t.id_transaccion];
            if (tx) {
                infoTransaccion = `
                    <p style="margin:8px 0 0;font-size:13px;color:#666;font-weight:500;">
                        💰 Asociada a: ${tx.descripcion} (${formatearMoneda(tx.monto)}) - ${tx.tipo}
                    </p>
                `;
            }

            li.innerHTML = `
                <div class="tarea-item">
                    <div class="tarea-left">
                        <input type="checkbox" class="tarea-check" data-id="${t.id_tarea}" ${t.estado_de_tarea ? "checked" : ""}/>
                        <div class="tarea-content">
                            <h3>${t.nombre ?? "(Sin título)"}</h3>
                            <p>${t.descripcion ?? ""}</p>
                            <div class="tarea-meta">
                                <img src="../img/calendario.png" width="15" height="15" alt="fecha"/>
                                <span>${fecha}</span>
                            </div>
                            ${infoTransaccion}
                        </div>
                    </div>
                    <div class="tarea-actions">
                        <span class="badge ${prioridad}">${prioridad}</span>
                        <img class="editar" data-id="${t.id_tarea}" src="../img/editar.png" width="20" height="20" alt="editar" style="cursor: pointer;"/>
                        <img class="eliminar" data-id="${t.id_tarea}" src="../img/eliminar.png" width="20" height="20" alt="eliminar" style="cursor: pointer;"/>
                    </div>
                </div>
            `;

            listaTareas.appendChild(li);
        });
    };

    // ==============================
    // 📌 Contadores y filtros
    // ==============================
    const actualizarContadores = () => {
        const total = todasLasTareas.length;
        const completadas = todasLasTareas.filter((t) => t.estado_de_tarea).length;
        const pendientes = total - completadas;
        const altaPrioridad = todasLasTareas.filter(
            (t) => (t.prioridad || "").toLowerCase() === "alta"
        ).length;

        if (btnTodas) btnTodas.textContent = `Todas (${total})`;
        if (btnPendientes) btnPendientes.textContent = `Pendientes (${pendientes})`;
        if (btnCompletadas) btnCompletadas.textContent = `Completadas (${completadas})`;

        const totalEl = document.getElementById("totalTareas");
        const completadasEl = document.getElementById("tareasCompletadas");
        const altaPrioridadEl = document.getElementById("tareasAltaPrioridad");

        if (totalEl) totalEl.textContent = total;
        if (completadasEl) completadasEl.textContent = completadas;
        if (altaPrioridadEl) altaPrioridadEl.textContent = altaPrioridad;
    };

    const aplicarFiltros = () => {
        let base = [...todasLasTareas];

        if (estadoFiltro === "pendientes") {
            base = base.filter((t) => !t.estado_de_tarea);
        } else if (estadoFiltro === "completadas") {
            base = base.filter((t) => t.estado_de_tarea);
        }

        if (prioridadFiltro !== "todas") {
            base = base.filter(
                (t) => (t.prioridad || "").toLowerCase() === prioridadFiltro
            );
        }

        if (textoBusqueda.trim()) {
            const q = textoBusqueda.toLowerCase();
            base = base.filter(
                (t) =>
                    (t.nombre || "").toLowerCase().includes(q) ||
                    (t.descripcion || "").toLowerCase().includes(q)
            );
        }

        renderTareas(base);
        actualizarContadores();
    };

    // ==============================
    // 📌 Cargar tareas
    // ==============================
    const cargarTareas = async () => {
        const idUsuario = getIdUsuario();
        if (!idUsuario) {
            renderTareas([]);
            return;
        }

        // Cargar transacciones primero para que la cache esté lista para renderizar
        await cargarTransacciones();

        try {
            const resp = await fetch(
                `http://localhost:8080/api/tareas/${idUsuario}`
            );

            if (!resp.ok) {
                throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
            }

            const data = await resp.json();
            
            todasLasTareas = Array.isArray(data) ? data : (data.tareas || []);
            
            aplicarFiltros();

        } catch (err) {
            console.error("❌ Error cargando tareas:", err);
            renderTareas([]);
        }
    };

    // ==============================
    // 📌 Eventos: filtros
    // ==============================
    if (btnTodas) btnTodas.addEventListener("click", () => { estadoFiltro = "todas"; aplicarFiltros(); });
    if (btnPendientes) btnPendientes.addEventListener("click", () => { estadoFiltro = "pendientes"; aplicarFiltros(); });
    if (btnCompletadas) btnCompletadas.addEventListener("click", () => { estadoFiltro = "completadas"; aplicarFiltros(); });
    if (inputBuscar) inputBuscar.addEventListener("input", (e) => { textoBusqueda = e.target.value; aplicarFiltros(); });
    if (selectPrioridad) selectPrioridad.addEventListener("change", (e) => { prioridadFiltro = e.target.value; aplicarFiltros(); });

    // ==============================
    // 📌 Evento: abrir modal (Crear)
    // ==============================
    // ... (omito código anterior)

// ==============================
// 📌 Evento: abrir modal (Crear)
// ==============================
if (abrirMenuRegistro) {
    abrirMenuRegistro.addEventListener("click", () => {
        // Configurar para CREAR
        isEditing = false;
        editId = null;
        crearBtn.textContent = "Crear";
        formRegistro.querySelector("h1").textContent = "Nueva Tarea";
        formRegistro.reset(); 
        
        // ESTA ES LA CLAVE: LLAMADA A LA FUNCIÓN DE POBLAR
        poblarSelectTransacciones(); 
        
        // Asegurar que el contenedor del select se oculte al crear (si el checkbox no está marcado)
        if (checkboxAsociar) checkboxAsociar.dispatchEvent(new Event("change"));

        modalRegistro.style.display = "flex";
    });
}

// ... (omito código posterior)

    // ==============================
    // 📌 Eventos: lista de tareas (CRUD)
    // ==============================
    if (listaTareas) {
        listaTareas.addEventListener("click", async (e) => {
            const target = e.target;

            // ✅ Toggle completar
            if (target.classList.contains("tarea-check")) {
                const id = target.dataset.id;
                const tarea = todasLasTareas.find((t) => String(t.id_tarea) === id);
                if (!tarea) return;

                try {
                    await fetch(`http://localhost:8080/api/tareas/actualizar/${id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            ...tarea,
                            prioridad: tarea.prioridad?.toLowerCase(),
                            id_transaccion: tarea.id_transaccion, 
                            id_usuario: getIdUsuario(),
                            estado_de_tarea: target.checked,
                        }),
                    });

                    await cargarTareas();
                } catch (err) {
                    console.error("Error actualizando tarea:", err);
                    alert("Error al actualizar la tarea");
                }
                return;
            }

            // 🗑️ Eliminar
            if (target.classList.contains("eliminar")) {
                const id = target.dataset.id;
                if (!confirm("¿Deseas eliminar esta tarea?")) return;

                try {
                    await fetch(`http://localhost:8080/api/tareas/eliminar/${id}`, {
                        method: "DELETE",
                    });

                    await cargarTareas();
                } catch (err) {
                    console.error("Error eliminando tarea:", err);
                    alert("Error al eliminar la tarea");
                }
                return;
            }

            // ✏️ Editar
            if (target.classList.contains("editar")) {
                const id = target.dataset.id;
                const tarea = todasLasTareas.find((t) => String(t.id_tarea) === id);
                if (!tarea) return;

                iniciarEdicion(tarea);
            }
        });
    }

    // ==============================
    // 📌 Crear / actualizar tarea
    // ==============================
    if (crearBtn) {
        crearBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            if (!tituloInput.value.trim()) {
                alert("El título es obligatorio");
                return;
            }
            
            const selectedTxId = 
                checkboxAsociar?.checked && selectGasto?.value 
                ? parseInt(selectGasto.value) 
                : null;
            
            let tarea = {
                nombre: tituloInput.value,
                descripcion: descripcionInput.value,
                prioridad: prioridadSelect.value,
                fecha_limite: fechaInput.value,
                categoria: selectedTxId ? "asociada" : "sin_asociar", 
                estado_de_tarea: false, 
                id_usuario: getIdUsuario(),
                id_transaccion: selectedTxId,
            };

            // Si se está editando, recuperamos el estado_de_tarea actual
            if (isEditing) {
                const tareaActual = todasLasTareas.find((t) => String(t.id_tarea) === editId);
                if (tareaActual) {
                    tarea.estado_de_tarea = tareaActual.estado_de_tarea; 
                }
            }


            const url = isEditing
                ? `http://localhost:8080/api/tareas/actualizar/${editId}`
                : "http://localhost:8080/api/tareas/crear";
            const method = isEditing ? "PUT" : "POST";

            try {
                console.log(`Sending ${method} request to: ${url}`, tarea);
                const response = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(tarea),
                });

                if (response.ok) {
                    alert(isEditing ? "Tarea actualizada" : "Tarea creada");

                    // Restablecer el formulario
                    modalRegistro.style.display = "none";
                    formRegistro.reset(); 

                    // Recargar y re-renderizar la lista
                    await cargarTareas(); 
                    
                    isEditing = false;
                    editId = null;

                    crearBtn.textContent = "Crear";
                    document.querySelector("#containerRegistro h1").textContent = "Nueva Tarea";
                } else {
                    alert("Error: " + (await response.text()));
                }
            } catch (err) {
                console.error("Error guardando tarea:", err);
                alert("Error al guardar la tarea");
            }
        });
    }

    // ==============================
    // 🚀 Inicializar
    // ==============================
    console.log("🔄 Cargando tareas iniciales...");
    await cargarTareas();
    window.refreshTareas = cargarTareas;
    console.log("✅ Inicialización completa");
});