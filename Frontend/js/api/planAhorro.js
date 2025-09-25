document.addEventListener("DOMContentLoaded", () => {
  const abrirMenuBtn = document.getElementById("abrirMenuPlanAhorro");
  const cerrarMenuBtn = document.getElementById("cerrarMenuPlanAhorro");
  const cancelarBtn = document.getElementById("cancelarPlanAhorro");
  const guardarBtn = document.getElementById("guardarPlanAhorro");
  const modal = document.getElementById("agregarPlanAhorro");
  const form = document.getElementById("containerPlanAhorro");

  let isEditing = false;
  let editId = null;

  // Variables para el modal de agregar aporte
  let planActualId = null;
  const modalAporte = document.getElementById('editarProgresoAhorro');
  const cerrarAporte = document.getElementById('cerrarEditarProgresoAhorro');
  const cancelarAporte = document.getElementById('cancelar');
  const btnActualizar = document.getElementById('Actualizar');

  // Obtener ID del usuario desde localStorage
  const getIdUsuario = () => {
    const usuarioJSON = localStorage.getItem("usuario");
    if (usuarioJSON) {
      const usuario = JSON.parse(usuarioJSON);
      return usuario.idUsuario;
    }
    const idUsuario = localStorage.getItem("id_usuario");
    return idUsuario ? parseInt(idUsuario) : null;
  };

  // Limpiar formulario principal
  const limpiarFormulario = () => {
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => input.value = '');
    isEditing = false;
    editId = null;
    guardarBtn.textContent = 'Guardar';
    form.querySelector('h1').textContent = 'Nuevo Plan de Ahorro';
  };

  // Limpiar formulario de aporte - NO DEBE RESETEAR planActualId
  const limpiarFormularioAporte = () => {
    const inputs = modalAporte.querySelectorAll('input');
    inputs.forEach(input => input.value = '');
    // NO reseteamos planActualId aquí porque se usa cuando se limpia al cerrar
  };

  // Abrir modal principal
  if (abrirMenuBtn) {
    abrirMenuBtn.addEventListener("click", () => {
      limpiarFormulario();
      modal.style.display = "flex";
    });
  }

  // Cerrar modal principal
  const cerrarModal = () => {
    modal.style.display = "none";
    limpiarFormulario();
  };

  if (cerrarMenuBtn) {
    cerrarMenuBtn.addEventListener("click", cerrarModal);
  }

  if (cancelarBtn) {
    cancelarBtn.addEventListener("click", (e) => {
      e.preventDefault();
      cerrarModal();
    });
  }

  // Cerrar modal principal al hacer clic fuera
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      cerrarModal();
    }
  });

  // Event listeners para el modal de aportes
  if (cerrarAporte) {
    cerrarAporte.addEventListener('click', () => {
      modalAporte.style.display = 'none';
      planActualId = null; // Solo resetear cuando se cierra
      limpiarFormularioAporte();
    });
  }

  if (cancelarAporte) {
    cancelarAporte.addEventListener('click', (e) => {
      e.preventDefault();
      modalAporte.style.display = 'none';
      planActualId = null; // Solo resetear cuando se cancela
      limpiarFormularioAporte();
    });
  }

  // Cerrar modal de aporte al hacer clic fuera
  if (modalAporte) {
    modalAporte.addEventListener('click', (e) => {
      if (e.target === modalAporte) {
        modalAporte.style.display = 'none';
        planActualId = null; // Solo resetear cuando se cierra
        limpiarFormularioAporte();
      }
    });
  }

  // Cargar planes de ahorro desde API
  const cargarPlanesAhorro = async () => {
    const idUsuario = getIdUsuario();
    if (!idUsuario) {
      console.error("Usuario no autenticado");
      return [];
    }

    try {
      const response = await fetch(`http://localhost:8080/api/planes-ahorro/usuario/${idUsuario}`);
      if (!response.ok) throw new Error(await response.text());
      
      const planes = await response.json();
      window.planesAhorroData = planes;
      renderizarPlanes(planes);
      return planes;
      
    } catch (error) {
      console.error("Error cargando planes de ahorro:", error);
      return [];
    }
  };

  // Renderizar planes en el HTML
  const renderizarPlanes = (planes) => {
    const lista = document.getElementById("lista-planes-ahorro");
    if (!lista) return;

    lista.innerHTML = "";

    if (planes.length === 0) {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="informacion">
          <div class="texto">
            <h1>No hay planes de ahorro registrados</h1>
            <h2>Crea tu primer plan de ahorro</h2>
          </div>
        </div>
      `;
      lista.appendChild(li);
      return;
    }

    planes.forEach(plan => {
      const li = document.createElement("li");
      const porcentaje = plan.montoMeta > 0 ? Math.min((plan.montoActual / plan.montoMeta) * 100, 100) : 0;
      const estaCompleto = plan.cumplido || porcentaje >= 100;
      const fechaLimite = plan.fechaFin ? new Date(plan.fechaFin).toLocaleDateString() : 'Sin fecha límite';
      
      li.innerHTML = `
        <div class="informacion">
          <div class="${estaCompleto ? 'ingreso' : 'egreso'}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z"></path>
              <path d="M2 9v1c0 1.1.9 2 2 2h1"></path>
              <path d="M16 11h0"></path>
            </svg>
          </div>
          <div class="texto">
            <h1>${plan.nombrePlan} ${estaCompleto ? '🎉' : ''}</h1>
            <h2>${plan.montoActual.toFixed(2)} / ${plan.montoMeta.toFixed(2)} • ${fechaLimite}</h2>
            <div style="background: #f3f4f6; border-radius: 8px; height: 8px; margin-top: 8px; overflow: hidden;">
              <div style="background: ${estaCompleto ? '#10b981' : '#3b82f6'}; height: 100%; width: ${porcentaje}%; transition: width 0.3s ease;"></div>
            </div>
          </div>
        </div>
        <div class="derecha">
          <div class="estados">
            <p class="${estaCompleto ? 'green' : 'blue'}">${porcentaje.toFixed(1)}%</p>
            <p class="${estaCompleto ? 'green' : 'blue'}">${estaCompleto ? '¡Meta Alcanzada!' : 'En progreso'}</p>
          </div>
          <div class="crud">
            ${!estaCompleto ? `<button class="agregar-monto-btn" data-id="${plan.idPlanAhorro}" style="background: #10b981; border: none; border-radius: 4px; color: white; padding: 4px 8px; cursor: pointer; margin-right: 8px; font-size: 12px;">+ $</button>` : ''}
            <img class="editar" src="../img/editar.png" width="20" height="20" data-id="${plan.idPlanAhorro}" style="cursor: pointer;" />
            <img class="eliminar" src="../img/eliminar.png" width="20" height="20" data-id="${plan.idPlanAhorro}" style="cursor: pointer;" />
          </div>
        </div>
      `;
      
      lista.appendChild(li);
    });

    // Event listeners para botones - CORREGIDO
    document.querySelectorAll('.agregar-monto-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita problemas de bubbling
        const id = e.target.getAttribute('data-id');
        console.log('Abriendo modal de aporte para plan ID:', id); // Debug
        mostrarDialogoAgregarMonto(id);
      });
    });

    document.querySelectorAll('#lista-planes-ahorro .editar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        editarPlan(id);
      });
    });

    document.querySelectorAll('#lista-planes-ahorro .eliminar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        eliminarPlan(id);
      });
    });
  };

  // Mostrar modal para agregar aporte - CORREGIDO
  const mostrarDialogoAgregarMonto = (id) => {
    console.log('Función mostrarDialogoAgregarMonto llamada con ID:', id); // Debug
    
    const plan = window.planesAhorroData?.find(p => p.idPlanAhorro == id);
    if (!plan) {
      console.error('Plan no encontrado con ID:', id);
      console.log('Planes disponibles:', window.planesAhorroData);
      return;
    }

    console.log('Plan encontrado:', plan); // Debug

    // IMPORTANTE: Convertir a número y asignar ANTES de limpiar
    planActualId = parseInt(id);
    console.log('planActualId establecido a:', planActualId); // Debug
    
    // Establecer fecha actual por defecto ANTES de mostrar el modal
    const fechaInput = modalAporte.querySelector('input[name="fechaAporte"]');
    if (fechaInput) {
      const hoy = new Date().toISOString().split('T')[0];
      fechaInput.value = hoy;
    }
    
    // Limpiar solo los otros campos (no la fecha)
    const descripcionInput = modalAporte.querySelector('input[type="text"]');
    const montoInput = modalAporte.querySelector('input[name="montoAporte"]');
    if (descripcionInput) descripcionInput.value = '';
    if (montoInput) montoInput.value = '';
    
    // Actualizar título del modal
    const titulo = modalAporte.querySelector('h1');
    if (titulo) {
      titulo.textContent = `Agregar aporte - ${plan.nombrePlan}`;
    }
    
    console.log('Mostrando modal de aporte con planActualId:', planActualId); // Debug
    modalAporte.style.display = 'flex';
  };

  // Manejar envío del formulario de aporte - CORREGIDO
  if (btnActualizar) {
    btnActualizar.addEventListener('click', async (e) => {
      e.preventDefault();
      console.log('Botón Actualizar clickeado'); // Debug
      
      if (!planActualId) {
        alert('Error: No se ha seleccionado un plan');
        return;
      }

      // Obtener datos del formulario - CORREGIDO LOS SELECTORES
      const descripcionInput = modalAporte.querySelector('input[type="text"]');
      const montoInput = modalAporte.querySelector('input[name="montoAporte"]');
      const fechaInput = modalAporte.querySelector('input[name="fechaAporte"]');

      const descripcion = descripcionInput ? descripcionInput.value.trim() : '';
      const montoAporte = montoInput ? parseFloat(montoInput.value) || 0 : 0;
      const fechaAporte = fechaInput ? fechaInput.value : '';

      console.log('Datos del formulario:', { descripcion, montoAporte, fechaAporte }); // Debug

      // Validaciones
      if (!descripcion) {
        alert('La descripción del aporte es obligatoria');
        return;
      }

      if (montoAporte <= 0) {
        alert('El monto del aporte debe ser mayor a 0');
        return;
      }

      if (!fechaAporte) {
        alert('La fecha del aporte es obligatoria');
        return;
      }

      // Crear el aporte
      await crearAporte({
        descripcion: descripcion,
        montoAporte: montoAporte,
        fechaAporte: fechaAporte,
        // Removido: cumplido: true, - Ahora se maneja automáticamente en el backend
        idPlanAhorro: planActualId
      });
    });
  }

  // Crear aporte y actualizar plan
  const crearAporte = async (aporteData) => {
    console.log('Creando aporte:', aporteData); // Debug
    
    try {
      // 1. Crear el aporte en la tabla detalle
      const responseAporte = await fetch('http://localhost:8080/api/detalle-planes-ahorro/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aporteData)
      });

      if (!responseAporte.ok) {
        const errorText = await responseAporte.text();
        throw new Error(`Error al crear el aporte: ${errorText}`);
      }

      // 2. Obtener el plan actual
      const plan = window.planesAhorroData?.find(p => p.idPlanAhorro == planActualId);
      if (!plan) throw new Error("Plan no encontrado");

      // 3. Calcular nuevo monto total
      const nuevoMontoTotal = parseFloat(plan.montoActual) + parseFloat(aporteData.montoAporte);

      console.log(`Actualizando monto: ${plan.montoActual} + ${aporteData.montoAporte} = ${nuevoMontoTotal}`); // Debug

      // 4. Actualizar el monto actual del plan
      const responsePlan = await fetch(`http://localhost:8080/api/planes-ahorro/actualizar-monto/${planActualId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevoMonto: nuevoMontoTotal })
      });

      if (!responsePlan.ok) {
        const errorText = await responsePlan.text();
        throw new Error(`Error al actualizar el plan: ${errorText}`);
      }

      alert('Aporte agregado correctamente ✅');
      
      // Cerrar modal
      modalAporte.style.display = 'none';
      limpiarFormularioAporte();
      
      // Recargar planes
      cargarPlanesAhorro();

    } catch (error) {
      alert('Error al agregar el aporte ❌: ' + error.message);
      console.error('Error en crearAporte:', error);
    }
  };

  // Editar plan
  const editarPlan = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/planes-ahorro/${id}`);
      if (!response.ok) throw new Error("Plan no encontrado");
      
      const plan = await response.json();
      
      // Llenar formulario
      const inputs = form.querySelectorAll('input');
      inputs[0].value = plan.nombrePlan || '';
      inputs[1].value = plan.montoMeta || '';
      inputs[2].value = plan.montoActual || '';
      inputs[3].value = plan.fechaFin || '';
      
      // Modo edición
      isEditing = true;
      editId = id;
      guardarBtn.textContent = 'Actualizar';
      form.querySelector('h1').textContent = 'Actualizar Plan de Ahorro';
      
      modal.style.display = "flex";
      
    } catch (error) {
      alert("Error al cargar el plan para editar");
      console.error(error);
    }
  };

  // Eliminar plan
  const eliminarPlan = async (id) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este plan de ahorro?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/planes-ahorro/eliminar/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error("Error al eliminar");
      
      alert("Plan de ahorro eliminado correctamente ✅");
      cargarPlanesAhorro();
      
    } catch (error) {
      alert("Error al eliminar el plan de ahorro ❌");
      console.error(error);
    }
  };

  // Guardar/Actualizar plan principal
  if (guardarBtn) {
    guardarBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const idUsuario = getIdUsuario();
      if (!idUsuario) {
        alert("Debes iniciar sesión primero");
        window.location.href = "login.html";
        return;
      }

      // Obtener datos del formulario
      const inputs = form.querySelectorAll('input');
      const planData = {
        nombrePlan: inputs[0].value.trim(),
        montoMeta: parseFloat(inputs[1].value) || 0,
        montoActual: parseFloat(inputs[2].value) || 0,
        fechaFin: inputs[3].value || null,
        idUsuario: idUsuario
      };

      // Validaciones
      if (!planData.nombrePlan) {
        alert("El nombre del plan es obligatorio");
        return;
      }

      if (planData.montoMeta <= 0) {
        alert("La meta de ahorro debe ser mayor a 0");
        return;
      }

      if (planData.montoActual < 0) {
        alert("La cantidad actual no puede ser negativa");
        return;
      }

      try {
        let response;
        
        if (isEditing && editId) {
          response = await fetch(`http://localhost:8080/api/planes-ahorro/actualizar/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(planData)
          });
        } else {
          response = await fetch('http://localhost:8080/api/planes-ahorro/crear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(planData)
          });
        }

        if (response.ok) {
          alert(isEditing ? 'Plan de ahorro actualizado ✅' : 'Plan de ahorro creado ✅');
          cerrarModal();
          cargarPlanesAhorro();
        } else {
          const errorText = await response.text();
          throw new Error(errorText);
        }

      } catch (error) {
        console.error("Error:", error);
        alert((isEditing ? 'Error al actualizar plan ❌: ' : 'Error al crear plan ❌: ') + error.message);
      }
    });
  }

  cargarPlanesAhorro();
});