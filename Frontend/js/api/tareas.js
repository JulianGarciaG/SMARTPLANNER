document.addEventListener("DOMContentLoaded", () => {
  const crearBtn = document.getElementById("Crear-registro");
  const listaTareas = document.getElementById("lista-tareas");
  let isEditing = false;
  let editId = null;

  const getIdUsuario = () => {
    const idUsuario = localStorage.getItem("id_usuario");
    return idUsuario ? parseInt(idUsuario) : null;
  };

  const formatearFecha = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch (_) {
      return iso;
    }
  };

  const renderTareas = (tareas = []) => {
    if (!listaTareas) return;
    listaTareas.innerHTML = "";
    if (!tareas.length) {
      const li = document.createElement("li");
      li.textContent = "No hay tareas registradas";
      listaTareas.appendChild(li);
      return;
    }

    tareas.forEach((t) => {
      const li = document.createElement("li");
      const prioridad = (t.prioridad || "").toString().toLowerCase();
      const fecha = formatearFecha(t.fecha_limite);
      const completada = t.estado_de_tarea === true;

      // dataset para filtros y contadores
      li.dataset.id = String(t.id_tarea);
      li.dataset.estado = completada ? "completada" : "pendiente";
      li.dataset.prioridad = prioridad;
      li.dataset.nombre = (t.nombre ?? "").toLowerCase();
      li.dataset.descripcion = (t.descripcion ?? "").toLowerCase();

      // Aplicar clase completada al li principal
      li.classList.add("tarea");
      if (completada) {
        li.classList.add("completada");
      }

      li.innerHTML = `
        <div class="tarea-item">
          <div class="tarea-left">
            <input type="checkbox" class="tarea-check" data-id="${t.id_tarea}" ${completada ? "checked" : ""} />
            <div class="tarea-content">
              <h3>${t.nombre ?? "(Sin título)"}</h3>
              <p>${t.descripcion ?? ""}</p>
              <div class="tarea-meta">
                <img src="../img/calendario.png" width="15" height="15" />
                <span>${fecha}</span>
              </div>
            </div>
          </div>
          <div class="tarea-actions">
            <span class="badge ${prioridad}">${prioridad}</span>
            <img class="editar" data-id="${t.id_tarea}" src="../img/editar.png" width="20" height="20" />
            <img class="eliminar" data-id="${t.id_tarea}" src="../img/eliminar.png" width="20" height="20" />
          </div>
        </div>
      `;
      listaTareas.appendChild(li);
    });
  };

  const cargarTareas = async () => {
    const idUsuario = getIdUsuario();
    if (!idUsuario) {
      renderTareas([]);
      return;
    }
    try {
      const resp = await fetch(`http://localhost:8080/api/tareas/${idUsuario}`);
      if (!resp.ok) throw new Error(await resp.text());
      const data = await resp.json();
      const arr = Array.isArray(data) ? data : [];
      window.tareasData = arr;
      renderTareas(arr);
      window.dispatchEvent(new CustomEvent('tareas:loaded', { detail: arr }));
      const total = document.getElementById("totalTareas");
      if (total) total.textContent = String(arr.length || 0);
    } catch (err) {
      console.error("Error cargando tareas:", err);
      renderTareas([]);
      window.tareasData = [];
      window.dispatchEvent(new CustomEvent('tareas:loaded', { detail: [] }));
    }
  };

  cargarTareas();
  window.refreshTareas = cargarTareas;

  if (listaTareas) {
    listaTareas.addEventListener("click", async (e) => {
      const target = e.target;

      // Toggle completada (sin recargar toda la lista)
      if (target.classList.contains("tarea-check")) {
        const li = target.closest('li');
        const checked = !!target.checked;
        
        if (li) {
          if (checked) {
            li.classList.add('completada');
            li.dataset.estado = "completada";
          } else {
            li.classList.remove('completada');
            li.dataset.estado = "pendiente";
          }
        }

        const id = target.getAttribute('data-id');
        const idUsuario = getIdUsuario();

        // Actualiza memoria local para que filtros/contadores reflejen el cambio
        const arr = Array.isArray(window.tareasData) ? window.tareasData : [];
        const tarea = arr.find(t => String(t.id_tarea) === String(id));
        if (tarea) tarea.estado_de_tarea = checked;
        window.tareasData = arr;
        window.dispatchEvent(new Event('tareas:changed'));

        if (id) {
          const payload = {
            nombre: tarea?.nombre || '',
            descripcion: tarea?.descripcion || '',
            prioridad: (tarea?.prioridad || '').toString().toLowerCase() || 'media',
            fecha_limite: tarea?.fecha_limite || new Date().toISOString(),
            categoria: (tarea?.categoria || 'sin_asociar').toString().toLowerCase(),
            estado_de_tarea: checked,
            id_usuario: idUsuario
          };
          try {
            await fetch(`http://localhost:8080/api/tareas/actualizar/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
          } catch (err) {
            console.error('No se pudo actualizar estado de tarea', err);
          }
        }
        return;
      }

      // Eliminar
      if (target.classList.contains("eliminar")) {
        const id = target.getAttribute("data-id");
        if (!id) return;
        if (!confirm("¿Deseas eliminar esta tarea?")) return;
        try {
          const resp = await fetch(`http://localhost:8080/api/tareas/eliminar/${id}`, { method: "DELETE" });
          if (!resp.ok) throw new Error(await resp.text());
          await cargarTareas();
        } catch (err) {
          alert("No se pudo eliminar la tarea");
          console.error(err);
        }
      }

      // Editar
      if (target.classList.contains("editar")) {
        const id = target.getAttribute("data-id");
        if (!id) return;

        const modal = document.getElementById("agregarRegistro");
        const form = document.getElementById("containerRegistro");
        if (!modal || !form) return;

        const card = target.closest("li");
        const tituloInput = document.querySelector('.titulo input');
        const descripcionInput = document.querySelector('.descripcion input');
        const prioridadSelect = document.querySelector('.prioridad select');
        const fechaInput = document.querySelector('.fecha-limite input');

        const titulo = card.querySelector('.tarea-content h3')?.textContent || '';
        const descripcion = card.querySelector('.tarea-content p')?.textContent || '';
        const badge = card.querySelector('.badge')?.textContent || '';
        const fechaTexto = card.querySelector('.tarea-meta span')?.textContent || '';

        tituloInput.value = titulo;
        descripcionInput.value = descripcion;
        prioridadSelect.value = badge || 'media';
        const date = new Date(fechaTexto);
        if (!isNaN(date.getTime())) {
          const isoLocal = new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,16);
          fechaInput.value = isoLocal;
        }

        modal.style.display = 'flex';
        isEditing = true;
        editId = id;
        if (crearBtn) crearBtn.textContent = 'Guardar cambios';
        const tituloModal = modal.querySelector('form h1');
        if (tituloModal) tituloModal.textContent = 'Actualizar tarea';
      }
    });
  }

  if (crearBtn) {
    crearBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const idUsuario = getIdUsuario();
      if (!idUsuario) {
        alert("Debes iniciar sesión primero");
        window.location.href = "login.html";
        return;
      }

      const tarea = {
        nombre: document.querySelector(".titulo input").value,
        descripcion: document.querySelector(".descripcion input").value,
        prioridad: document.querySelector(".prioridad select").value,
        fecha_limite: document.querySelector(".fecha-limite input").value,
        categoria: document.getElementById("abrirAsociarGasto").checked ? "asociada" : "sin_asociar",
        estado_de_tarea: false,
        id_usuario: idUsuario
      };

      try {
        let response;
        if (isEditing && editId) {
          response = await fetch(`http://localhost:8080/api/tareas/actualizar/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tarea)
          });
        } else {
          response = await fetch("http://localhost:8080/api/tareas/crear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tarea),
          });
        }

        if (response.ok) {
          alert(isEditing ? 'Tarea actualizada ✅' : 'Tarea creada con éxito ✅');
          await cargarTareas();
          const modal = document.getElementById('agregarRegistro');
          if (modal) modal.style.display = 'none';
          isEditing = false;
          editId = null;
          crearBtn.textContent = 'Crear';
        } else {
          const errorText = await response.text();
          throw new Error(errorText);
        }
      } catch (error) {
        console.error("Error:", error);
        alert((isEditing ? 'Error al actualizar tarea ❌: ' : 'Error al crear tarea ❌: ') + error.message);
      }
    });
  }
});
