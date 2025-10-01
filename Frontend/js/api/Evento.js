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
            events: []
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

    async function cargarEventos(idCalendario) {
    const response = await fetch(`http://localhost:8080/api/eventos/calendario/${idCalendario}`);
    if (!response.ok) return;

    const eventos = await response.json();

    // Obtener fecha de hoy sin horas para comparar
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Filtrar solo eventos que empiezan hoy
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
                <span class="etiqueta trabajo">Trabajo</span>
            `;
            listaEventosHoy.appendChild(li);
        });
    }

    // --- Actualizar contador de eventos en el panel lateral ---
    const card = document.querySelector(`.elep-calendario .toggle-ocultar[data-id="${idCalendario}"]`)
        ?.closest(".elep-calendario");
    if (card) {
        const h4 = card.querySelector("h4");
        if (h4) {
            h4.textContent = `${eventosHoy.length} evento${eventosHoy.length !== 1 ? "s" : ""}`;
        }
    }
    // ---------------------------------------------------------

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
