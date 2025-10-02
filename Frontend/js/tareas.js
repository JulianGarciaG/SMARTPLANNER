// document.addEventListener("DOMContentLoaded", () => {
  
//   // =====================================================
//   // VERIFICAR SI VIENE DE UNA TRANSACCIÓN
//   // =====================================================
//   const transaccionData = localStorage.getItem("transaccionParaTarea");
  
//   if (transaccionData) {
//     try {
//       const transaccion = JSON.parse(transaccionData);
//       console.log("Transacción detectada:", transaccion);
      
//       // 1. Abrir el formulario automáticamente
//       const modal = document.getElementById("agregarRegistro");
//       if (modal) {
//         modal.style.display = "flex";
//         console.log("Modal abierto");
//       }
      
//       // 2. Marcar el checkbox de "Asociar con un gasto"
//       const checkboxAsociar = document.getElementById("abrirAsociarGasto");
//       if (checkboxAsociar && !checkboxAsociar.checked) {
//         checkboxAsociar.checked = true;
//         // Disparar el evento change para que input-check.js lo procese
//         checkboxAsociar.dispatchEvent(new Event('change', { bubbles: true }));
//         console.log("Checkbox marcado");
//       }
      
//       // 3. Esperar un momento para que el select se muestre
//       setTimeout(() => {
//         const selectAsociarGasto = document.querySelector("#asociarGasto select");
        
//         if (selectAsociarGasto) {
//           const formatearMoneda = (valor) => {
//             return new Intl.NumberFormat("es-CO", {
//               style: "currency",
//               currency: "COP",
//               minimumFractionDigits: 2,
//               maximumFractionDigits: 2
//             }).format(valor);
//           };

//           // Limpiar opciones existentes excepto la primera
//           const primeraOpcion = selectAsociarGasto.querySelector('option[value=""]');
//           selectAsociarGasto.innerHTML = '';
//           if (primeraOpcion) {
//             selectAsociarGasto.appendChild(primeraOpcion.cloneNode(true));
//           }

//           // Agregar la transacción seleccionada
//           const option = document.createElement("option");
//           option.value = transaccion.id;
//           option.textContent = `${transaccion.descripcion} - ${formatearMoneda(transaccion.monto)}`;
//           option.selected = true;
//           selectAsociarGasto.appendChild(option);
//           console.log("Transacción agregada al select");
//         }
        
//         // 4. Crear el banner informativo
//         const form = document.getElementById("containerRegistro");
//         if (form) {
//           let bannerExistente = form.querySelector(".info-transaccion-banner");
          
//           if (!bannerExistente) {
//             const formatearMoneda = (valor) => {
//               return new Intl.NumberFormat("es-CO", {
//                 style: "currency",
//                 currency: "COP",
//                 minimumFractionDigits: 2,
//                 maximumFractionDigits: 2
//               }).format(valor);
//             };

//             const banner = document.createElement("div");
//             banner.className = "info-transaccion-banner";
//             banner.style.cssText = `
//               background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//               color: white;
//               padding: 16px;
//               border-radius: 12px;
//               margin-bottom: 20px;
//               box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
//               animation: slideDown 0.3s ease-out;
//             `;
            
//             banner.innerHTML = `
//               <style>
//                 @keyframes slideDown {
//                   from {
//                     opacity: 0;
//                     transform: translateY(-10px);
//                   }
//                   to {
//                     opacity: 1;
//                     transform: translateY(0);
//                   }
//                 }
//               </style>
//               <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px;">
//                 <div style="flex: 1;">
//                   <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
//                     <span style="font-size: 20px;">💰</span>
//                     <h3 style="margin: 0; font-size: 13px; opacity: 0.9; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
//                       Asociada a Transacción
//                     </h3>
//                   </div>
//                   <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; line-height: 1.4;">
//                     ${transaccion.descripcion}
//                   </p>
//                   <p style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">
//                     ${formatearMoneda(transaccion.monto)}
//                   </p>
//                 </div>
//                 <button 
//                   type="button" 
//                   id="cerrarBannerTransaccion"
//                   style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); 
//                          color: white; padding: 10px 18px; border-radius: 8px; cursor: pointer; 
//                          font-size: 13px; transition: all 0.2s; font-weight: 600; white-space: nowrap;
//                          flex-shrink: 0;"
//                   onmouseover="this.style.background='rgba(255,255,255,0.25)'; this.style.transform='translateY(-1px)'"
//                   onmouseout="this.style.background='rgba(255,255,255,0.15)'; this.style.transform='translateY(0)'">
//                   ✕ Desasociar
//                 </button>
//               </div>
//             `;
            
//             // Insertar el banner después del título "Nueva Tarea"
//             const h1 = form.querySelector("h1");
//             if (h1) {
//               h1.insertAdjacentElement('afterend', banner);
//               console.log("Banner insertado");
//             }
            
//             // Evento para desasociar
//             const btnCerrarBanner = banner.querySelector("#cerrarBannerTransaccion");
//             if (btnCerrarBanner) {
//               btnCerrarBanner.addEventListener("click", () => {
//                 banner.remove();
//                 localStorage.removeItem("transaccionParaTarea");
                
//                 // Desmarcar checkbox
//                 if (checkboxAsociar) {
//                   checkboxAsociar.checked = false;
//                   checkboxAsociar.dispatchEvent(new Event('change', { bubbles: true }));
//                 }
                
//                 // Limpiar el select
//                 const selectAsociarGasto = document.querySelector("#asociarGasto select");
//                 if (selectAsociarGasto) {
//                   selectAsociarGasto.innerHTML = '<option value="" selected>Seleccionar gasto...</option>';
//                 }
                
//                 console.log("Transacción desasociada");
//               });
//             }
//           }
//         }
//       }, 100); // Pequeño delay para asegurar que el DOM esté listo
      
//     } catch (error) {
//       console.error("Error al procesar transacción:", error);
//       localStorage.removeItem("transaccionParaTarea");
//     }
//   }
  
//   // =====================================================
//   // CÓDIGO ORIGINAL DEL CRUD
//   // =====================================================
  
//   const crearBtn = document.getElementById("Crear-registro");
//   const listaTareas = document.getElementById("lista-tareas");
//   let isEditing = false;
//   let editId = null;

//   const getIdUsuario = () => {
//     const usuarioJSON = localStorage.getItem("usuario");
//     if (!usuarioJSON) return null;
//     try {
//       const usuario = JSON.parse(usuarioJSON);
//       return usuario.idUsuario || null;
//     } catch (e) {
//       console.error("Error parseando usuario:", e);
//       return null;
//     }
//   };

//   const formatearFecha = (iso) => {
//     if (!iso) return "";
//     try {
//       const d = new Date(iso);
//       return d.toLocaleString();
//     } catch (_) {
//       return iso;
//     }
//   };

//   const renderTareas = (tareas = []) => {
//     if (!listaTareas) return;
//     listaTareas.innerHTML = "";
//     if (!tareas.length) {
//       const li = document.createElement("li");
//       li.textContent = "No hay tareas registradas";
//       listaTareas.appendChild(li);
//       return;
//     }

//     tareas.forEach((t) => {
//       const li = document.createElement("li");
//       li.classList.add("tarea");
      
//       const prioridad = (t.prioridad || "").toString().toLowerCase();
//       const fecha = formatearFecha(t.fecha_limite);
//       const completada = t.estado_de_tarea === true;
      
//       if (completada) {
//         li.classList.add("completada");
//       }
      
//       li.innerHTML = `
//         <div class="tarea-item">
//           <div class="tarea-left">
//             <input type="checkbox" class="tarea-check" data-id="${t.id_tarea}" ${completada ? "checked" : ""} />
//             <div class="tarea-content">
//               <h3>${t.nombre ?? "(Sin título)"}</h3>
//               <p>${t.descripcion ?? ""}</p>
//               <div class="tarea-meta">
//                 <img src="../img/calendario.png" width="15" height="15" />
//                 <span>${fecha}</span>
//               </div>
//             </div>
//           </div>
//           <div class="tarea-actions">
//             <span class="badge ${prioridad}">${prioridad}</span>
//             <img class="editar" data-id="${t.id_tarea}" src="../img/editar.png" width="20" height="20" />
//             <img class="eliminar" data-id="${t.id_tarea}" src="../img/eliminar.png" width="20" height="20" />
//           </div>
//         </div>
//       `;
//       listaTareas.appendChild(li);
//     });
//   };

//   const cargarTareas = async () => {
//     const idUsuario = getIdUsuario();
//     if (!idUsuario) {
//       renderTareas([]);
//       return;
//     }
//     try {
//       const resp = await fetch(`http://localhost:8080/api/tareas/${idUsuario}`);
//       if (!resp.ok) throw new Error(await resp.text());
//       const data = await resp.json();
//       const arr = Array.isArray(data) ? data : [];
//       window.tareasData = arr;
//       window.dispatchEvent(new CustomEvent('tareas:loaded', { detail: arr }));
//       renderTareas(arr);
//       const total = document.getElementById("totalTareas");
//       if (total) total.textContent = String(data.length || 0);
//     } catch (err) {
//       console.error("Error cargando tareas:", err);
//       renderTareas([]);
//     }
//   };

//   cargarTareas();
//   window.refreshTareas = cargarTareas;

//   if (listaTareas) {
//     listaTareas.addEventListener("click", async (e) => {
//       const target = e.target;
      
//       if (target.classList.contains("tarea-check")) {
//         const li = target.closest('li');
        
//         if (target.checked) {
//           li.classList.add('completada');
//         } else {
//           li.classList.remove('completada');
//         }

//         const id = target.getAttribute('data-id');
//         const idUsuario = getIdUsuario();
//         if (id) {
//           const tarea = (window.tareasData || []).find(t => String(t.id_tarea) === String(id));
//           const payload = {
//             nombre: tarea?.nombre || '',
//             descripcion: tarea?.descripcion || '',
//             prioridad: (tarea?.prioridad || '').toString().toLowerCase() || 'media',
//             fecha_limite: tarea?.fecha_limite || new Date().toISOString(),
//             categoria: (tarea?.categoria || 'sin_asociar').toString().toLowerCase(),
//             estado_de_tarea: !!target.checked,
//             id_usuario: idUsuario
//           };

//           fetch(`http://localhost:8080/api/tareas/actualizar/${id}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(payload)
//           })
//             .then(() => window.refreshTareas && window.refreshTareas())
//             .then(() => {
//               window.dispatchEvent(new CustomEvent("tareas:updated", { detail: window.tareasData }));
//             })
//             .catch(err => console.error('No se pudo actualizar estado de tarea', err));
//         }
//         return;
//       }
      
//       if (target.classList.contains("eliminar")) {
//         const id = target.getAttribute("data-id");
//         if (!id) return;
//         if (!confirm("¿Deseas eliminar esta tarea?")) return;
//         try {
//           const resp = await fetch(`http://localhost:8080/api/tareas/eliminar/${id}`, { method: "DELETE" });
//           if (!resp.ok) throw new Error(await resp.text());
//           await cargarTareas();
//         } catch (err) {
//           alert("No se pudo eliminar la tarea");
//           console.error(err);
//         }
//       }

//       if (target.classList.contains("editar")) {
//         const id = target.getAttribute("data-id");
//         if (!id) return;

//         const modal = document.getElementById("agregarRegistro");
//         const form = document.getElementById("containerRegistro");
//         if (!modal || !form) return;

//         const card = target.closest("li");
//         const tituloInput = document.querySelector('.titulo input');
//         const descripcionInput = document.querySelector('.descripcion input');
//         const prioridadSelect = document.querySelector('.prioridad select');
//         const fechaInput = document.querySelector('.fecha-limite input');

//         const titulo = card.querySelector('.tarea-content h3')?.textContent || '';
//         const descripcion = card.querySelector('.tarea-content p')?.textContent || '';
//         const badge = card.querySelector('.badge')?.textContent || '';
//         const fechaTexto = card.querySelector('.tarea-meta span')?.textContent || '';

//         tituloInput.value = titulo;
//         descripcionInput.value = descripcion;
//         prioridadSelect.value = badge || 'media';
//         const date = new Date(fechaTexto);
//         if (!isNaN(date.getTime())) {
//           const isoLocal = new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,16);
//           fechaInput.value = isoLocal;
//         }

//         modal.style.display = 'flex';
//         isEditing = true;
//         editId = id;
//         if (crearBtn) crearBtn.textContent = 'Guardar cambios';
//         const tituloModal = modal.querySelector('form h1');
//         if (tituloModal) tituloModal.textContent = 'Actualizar tarea';
//       }
//     });
//   }

//   if (crearBtn) {
//     crearBtn.addEventListener("click", async (e) => {
//       e.preventDefault();

//       const idUsuario = getIdUsuario();
//       if (!idUsuario) {
//         alert("Debes iniciar sesión primero");
//         window.location.href = "../index.html";
//         return;
//       }

//       const tarea = {
//         nombre: document.querySelector(".titulo input").value,
//         descripcion: document.querySelector(".descripcion input").value,
//         prioridad: document.querySelector(".prioridad select").value,
//         fecha_limite: document.querySelector(".fecha-limite input").value,
//         categoria: document.getElementById("abrirAsociarGasto").checked ? "asociada" : "sin_asociar",
//         estado_de_tarea: false,
//         id_usuario: idUsuario,
//         id_transaccion: document.getElementById("abrirAsociarGasto").checked 
//           ? (document.querySelector("#asociarGasto select").value || null)
//           : null
//       };

//       try {
//         let response;
//         if (isEditing && editId) {
//           response = await fetch(`http://localhost:8080/api/tareas/actualizar/${editId}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(tarea)
//           });
//         } else {
//           response = await fetch("http://localhost:8080/api/tareas/crear", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(tarea),
//           });
//         }

//         if (response.ok) {
//           alert(isEditing ? 'Tarea actualizada ✅' : 'Tarea creada con éxito ✅');
          
//           // Limpiar localStorage después de crear exitosamente
//           localStorage.removeItem("transaccionParaTarea");
          
//           await cargarTareas();
//           const modal = document.getElementById('agregarRegistro');
//           if (modal) modal.style.display = 'none';
//           isEditing = false;
//           editId = null;
//           crearBtn.textContent = 'Crear';
          
//           // Limpiar formulario
//           document.querySelector('.titulo input').value = '';
//           document.querySelector('.descripcion input').value = '';
//           document.querySelector('.prioridad select').value = 'media';
//           document.querySelector('.fecha-limite input').value = '';
          
//         } else {
//           const errorText = await response.text();
//           throw new Error(errorText);
//         }
//       } catch (error) {
//         console.error("Error:", error);
//         alert((isEditing ? 'Error al actualizar tarea ❌: ' : 'Error al crear tarea ❌: ') + error.message);
//       }
//     });
//   }
  
//   // Limpiar localStorage al cerrar el modal sin crear
//   const btnCerrar = document.getElementById("cerrarMenuRegistros");
//   const btnCancelar = document.getElementById("Cancelar-registro");
  
//   [btnCerrar, btnCancelar].forEach(btn => {
//     if (btn) {
//       btn.addEventListener("click", () => {
//         localStorage.removeItem("transaccionParaTarea");
//         const banner = document.querySelector(".info-transaccion-banner");
//         if (banner) banner.remove();
//       });
//     }
//   });
// });