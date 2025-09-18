document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');

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
