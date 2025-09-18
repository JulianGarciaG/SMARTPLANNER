document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById("containerCalendario");
    const listaCalendarios = document.getElementById("listaCalendarios");
    const apiUrl = "http://localhost:8080/api/calendarios";

    // Crear calendario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = form.querySelector("input[type='text']").value.trim();
        const tipoCalendario = document.getElementById("tipoCalendario").value;

        if (!nombre) {
            alert("El nombre es obligatorio");
            return;
        }

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, tipo_de_calendario: tipoCalendario }), // 👈 clave corregida
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Error al crear el calendario");
            }

            const data = await response.json();
            alert("Calendario creado ✅");
            console.log("Calendario creado:", data);

            form.reset();
            cargarCalendarios();

        } catch (error) {
            console.error("Error:", error);
            alert("Error: " + error.message);
        }
    });

    // Listar calendarios
    async function cargarCalendarios() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Error al cargar calendarios");

            const calendarios = await response.json();
            renderCalendarios(calendarios);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // Renderizar lista
    function renderCalendarios(calendarios) {
        listaCalendarios.innerHTML = "";
        if (calendarios.length === 0) {
            listaCalendarios.innerHTML = "<p>No hay calendarios creados.</p>";
            return;
        }

        calendarios.forEach((cal) => {
            const item = document.createElement("div");
            item.classList.add("calendario-item");
            item.innerHTML = `
        <h3>${cal.nombre}</h3>
        <p>Tipo: ${cal.tipo_de_calendario}</p> <!-- 👈 corregido -->
      `;
            listaCalendarios.appendChild(item);
        });
    }

    cargarCalendarios();
  var calendarEl = document.getElementById('calendar');
    const usuarioJSON = localStorage.getItem("usuario");
    const imgUsuarioHeader = document.getElementById("imgUsuarioHeader");

    if (!imgUsuarioHeader) return; // Si no existe la imagen, salimos

    if (usuarioJSON) {
        const usuario = JSON.parse(usuarioJSON);
        // Si el usuario tiene foto, la ponemos
        if (usuario.foto) {
            imgUsuarioHeader.src = usuario.foto;
        }
    }

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth', // vista mensual
    selectable: true,            // permite seleccionar fechas
    editable: true,              // permite mover eventos

    // Eventos precargados (pueden venir luego desde el backend)
    events: [
      {
        title: 'Evento de prueba',
        start: '2025-08-06',
        end: '2025-08-06'
      },
      {
        title: 'Reunión de equipo',
        start: '2025-08-08T14:00:00',
        end: '2025-08-08T15:00:00'
      }
    ],

    // Cuando se da clic en una fecha vacía
    dateClick: function (info) {
      const title = prompt('¿Título del evento?');
      if (title) {
        calendar.addEvent({
          title: title,
          start: info.dateStr,
          allDay: true
        });

        // Aquí puedes hacer un fetch POST para guardar en el backend Java
        console.log('Evento agregado en: ' + info.dateStr);
      }
    },

    // Cuando se da clic en un evento existente
    eventClick: function (info) {
      if (confirm(`¿Eliminar el evento "${info.event.title}"?`)) {
        info.event.remove();

        // Aquí puedes hacer un fetch DELETE hacia el backend
        console.log('Evento eliminado');
      }
    }
  });

  calendar.render();
});
