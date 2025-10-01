/**
 * SMART PLANNER - Sistema de Búsqueda Global
 * Búsqueda case-insensitive unificada para todas las vistas
 */

const BuscadorGlobal = {
    // Inicializa el buscador según la página actual
    init() {
        const inputHeader = document.querySelector('.buscador-nav input');
        
        // Detectar página actual
        const pagina = this.detectarPagina();
        
        // Solo configurar buscador del header (no interferir con buscadores locales)
        if (inputHeader) {
            inputHeader.addEventListener('input', (e) => {
                const termino = e.target.value;
                this.buscar(termino, pagina);
            });
        }
    },

    // Detecta en qué página estamos
    detectarPagina() {
        const url = window.location.pathname;
        
        if (url.includes('tareas.html')) return 'tareas';
        if (url.includes('calendario.html')) return 'calendario';
        if (url.includes('finanzas.html')) return 'finanzas';
        if (url.includes('home.html')) return 'dashboard';
        if (url.includes('estadisticas.html')) return 'estadisticas';
        
        return 'desconocida';
    },

    // Función principal de búsqueda
    buscar(termino, pagina) {
        // Normalizar término de búsqueda (ignorar mayúsculas)
        const terminoNormalizado = termino.toLowerCase().trim();
        
        // Ejecutar búsqueda según la página
        switch(pagina) {
            case 'tareas':
                this.buscarEnTareas(terminoNormalizado);
                break;
            case 'calendario':
                this.buscarEnCalendario(terminoNormalizado);
                break;
            case 'finanzas':
                this.buscarEnFinanzas(terminoNormalizado);
                break;
            case 'dashboard':
                this.buscarEnDashboard(terminoNormalizado);
                break;
            case 'estadisticas':
                this.buscarEnEstadisticas(terminoNormalizado);
                break;
            default:
                console.log('Página no configurada para búsqueda');
        }
    },

    // ========================================
    // BÚSQUEDA EN TAREAS
    // ========================================
    buscarEnTareas(termino) {
        const listaTareas = document.getElementById('lista-tareas');
        if (!listaTareas) return;
        
        const tareas = listaTareas.querySelectorAll('li');
        let resultadosEncontrados = 0;
        
        tareas.forEach(tarea => {
            // Ignorar mensajes del sistema
            if (tarea.classList.contains('mensaje-busqueda')) return;
            
            // Obtener todo el texto de la tarea
            const textoCompleto = tarea.textContent.toLowerCase();
            
            // Buscar en todo el contenido
            const coincide = textoCompleto.includes(termino);
            
            // Mostrar/ocultar según coincidencia
            if (termino === '' || coincide) {
                tarea.style.display = '';
                resultadosEncontrados++;
            } else {
                tarea.style.display = 'none';
            }
        });
        
        // Mostrar mensaje si no hay resultados
        this.mostrarMensajeResultados(listaTareas, resultadosEncontrados, termino);
    },

    // ========================================
    // BÚSQUEDA EN CALENDARIO
    // ========================================
    buscarEnCalendario(termino) {
        // Buscar en eventos de hoy
        const listaEventosHoy = document.getElementById('listaEventosHoy');
        if (listaEventosHoy) {
            const eventos = listaEventosHoy.querySelectorAll('li');
            let resultadosEncontrados = 0;
            
            eventos.forEach(evento => {
                if (evento.classList.contains('mensaje-busqueda')) return;
                
                const textoCompleto = evento.textContent.toLowerCase();
                const coincide = textoCompleto.includes(termino);
                
                if (termino === '' || coincide) {
                    evento.style.display = '';
                    resultadosEncontrados++;
                } else {
                    evento.style.display = 'none';
                }
            });
            
            this.mostrarMensajeResultados(listaEventosHoy, resultadosEncontrados, termino);
        }
        
        // Buscar en lista de calendarios
        const listaCalendarios = document.getElementById('listaCalendarios');
        if (listaCalendarios) {
            const calendarios = listaCalendarios.querySelectorAll('.elep-calendario');
            
            calendarios.forEach(calendario => {
                const textoCompleto = calendario.textContent.toLowerCase();
                const coincide = textoCompleto.includes(termino);
                
                if (termino === '' || coincide) {
                    calendario.style.display = '';
                } else {
                    calendario.style.display = 'none';
                }
            });
        }
        
        // Buscar en el calendario de FullCalendar (si está inicializado)
        if (window.calendar) {
            const eventos = window.calendar.getEvents();
            
            eventos.forEach(evento => {
                const titulo = evento.title.toLowerCase();
                const descripcion = evento.extendedProps?.description?.toLowerCase() || '';
                
                const coincide = titulo.includes(termino) || descripcion.includes(termino);
                
                // Cambiar opacidad del evento según coincidencia
                if (termino === '') {
                    evento.setProp('display', '');
                } else if (coincide) {
                    evento.setProp('display', '');
                } else {
                    evento.setProp('display', 'none');
                }
            });
        }
    },

    // ========================================
    // BÚSQUEDA EN FINANZAS
    // ========================================
    buscarEnFinanzas(termino) {
        // Buscar en transacciones usando la estructura real del HTML
        const listaTransacciones = document.getElementById('lista-transacciones');
        if (listaTransacciones) {
            const transacciones = listaTransacciones.querySelectorAll('li');
            let resultadosEncontrados = 0;
            
            transacciones.forEach(transaccion => {
                if (transaccion.classList.contains('mensaje-busqueda')) return;
                
                // Obtener todo el texto visible de la transacción
                const textoCompleto = transaccion.textContent.toLowerCase();
                
                // Buscar en todo el contenido
                const coincide = textoCompleto.includes(termino);
                
                if (termino === '' || coincide) {
                    transaccion.style.display = '';
                    resultadosEncontrados++;
                } else {
                    transaccion.style.display = 'none';
                }
            });
            
            this.mostrarMensajeResultados(listaTransacciones, resultadosEncontrados, termino);
        }
        
        // Buscar en planes de ahorro
        const listaPlanesAhorro = document.getElementById('lista-planes-ahorro');
        if (listaPlanesAhorro) {
            const planes = listaPlanesAhorro.querySelectorAll('li');
            
            planes.forEach(plan => {
                if (plan.classList.contains('mensaje-busqueda')) return;
                
                const textoCompleto = plan.textContent.toLowerCase();
                const coincide = textoCompleto.includes(termino);
                
                if (termino === '' || coincide) {
                    plan.style.display = '';
                } else {
                    plan.style.display = 'none';
                }
            });
        }
        
        // Buscar en resumen de categorías
        const contenedorResumen = document.getElementById('contenedor-resumen');
        if (contenedorResumen) {
            const categorias = contenedorResumen.querySelectorAll('.categoria');
            
            categorias.forEach(cat => {
                const textoCompleto = cat.textContent.toLowerCase();
                const coincide = textoCompleto.includes(termino);
                
                if (termino === '' || coincide) {
                    cat.style.display = '';
                } else {
                    cat.style.display = 'none';
                }
            });
        }
    },

    // ========================================
    // BÚSQUEDA EN DASHBOARD
    // ========================================
    buscarEnDashboard(termino) {
        // Buscar en calendarios
        const listaCalendarios = document.getElementById('listaCalendarios');
        if (listaCalendarios) {
            const items = listaCalendarios.querySelectorAll('li');
            
            items.forEach(item => {
                if (item.classList.contains('mensaje-busqueda')) return;
                
                const texto = item.textContent.toLowerCase();
                const coincide = texto.includes(termino);
                
                if (termino === '' || coincide) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        }
        
        // Buscar en eventos
        const listaEventos = document.getElementById('listaEventos');
        if (listaEventos) {
            const items = listaEventos.querySelectorAll('li');
            
            items.forEach(item => {
                if (item.classList.contains('mensaje-busqueda')) return;
                
                const texto = item.textContent.toLowerCase();
                const coincide = texto.includes(termino);
                
                if (termino === '' || coincide) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        }
        
        // Buscar en tareas
        const listaTareas = document.getElementById('listaTareas');
        if (listaTareas) {
            const items = listaTareas.querySelectorAll('li');
            
            items.forEach(item => {
                if (item.classList.contains('mensaje-busqueda')) return;
                
                const texto = item.textContent.toLowerCase();
                const coincide = texto.includes(termino);
                
                if (termino === '' || coincide) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        }
    },

    // ========================================
    // BÚSQUEDA EN ESTADÍSTICAS
    // ========================================
    buscarEnEstadisticas(termino) {
        // Buscar en rendimiento por prioridad
        const rendimientoPrioridad = document.getElementById('rendimiento-prioridad-container');
        if (rendimientoPrioridad) {
            const items = rendimientoPrioridad.querySelectorAll('.categoria-item, .categorias-grid > div, div[class*="categoria"]');
            
            items.forEach(item => {
                const texto = item.textContent.toLowerCase();
                const coincide = texto.includes(termino);
                
                if (termino === '' || coincide) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        }
        
        // Buscar en distribución de gastos
        const distribucionGastos = document.getElementById('distribucion-gastos-lista');
        if (distribucionGastos) {
            const items = distribucionGastos.querySelectorAll('li');
            
            items.forEach(item => {
                if (item.classList.contains('mensaje-busqueda')) return;
                
                const texto = item.textContent.toLowerCase();
                const coincide = texto.includes(termino);
                
                if (termino === '' || coincide) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        }
    },

    // ========================================
    // UTILIDADES
    // ========================================
    mostrarMensajeResultados(contenedor, cantidad, termino) {
        // Eliminar mensaje previo si existe
        const mensajePrevio = contenedor.querySelector('.mensaje-busqueda');
        if (mensajePrevio) {
            mensajePrevio.remove();
        }
        
        // Mostrar mensaje solo si hay búsqueda activa y sin resultados
        if (termino !== '' && cantidad === 0) {
            const mensaje = document.createElement('li');
            mensaje.className = 'mensaje-busqueda';
            mensaje.style.cssText = 'text-align: center; padding: 20px; color: #64748b; list-style: none;';
            mensaje.textContent = `No se encontraron resultados para "${termino}"`;
            contenedor.appendChild(mensaje);
        }
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    BuscadorGlobal.init();
});

// Exportar para uso en otros scripts si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BuscadorGlobal;
}