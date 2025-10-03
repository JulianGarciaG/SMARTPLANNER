document.addEventListener("DOMContentLoaded", () => {
    const btnCrear = document.getElementById("crearEvento");
    const btnCancelar = document.getElementById("cancelarEvento");
    const listaEventosHoy = document.getElementById("listaEventosHoy");
    const agregarEvento = document.getElementById("agregarEvento");
    const calendarEl = document.getElementById("calendar");

    let calendarioActivo = null;
    let calendar = null;
    let eventoIdAEliminar = null;
    let eventoActualMenu = null;

    // ==================== INICIALIZAR FULLCALENDAR ====================
    if (calendarEl) {
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: "dayGridMonth",
            locale: 'es',
            selectable: true,
            editable: true,
            events: [],
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            buttonText: {
                today: 'Hoy',
                month: 'Mes',
                week: 'Semana',
                day: 'Día'
            },
            eventClick: function(info) {
                info.jsEvent.preventDefault();
                info.jsEvent.stopPropagation();
                mostrarMenuContextualEvento(info.event, info.jsEvent);
            },
            eventDrop: async function(info) {
                await actualizarFechasEvento(info.event);
            },
            eventResize: async function(info) {
                await actualizarFechasEvento(info.event);
            }
        });
        calendar.render();
    }

    const KNOWN_CLASSES = ["verde", "morado", "naranja", "azul", "rojo", "rosa"];
    
    // ==================== MENÚ CONTEXTUAL PARA EVENTOS EN FULLCALENDAR ====================
    function mostrarMenuContextualEvento(event, jsEvent) {
        const menu = document.getElementById("menuContextualEvento");
        if (!menu) {
            console.error("No se encontró el elemento #menuContextualEvento en el HTML");
            return;
        }

        eventoActualMenu = parseInt(event.id);

        const menuTitulo = document.getElementById("menuEventoTitulo");
        if (menuTitulo) {
            menuTitulo.textContent = event.title;
        }

        const posX = jsEvent.clientX;
        const posY = jsEvent.clientY;

        menu.style.display = "block";
        menu.style.visibility = "hidden";
        
        const menuWidth = menu.offsetWidth;
        const menuHeight = menu.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        let finalX = posX;
        let finalY = posY;

        if (posX + menuWidth > windowWidth) {
            finalX = windowWidth - menuWidth - 10;
        }

        if (posY + menuHeight > windowHeight) {
            finalY = windowHeight - menuHeight - 10;
        }

        menu.style.left = finalX + "px";
        menu.style.top = finalY + "px";
        menu.style.visibility = "visible";

        setTimeout(() => {
            document.addEventListener("click", function cerrarMenu(e) {
                if (!menu.contains(e.target)) {
                    menu.style.display = "none";
                    document.removeEventListener("click", cerrarMenu);
                }
            });
        }, 0);
    }

    // ==================== EVENT LISTENERS DEL MENÚ ====================
    const btnEditar = document.getElementById("btnMenuEditar");
    const btnEliminar = document.getElementById("btnMenuEliminar");
    const menu = document.getElementById("menuContextualEvento");

    if (btnEditar) {
        btnEditar.addEventListener("click", async () => {
            if (menu) menu.style.display = "none";
            if (eventoActualMenu) {
                await abrirModalEditarEvento(eventoActualMenu);
            }
        });
    }

    if (btnEliminar) {
        btnEliminar.addEventListener("click", async () => {
            if (menu) menu.style.display = "none";
            if (eventoActualMenu) {
                await prepararEliminarEvento(eventoActualMenu);
            }
        });
    }
    
    // ==================== FUNCIONES AUXILIARES ====================
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

    function getUsuario() {
        return JSON.parse(localStorage.getItem("usuario"));
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

    window.cerrarModal = cerrarModal;

    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal")) {
            e.target.style.display = "none";
        }
    });

    // ==================== CREAR EVENTO ====================
    if (btnCrear) {
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
    }

    if (btnCancelar) {
        btnCancelar.addEventListener("click", (e) => {
            e.preventDefault();
            document.getElementById("tituloEvento").value = "";
            document.getElementById("descripcionEvento").value = "";
            document.getElementById("fechaInicioEvento").value = "";
            document.getElementById("fechaFinEvento").value = "";
            document.getElementById("lugarEvento").value = "";
        });
    }

    // ==================== CARGAR EVENTOS ====================
    async function cargarTodosLosEventos() {
        try {
            const usuario = getUsuario();
            if (!usuario || !usuario.idUsuario) {
                console.warn("No se encontró usuario en sesión");
                return [];
            }

            const responseCalendarios = await fetch(`http://localhost:8080/api/calendarios-compartidos/usuario/${usuario.idUsuario}`);
            if (!responseCalendarios.ok) return [];
            
            const calendarios = await responseCalendarios.json();
            if (!Array.isArray(calendarios) || calendarios.length === 0) {
                return [];
            }

            let todosLosEventos = [];
            
            for (const cal of calendarios) {
                const responseEventos = await fetch(`http://localhost:8080/api/eventos/calendario/${cal.idCalendario}`);
                if (responseEventos.ok) {
                    const eventos = await responseEventos.json();
                    todosLosEventos = todosLosEventos.concat(eventos);
                }
            }
            
            return todosLosEventos;
        } catch (err) {
            console.error("Error al cargar todos los eventos:", err);
            return [];
        }
    }

    async function cargarEventos(idCalendario) {
        let eventos;
        
        try {
            if (!idCalendario) {
                eventos = await cargarTodosLosEventos();
            } else {
                const response = await fetch(`http://localhost:8080/api/eventos/calendario/${idCalendario}`);
                if (!response.ok) return;
                eventos = await response.json();
            }

            actualizarListaEventosHoy(eventos);

            if (idCalendario) {
                actualizarContadorEventos(idCalendario, eventos.length);
            }

            await actualizarCalendarioVisual(eventos);
            
        } catch (err) {
            console.error("Error al cargar eventos:", err);
        }
    }

    function actualizarListaEventosHoy(eventos) {
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                <path d="M16 5l3 3" />
                            </svg>
                        </button>
                        <button class="btn-eliminar-evento" data-id="${ev.idEvento}" title="Eliminar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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
    }

    function actualizarContadorEventos(idCalendario, cantidad) {
        const card = document.querySelector(`.elep-calendario .toggle-ocultar[data-id="${idCalendario}"]`)
            ?.closest(".elep-calendario");
        if (card) {
            const h4 = card.querySelector("h4");
            if (h4) {
                h4.textContent = `${cantidad} evento${cantidad !== 1 ? "s" : ""}`;
            }
        }
    }

    async function actualizarCalendarioVisual(eventos) {
        if (!calendar) return;

        calendar.getEvents().forEach(e => e.remove());
        
        const usuario = getUsuario();
        if (!usuario || !usuario.idUsuario) return;

        try {
            const responseCalendarios = await fetch(`http://localhost:8080/api/calendarios-compartidos/usuario/${usuario.idUsuario}`);
            if (!responseCalendarios.ok) return;
            
            const calendarios = await responseCalendarios.json();
            
            const mapaColores = {};
            calendarios.forEach(cal => {
                mapaColores[cal.idCalendario] = cal.color || '#cccccc';
            });
            
            eventos.forEach(ev => {
                const colorEvento = mapaColores[ev.idCalendario] || '#cccccc';
                calendar.addEvent({
                    id: ev.idEvento,
                    title: ev.nombre,
                    start: ev.fechaInicio,
                    end: ev.fechaFin,
                    backgroundColor: colorEvento,
                    borderColor: colorEvento
                });
            });
        } catch (err) {
            console.error("Error al cargar colores de calendarios:", err);
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
    function formatoDatetimeLocal(fecha) {
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        const hours = String(fecha.getHours()).padStart(2, '0');
        const minutes = String(fecha.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    async function abrirModalEditarEvento(idEvento) {
        try {
            const response = await fetch(`http://localhost:8080/api/eventos/${idEvento}`);
            if (!response.ok) throw new Error("Evento no encontrado");
            
            const evento = await response.json();

            document.getElementById("editEventoId").value = evento.idEvento;
            document.getElementById("editTituloEvento").value = evento.nombre;
            document.getElementById("editDescripcionEvento").value = evento.descripcion || "";
            
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

    document.addEventListener("click", async (e) => {
        if (e.target.closest(".btn-editar-evento")) {
            const btn = e.target.closest(".btn-editar-evento");
            const idEvento = parseInt(btn.getAttribute("data-id"));
            await abrirModalEditarEvento(idEvento);
        }
    });

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
    async function prepararEliminarEvento(idEvento) {
        eventoIdAEliminar = idEvento;
        
        try {
            const response = await fetch(`http://localhost:8080/api/eventos/${idEvento}`);
            if (response.ok) {
                const evento = await response.json();
                document.getElementById("nombreEventoEliminar").textContent = evento.nombre;
            }
        } catch (err) {
            console.error(err);
            document.getElementById("nombreEventoEliminar").textContent = "este evento";
        }
        
        abrirModal("modalEliminarEvento");
    }

    document.addEventListener("click", async (e) => {
        if (e.target.closest(".btn-eliminar-evento")) {
            const btn = e.target.closest(".btn-eliminar-evento");
            const idEvento = parseInt(btn.getAttribute("data-id"));
            await prepararEliminarEvento(idEvento);
        }
    });

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

    // ==================== ACTUALIZAR FECHAS AL ARRASTRAR EVENTO ====================
    async function actualizarFechasEvento(event) {
        try {
            const idEvento = event.id;
            
            const response = await fetch(`http://localhost:8080/api/eventos/${idEvento}`);
            if (!response.ok) throw new Error("No se pudo obtener el evento");
            
            const eventoActual = await response.json();
            
            const dto = {
                nombre: eventoActual.nombre,
                descripcion: eventoActual.descripcion,
                fechaInicio: event.start.toISOString(),
                fechaFin: (event.end || event.start).toISOString(),
                lugar: eventoActual.lugar,
                idCalendario: eventoActual.idCalendario
            };
            
            const updateResponse = await fetch(`http://localhost:8080/api/eventos/${idEvento}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dto)
            });
            
            if (!updateResponse.ok) throw new Error("Error al actualizar fechas");
            
        } catch (err) {
            console.error("Error al actualizar fechas:", err);
            alert("❌ Error al actualizar las fechas del evento");
            event.revert();
        }
    }

    // ==================== CALENDARIO ACTIVO ====================
    window.setCalendarioActivo = function(idCalendario, nombre = "", colorHex = "") {
        const nuevoId = idCalendario ? parseInt(idCalendario, 10) : null;
        
        if (calendarioActivo === nuevoId) {
            calendarioActivo = null;
            actualizarUICalendarioSeleccionado(null, "", "");
            cargarEventos(null);
            desmarcarTodosLosCalendarios();
            return;
        }
        
        desmarcarTodosLosCalendarios();
        calendarioActivo = nuevoId;
        
        if (nuevoId) {
            cargarEventos(calendarioActivo);
            actualizarUICalendarioSeleccionado(nuevoId, nombre, colorHex);
            marcarCalendarioSeleccionado(nuevoId);
        } else {
            actualizarUICalendarioSeleccionado(null, "", "");
            cargarEventos(null);
        }
    };

    function actualizarUICalendarioSeleccionado(idCalendario, nombre, colorHex) {
        const titulo = document.getElementById("calendarioSeleccionado");
        const punto = document.getElementById("puntoCalendario");

        if (idCalendario && nombre) {
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
            if (titulo) titulo.textContent = `Viendo: ${nombre}`;
        } else {
            if (titulo) titulo.textContent = "Viendo: Todos los calendarios";
            if (punto) {
                clearKnownColorClasses(punto);
                punto.style.background = "#cccccc";
            }
        }
    }

    function marcarCalendarioSeleccionado(idCalendario) {
        const toggleBtn = document.querySelector(`.toggle-ocultar[data-id="${idCalendario}"]`);
        if (toggleBtn) {
            const card = toggleBtn.closest(".elep-calendario");
            if (card) {
                card.classList.add("calendario-seleccionado");
            }
        }
    }

    function desmarcarTodosLosCalendarios() {
        const todasLasCards = document.querySelectorAll(".elep-calendario");
        todasLasCards.forEach(card => {
            card.classList.remove("calendario-seleccionado");
        });
    }

    // ==================== INICIALIZAR ====================
    cargarEventos(null);
});