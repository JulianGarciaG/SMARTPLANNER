document.addEventListener("DOMContentLoaded", () => {
    const btnCrear = document.getElementById("crearEvento");
    const btnCancelar = document.getElementById("cancelarEvento");
    const listaEventosHoy = document.getElementById("listaEventosHoy");
    const agregarEvento = document.getElementById("agregarEvento");
    const calendarEl = document.getElementById("calendar");

    let calendarioActivo = null;
    let calendar = null;

    if (calendarEl) {
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: "dayGridMonth",
            selectable: true,
            editable: true,
            events: [],
            eventClick: function(info) {
                // Al hacer clic en un evento del calendario, abrir modal de edición
                abrirModalEditarEvento(parseInt(info.event.id));
            }
        });
        calendar.render();
    }

    const KNOWN_CLASSES = ["verde", "morado", "naranja", "azul", "rojo", "rosa"];
    
    function mapColorToClass(rawColor) {
        if (!rawColor) return null;
        const c = rawColor.trim().toLowerCase();
        const map = {
            "#34a853": "verde",
            "#34d399": "verde",
            "#4285f4": "azul",
            "#60a5fa": "azul",
            "#fbbc05": "naranja",
            "#ff9253": "naranja",
            "#ea4335": "rojo",
            "#a142f4": "morado",
            "#9934d3": "morado",
            "#f442ce": "rosa"
        };
        return map[c] || null;
    }
    
    function clearKnownColorClasses(el) {
        if (!el) return;
        KNOWN_CLASSES.forEach(cls => el.classList.remove(cls));
    }

    // ==================== FUNCIONES DE MODALES ====================
    function abrirModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "block";
        }
    }

    function cerrarModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "none";
        }
    }

    // Hacer la función cerrarModal global
    window.cerrarModal = cerrarModal;

    // Cerrar modal al hacer clic fuera
    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal")) {
            e.target.style.display = "none";
        }
    });

    // ==================== CREAR EVENTO ====================
    btnCrear.addEventListener("click", async (e) => {
        e.preventDefault();

        if (!calendarioActivo) {
            alert("Selecciona un calendario antes de crear un evento.");
            return;
        }

        const dto = {
            nombre: document.getElementById("tituloEvento").value.trim(),
            descripcion: document.getElementById("descripcionEvento").value.trim(),
            fechaInicio: document.getElementById("fechaInicioEvento").value,
            fechaFin: document.getElementById("fechaFinEvento").value,
            lugar: document.getElementById("lugarEvento").value.trim(),
            idCalendario: calendarioActivo
        };

        try {
            const response = await fetch("http://localhost:8080/api/eventos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dto)
            });
            if (!response.ok) throw new Error(await response.text());
            await response.json();

            alert("✅ Evento creado correctamente");
            await cargarEventos(calendarioActivo);

            document.getElementById("tituloEvento").value = "";
            document.getElementById("descripcionEvento").value = "";
            document.getElementById("fechaInicioEvento").value = "";
            document.getElementById("fechaFinEvento").value = "";
            document.getElementById("lugarEvento").value = "";

        } catch (err) {
            console.error(err);
            alert("Error: " + (err.message || err));
        }

        if (agregarEvento) agregarEvento.style.display = "none";
    });

    btnCancelar.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("tituloEvento").value = "";
        document.getElementById("descripcionEvento").value = "";
        document.getElementById("fechaInicioEvento").value = "";
        document.getElementById("fechaFinEvento").value = "";
        document.getElementById("lugarEvento").value = "";
    });

    // ==================== CARGAR EVENTOS ====================
    async function cargarEventos(idCalendario) {
        const response = await fetch(`http://localhost:8080/api/eventos/calendario/${idCalendario}`);
        if (!response.ok) return;

        const eventos = await response.json();

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const eventosHoy = eventos.filter(ev => {
            const fechaInicio = new Date(ev.fechaInicio);
            fechaInicio.setHours(0, 0, 0, 0);
            return fechaInicio.getTime() === hoy.getTime();
        });

        listaEventosHoy.innerHTML = "";
        if (eventosHoy.length === 0) {
            listaEventosHoy.innerHTML = "<li>No hay eventos para hoy</li>";
        } else {
            eventosHoy.forEach(ev => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <div class="evento">
                        <span class="hora">${new Date(ev.fechaInicio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        <span class="descripcion">${ev.nombre}</span>
                    </div>
                    <div class="evento-acciones">
                        <button class="btn-editar-evento" data-id="${ev.idEvento}" title="Editar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-edit">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                <path d="M16 5l3 3" />
                            </svg>
                        </button>
                        <button class="btn-eliminar-evento" data-id="${ev.idEvento}" title="Eliminar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-trash-x">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16zm-9.489 5.14a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" />
                                <path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z" />
                            </svg>
                        </button>
                    </div>
                `;
                listaEventosHoy.appendChild(li);
            });
        }

        const card = document.querySelector(`.elep-calendario .toggle-ocultar[data-id="${idCalendario}"]`)
            ?.closest(".elep-calendario");
        if (card) {
            const h4 = card.querySelector("h4");
            if (h4) {
                h4.textContent = `${eventos.length} evento${eventos.length !== 1 ? "s" : ""}`;
            }
        }

        if (calendar) {
            calendar.getEvents().forEach(e => e.remove());
            eventos.forEach(ev => {
                calendar.addEvent({
                    id: ev.idEvento,
                    title: ev.nombre,
                    start: ev.fechaInicio,
                    end: ev.fechaFin
                });
            });
        }
    }

    // ==================== MODAL EDITAR EVENTO ====================
    async function abrirModalEditarEvento(idEvento) {
        try {
            const response = await fetch(`http://localhost:8080/api/eventos/${idEvento}`);
            if (!response.ok) throw new Error("Evento no encontrado");
            
            const evento = await response.json();

            document.getElementById("editEventoId").value = evento.idEvento;
            document.getElementById("editTituloEvento").value = evento.nombre;
            document.getElementById("editDescripcionEvento").value = evento.descripcion || "";
            
            // Convertir LocalDateTime a formato datetime-local
            const fechaInicio = new Date(evento.fechaInicio);
            const fechaFin = new Date(evento.fechaFin);
            
            document.getElementById("editFechaInicioEvento").value = formatoDatetimeLocal(fechaInicio);
            document.getElementById("editFechaFinEvento").value = formatoDatetimeLocal(fechaFin);
            document.getElementById("editLugarEvento").value = evento.lugar || "";

            abrirModal("modalEditarEvento");
        } catch (err) {
            console.error(err);
            alert("❌ Error al cargar el evento: " + err.message);
        }
    }

    // Formatear fecha para input datetime-local
    function formatoDatetimeLocal(fecha) {
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        const hours = String(fecha.getHours()).padStart(2, '0');
        const minutes = String(fecha.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    // Click en botón editar de la lista
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-editar-evento")) {
            const idEvento = parseInt(e.target.getAttribute("data-id"));
            abrirModalEditarEvento(idEvento);
        }
    });

    // Formulario de edición
    const formEditar = document.getElementById("formEditarEvento");
    if (formEditar) {
        formEditar.addEventListener("submit", async (e) => {
            e.preventDefault();

            const idEvento = document.getElementById("editEventoId").value;
            const dto = {
                nombre: document.getElementById("editTituloEvento").value.trim(),
                descripcion: document.getElementById("editDescripcionEvento").value.trim(),
                fechaInicio: document.getElementById("editFechaInicioEvento").value,
                fechaFin: document.getElementById("editFechaFinEvento").value,
                lugar: document.getElementById("editLugarEvento").value.trim(),
                idCalendario: calendarioActivo
            };

            try {
                const response = await fetch(`http://localhost:8080/api/eventos/${idEvento}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dto)
                });

                if (!response.ok) throw new Error(await response.text());

                alert("✅ Evento actualizado correctamente");
                cerrarModal("modalEditarEvento");
                await cargarEventos(calendarioActivo);
            } catch (err) {
                console.error(err);
                alert("❌ Error al actualizar: " + err.message);
            }
        });
    }

    // ==================== MODAL ELIMINAR EVENTO ====================
    let eventoIdAEliminar = null;

    document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("btn-eliminar-evento")) {
            eventoIdAEliminar = parseInt(e.target.getAttribute("data-id"));
            
            // Obtener nombre del evento para mostrar en el modal
            try {
                const response = await fetch(`http://localhost:8080/api/eventos/${eventoIdAEliminar}`);
                if (response.ok) {
                    const evento = await response.json();
                    document.getElementById("nombreEventoEliminar").textContent = evento.nombre;
                }
            } catch (err) {
                console.error(err);
            }
            
            abrirModal("modalEliminarEvento");
        }
    });

    // Confirmar eliminación
    const btnConfirmarEliminarEvento = document.getElementById("confirmarEliminarEvento");
    if (btnConfirmarEliminarEvento) {
        btnConfirmarEliminarEvento.addEventListener("click", async () => {
            if (!eventoIdAEliminar) return;

            try {
                const response = await fetch(`http://localhost:8080/api/eventos/${eventoIdAEliminar}`, {
                    method: "DELETE"
                });

                if (!response.ok) throw new Error("Error al eliminar evento");

                alert("✅ Evento eliminado correctamente");
                cerrarModal("modalEliminarEvento");
                eventoIdAEliminar = null;
                await cargarEventos(calendarioActivo);
            } catch (err) {
                console.error(err);
                alert("❌ Error al eliminar: " + err.message);
            }
        });
    }

    // ==================== CALENDARIO ACTIVO ====================
    window.setCalendarioActivo = function(idCalendario, nombre = "", colorHex = "") {
        calendarioActivo = idCalendario ? parseInt(idCalendario, 10) : null;

        const titulo = document.getElementById("calendarioSeleccionado");
        const punto = document.getElementById("puntoCalendario");

        if (idCalendario) {
            cargarEventos(calendarioActivo);

            const colorClass = mapColorToClass(String(colorHex || "").toLowerCase());
            if (punto) {
                clearKnownColorClasses(punto);
                if (colorClass) {
                    punto.classList.add(colorClass);
                    punto.style.background = "";
                } else if (colorHex) {
                    punto.style.background = colorHex;
                } else {
                    punto.style.background = "#cccccc";
                }
            }
            if (titulo && nombre) titulo.textContent = `Viendo: ${nombre}`;
        } else {
            listaEventosHoy.innerHTML = "<li>No hay eventos para este calendario</li>";
            if (calendar) calendar.getEvents().forEach(e => e.remove());

            if (titulo) titulo.textContent = "No hay calendarios seleccionados";
            if (punto) {
                clearKnownColorClasses(punto);
                punto.style.background = "#cccccc";
            }
        }
    };
});