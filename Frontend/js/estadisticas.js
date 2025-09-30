// estadisticas.js - Dashboard de estadísticas integrado con el sistema
// Versión final con endpoints correctos

document.addEventListener("DOMContentLoaded", async () => {
    console.log("[Estadísticas] Inicializando dashboard...");

    // ============================================
    // OBTENER ID DE USUARIO
    // ============================================
    const getIdUsuario = () => {
        const usuarioJSON = localStorage.getItem("usuario");
        if (!usuarioJSON) return null;
        try {
            const usuario = JSON.parse(usuarioJSON);
            return usuario.idUsuario ?? usuario.id ?? usuario.id_usuario ?? null;
        } catch {
            return null;
        }
    };

    const idUsuario = getIdUsuario();
    if (!idUsuario) {
        console.error("[Estadísticas] Usuario no logueado");
        return;
    }

    // ============================================
    // VARIABLES GLOBALES
    // ============================================
    let tareas = [];
    let transacciones = [];
    let calendarios = { totales: 0, personales: 0, compartidos: 0 };
    let planesAhorro = { completados: 0, totales: 0 };

    // ============================================
    // FUNCIONES DE CARGA DESDE API
    // ============================================

    async function cargarTareas() {
        try {
            const response = await fetch(`http://localhost:8080/api/tareas/usuario/${idUsuario}`);
            if (!response.ok) throw new Error("Error al cargar tareas");
            const data = await response.json();
            tareas = Array.isArray(data) ? data : [];
            console.log(`[Estadísticas] ${tareas.length} tareas cargadas`);
            return tareas;
        } catch (error) {
            console.error("[Estadísticas] Error cargando tareas:", error);
            return [];
        }
    }

    async function cargarTransacciones() {
        try {
            const response = await fetch(`http://localhost:8080/api/transacciones/usuario/${idUsuario}`);
            if (!response.ok) throw new Error("Error al cargar transacciones");
            const data = await response.json();
            transacciones = Array.isArray(data) ? data : [];
            console.log(`[Estadísticas] ${transacciones.length} transacciones cargadas`);
            return transacciones;
        } catch (error) {
            console.error("[Estadísticas] Error cargando transacciones:", error);
            return [];
        }
    }

    async function cargarCalendarios() {
        try {
            // Usar el endpoint de calendarios-compartidos que ya tienes
            const response = await fetch(`http://localhost:8080/api/calendarios-compartidos/usuario/${idUsuario}`);
            if (!response.ok) throw new Error("Error al cargar calendarios");
            const data = await response.json();
            
            if (Array.isArray(data)) {
                // Contar según el permiso o tipo
                const personales = data.filter(c => 
                    c.permiso === 'no_compartido' || 
                    (c.tipo_de_calendario && c.tipo_de_calendario.toLowerCase() === 'personal')
                ).length;
                
                const compartidos = data.filter(c => 
                    c.permiso === 'ver' || 
                    c.permiso === 'editar' ||
                    (c.tipo_de_calendario && c.tipo_de_calendario.toLowerCase() === 'compartido')
                ).length;
                
                calendarios = {
                    totales: data.length,
                    personales: personales,
                    compartidos: compartidos
                };
            } else {
                calendarios = { totales: 0, personales: 0, compartidos: 0 };
            }
            
            console.log(`[Estadísticas] Calendarios cargados:`, calendarios);
            return calendarios;
        } catch (error) {
            console.error("[Estadísticas] Error cargando calendarios:", error);
            calendarios = { totales: 0, personales: 0, compartidos: 0 };
            return calendarios;
        }
    }

    async function cargarPlanesAhorro() {
        try {
            const response = await fetch(`http://localhost:8080/api/planes-ahorro/usuario/${idUsuario}`);
            if (!response.ok) throw new Error("Error al cargar planes de ahorro");
            const data = await response.json();
            
            if (Array.isArray(data)) {
                // Contar planes completados (los que alcanzaron o superaron la meta)
                const completados = data.filter(plan => {
                    const porcentaje = plan.montoMeta > 0 ? (plan.montoActual / plan.montoMeta) * 100 : 0;
                    return plan.cumplido === true || porcentaje >= 100;
                }).length;
                
                planesAhorro = {
                    completados: completados,
                    totales: data.length
                };
            } else {
                planesAhorro = { completados: 0, totales: 0 };
            }
            
            console.log(`[Estadísticas] Planes de ahorro cargados:`, planesAhorro);
            return planesAhorro;
        } catch (error) {
            console.error("[Estadísticas] Error cargando planes de ahorro:", error);
            planesAhorro = { completados: 0, totales: 0 };
            return planesAhorro;
        }
    }

    // ============================================
    // FUNCIONES DE PROCESAMIENTO DE FINANZAS
    // ============================================

    function procesarFinanzas(transacciones) {
        const hoy = new Date();
        const mesActual = hoy.getMonth();
        const anioActual = hoy.getFullYear();

        let totalIngresos = 0;
        let totalGastos = 0;
        const categorias = {};

        transacciones.forEach((tx) => {
            if (!tx.fecha) return;
            const fechaTx = new Date(tx.fecha);
            
            // Solo transacciones del mes actual
            if (fechaTx.getMonth() === mesActual && fechaTx.getFullYear() === anioActual) {
                const monto = Number(tx.monto) || 0;
                
                if (String(tx.tipo).toLowerCase() === "ingreso") {
                    totalIngresos += monto;
                } else if (String(tx.tipo).toLowerCase() === "egreso") {
                    totalGastos += monto;
                    
                    // Agrupar gastos por categoría
                    const cat = tx.categoria || 'Otros';
                    categorias[cat] = (categorias[cat] || 0) + monto;
                }
            }
        });

        // Convertir categorías a array
        const gastosPorCategoria = Object.keys(categorias)
            .map(cat => ({
                categoria: cat,
                monto: categorias[cat]
            }))
            .sort((a, b) => b.monto - a.monto);

        return {
            ingresos: totalIngresos,
            gastos: totalGastos,
            balance: totalIngresos - totalGastos,
            gastosPorCategoria: gastosPorCategoria
        };
    }

    // ============================================
    // FUNCIONES DE CÁLCULO
    // ============================================

    function calcularProductividad() {
        const hoy = new Date();
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - 7);
        
        const tareasSemana = tareas.filter(t => {
            const fechaTarea = new Date(t.fecha_limite || t.fechaLimite);
            return fechaTarea >= inicioSemana;
        });
        
        const completadas = tareasSemana.filter(t => t.estado_de_tarea === true || t.completada).length;
        
        return tareasSemana.length > 0 ? Math.round((completadas / tareasSemana.length) * 100) : 0;
    }

    function tareasCompletadas() {
        return tareas.filter(t => t.estado_de_tarea === true || t.completada).length;
    }

    function obtenerProgresoSemanal() {
        const dias = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
        const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        const hoy = new Date();
        const progresoSemanal = [];

        for (let i = 6; i >= 0; i--) {
            const fecha = new Date(hoy);
            fecha.setDate(hoy.getDate() - i);
            const fechaStr = fecha.toISOString().split('T')[0];
            
            const tareasDelDia = tareas.filter(t => {
                const completada = t.estado_de_tarea === true || t.completada;
                const fechaTarea = (t.fecha_limite || t.fechaLimite || '').toString().substring(0, 10);
                return fechaTarea === fechaStr && completada;
            });
            
            const tareasTotalesDelDia = tareas.filter(t => {
                const fechaTarea = (t.fecha_limite || t.fechaLimite || '').toString().substring(0, 10);
                return fechaTarea === fechaStr;
            });
            
            const diaSemana = dias[fecha.getDay()];
            const diaNumero = fecha.getDate();
            
            progresoSemanal.push({
                dia: diaSemana,
                numero: diaNumero,
                completadas: tareasDelDia.length,
                totales: tareasTotalesDelDia.length,
                mes: meses[fecha.getMonth()]
            });
        }

        return progresoSemanal;
    }

    function calcularPorPrioridad() {
        const prioridades = ['alta', 'media', 'baja'];
        return prioridades.map(p => ({
            prioridad: p,
            completadas: tareas.filter(t => {
                const prioridadMatch = (t.prioridad || '').toLowerCase() === p;
                const completada = t.estado_de_tarea === true || t.completada;
                return prioridadMatch && completada;
            }).length,
            totales: tareas.filter(t => {
                return (t.prioridad || '').toLowerCase() === p;
            }).length
        }));
    }

    // ============================================
    // FUNCIONES DE RENDERIZADO
    // ============================================

    function actualizarTarjetasPrincipales(finanzas) {
        const productividad = calcularProductividad();
        const completadas = tareasCompletadas();
        const totales = tareas.length;
        
        document.getElementById('productividad-valor').textContent = `${productividad}%`;
        document.getElementById('planes-ahorro-valor').textContent = `${planesAhorro.completados} / ${planesAhorro.totales}`;
        document.getElementById('balance-valor').textContent = `$ ${finanzas.balance.toFixed(2)}`;
        document.getElementById('tareas-completadas-valor').textContent = `${completadas} / ${totales}`;
    }

    function renderizarProgresoSemanal() {
        const container = document.getElementById('progreso-semanal-container');
        const progresoSemanal = obtenerProgresoSemanal();
        
        container.innerHTML = '';
        
        progresoSemanal.forEach(dia => {
            const divDia = document.createElement('div');
            divDia.className = 'apartado-dias';
            
            const classNumero = dia.completadas >= 8 ? 'numero-tareasEspecial' : 'numero-tareas';
            
            divDia.innerHTML = `
                <div class="${classNumero}">
                    <h3>${dia.completadas}</h3>
                </div>
                <div class="progreso">
                    <h2>${dia.dia}</h2>
                    <p>${dia.mes} ${dia.numero}</p>
                </div>
            `;
            
            container.appendChild(divDia);
        });
    }

    function actualizarProgresoTareas() {
        const completadas = tareasCompletadas();
        const pendientes = tareas.length - completadas;
        const porcentaje = tareas.length > 0 ? Math.round((completadas / tareas.length) * 100) : 0;
        
        document.getElementById('tareas-completadas-numero').textContent = completadas;
        document.getElementById('tareas-pendientes-numero').textContent = pendientes;
        document.getElementById('progreso-general-porcentaje').textContent = `${porcentaje}%`;
        document.getElementById('progreso-general-bar').value = porcentaje / 100;
    }

    function actualizarResumenFinanciero(finanzas) {
        document.getElementById('rf-ingresos').textContent = `$${finanzas.ingresos.toFixed(2)}`;
        document.getElementById('rf-gastos').textContent = `$${finanzas.gastos.toFixed(2)}`;
        document.getElementById('rf-balance').textContent = `$${finanzas.balance.toFixed(2)}`;
    }

    function actualizarSeguimientoCalendarios() {
        const maxCalendarios = 10;
        
        document.getElementById('calendarios-totales-dias').textContent = `${calendarios.totales} calendarios`;
        document.getElementById('calendarios-totales-progreso').textContent = `${calendarios.totales}/${maxCalendarios}`;
        document.getElementById('calendarios-totales-bar').value = Math.min(calendarios.totales / maxCalendarios, 1);
        
        document.getElementById('calendarios-personales-dias').textContent = `${calendarios.personales} calendarios`;
        document.getElementById('calendarios-personales-progreso').textContent = `${calendarios.personales}/${maxCalendarios}`;
        document.getElementById('calendarios-personales-bar').value = Math.min(calendarios.personales / maxCalendarios, 1);
        
        document.getElementById('calendarios-compartidos-dias').textContent = `${calendarios.compartidos} calendarios`;
        document.getElementById('calendarios-compartidos-progreso').textContent = `${calendarios.compartidos}/${maxCalendarios}`;
        document.getElementById('calendarios-compartidos-bar').value = Math.min(calendarios.compartidos / maxCalendarios, 1);
    }

    function renderizarRendimientoPorPrioridad() {
        const container = document.getElementById('rendimiento-prioridad-container');
        const porPrioridad = calcularPorPrioridad();
        
        container.innerHTML = '';
        
        const nombresPrioridad = {
            'alta': 'Alta',
            'media': 'Media',
            'baja': 'Baja'
        };
        
        const classesPrioridad = {
            'alta': 'trabajo',
            'media': 'personal',
            'baja': 'salud'
        };
        
        porPrioridad.forEach(item => {
            const porcentaje = item.totales > 0 ? Math.round((item.completadas / item.totales) * 100) : 0;
            const classProgress = classesPrioridad[item.prioridad];
            
            const div = document.createElement('div');
            div.className = 'bar-container';
            div.innerHTML = `
                <div class="content">
                    <h2>Prioridad ${nombresPrioridad[item.prioridad]}</h2>
                    <p>${item.completadas}/${item.totales}</p>
                </div>
                <div class="bar-progress">
                    <progress value="${porcentaje}" max="100" class="${classProgress}"></progress>
                    <p>${porcentaje}%</p>
                </div>
            `;
            
            container.appendChild(div);
        });
    }

    function renderizarDistribucionGastos(finanzas) {
        const lista = document.getElementById('distribucion-gastos-lista');
        
        lista.innerHTML = '';
        
        if (finanzas.gastosPorCategoria.length === 0) {
            lista.innerHTML = '<li><span class="descripcion">No hay gastos registrados</span></li>';
            return;
        }
        
        finanzas.gastosPorCategoria.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="descripcion">${item.categoria}</span>
                <span class="valor">$${item.monto.toFixed(2)}</span>
            `;
            lista.appendChild(li);
        });
    }

    // ============================================
    // FUNCIÓN PRINCIPAL DE INICIALIZACIÓN
    // ============================================

    async function inicializarEstadisticas() {
        console.log("[Estadísticas] Cargando datos...");
        
        // Cargar todos los datos en paralelo
        await Promise.all([
            cargarTareas(),
            cargarTransacciones(),
            cargarCalendarios(),
            cargarPlanesAhorro()
        ]);

        // Procesar finanzas
        const finanzas = procesarFinanzas(transacciones);
        
        console.log("[Estadísticas] Datos procesados:", {
            tareas: tareas.length,
            transacciones: transacciones.length,
            finanzas: finanzas,
            calendarios: calendarios,
            planesAhorro: planesAhorro
        });

        // Renderizar todo
        actualizarTarjetasPrincipales(finanzas);
        renderizarProgresoSemanal();
        actualizarProgresoTareas();
        actualizarResumenFinanciero(finanzas);
        actualizarSeguimientoCalendarios();
        renderizarRendimientoPorPrioridad();
        renderizarDistribucionGastos(finanzas);

        console.log("[Estadísticas] Dashboard inicializado correctamente ✅");
    }

    // ============================================
    // INICIAR
    // ============================================
    
    inicializarEstadisticas();

    // Recargar cuando la ventana recibe foco
    window.addEventListener('focus', () => {
        console.log("[Estadísticas] Ventana enfocada, recargando datos...");
        inicializarEstadisticas();
    });

    // Exportar función para uso externo si es necesario
    window.estadisticas = {
        actualizar: inicializarEstadisticas
    };
});