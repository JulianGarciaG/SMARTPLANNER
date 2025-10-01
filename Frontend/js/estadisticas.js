// estadisticas.js - Dashboard de estadísticas integrado con el sistema
// Versión corregida - Fix en carga de tareas

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

    console.log("[Estadísticas] ID Usuario:", idUsuario);

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
            console.log(`[Estadísticas] 🔄 Cargando tareas desde: /api/tareas/${idUsuario}`);
            const response = await fetch(`http://localhost:8080/api/tareas/${idUsuario}`);
            
            console.log(`[Estadísticas] Response status tareas:`, response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[Estadísticas] ❌ Error HTTP ${response.status}:`, errorText);
                throw new Error(`Error ${response.status}: ${errorText}`);
            }
            
            const data = await response.json();
            console.log("[Estadísticas] 📦 Data raw de tareas:", data);
            
            tareas = Array.isArray(data) ? data : [];
            console.log(`[Estadísticas] ✅ ${tareas.length} tareas cargadas exitosamente`);
            
            if (tareas.length > 0) {
                console.log("[Estadísticas] 📋 Primera tarea de ejemplo:", tareas[0]);
                console.log("[Estadísticas] 🔍 Campos disponibles:", Object.keys(tareas[0]));
            } else {
                console.warn("[Estadísticas] ⚠️ No se encontraron tareas para el usuario");
            }
            
            return tareas;
        } catch (error) {
            console.error("[Estadísticas] ❌ Error crítico cargando tareas:", error);
            console.error("[Estadísticas] Stack trace:", error.stack);
            tareas = [];
            return [];
        }
    }

    async function cargarTransacciones() {
        try {
            console.log(`[Estadísticas] 🔄 Cargando transacciones...`);
            const response = await fetch(`http://localhost:8080/api/transacciones/usuario/${idUsuario}`);
            if (!response.ok) throw new Error("Error al cargar transacciones");
            const data = await response.json();
            transacciones = Array.isArray(data) ? data : [];
            console.log(`[Estadísticas] ✅ ${transacciones.length} transacciones cargadas`);
            return transacciones;
        } catch (error) {
            console.error("[Estadísticas] Error cargando transacciones:", error);
            return [];
        }
    }

    async function cargarCalendarios() {
        try {
            const response = await fetch(`http://localhost:8080/api/calendarios-compartidos/usuario/${idUsuario}`);
            if (!response.ok) throw new Error("Error al cargar calendarios");
            const data = await response.json();
            
            if (Array.isArray(data)) {
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
            
            console.log(`[Estadísticas] ✅ Calendarios cargados:`, calendarios);
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
            
            console.log(`[Estadísticas] ✅ Planes de ahorro cargados:`, planesAhorro);
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
        console.log("[Estadísticas] 🔄 Procesando finanzas...");
        const hoy = new Date();
        const mesActual = hoy.getMonth();
        const anioActual = hoy.getFullYear();

        let totalIngresos = 0;
        let totalGastos = 0;
        const categorias = {};

        transacciones.forEach((tx) => {
            if (!tx.fecha) return;
            const fechaTx = new Date(tx.fecha);
            
            if (fechaTx.getMonth() === mesActual && fechaTx.getFullYear() === anioActual) {
                const monto = Number(tx.monto) || 0;
                
                if (String(tx.tipo).toLowerCase() === "ingreso") {
                    totalIngresos += monto;
                } else if (String(tx.tipo).toLowerCase() === "egreso") {
                    totalGastos += monto;
                    const cat = tx.categoria || 'Otros';
                    categorias[cat] = (categorias[cat] || 0) + monto;
                }
            }
        });

        const gastosPorCategoria = Object.keys(categorias)
            .map(cat => ({ categoria: cat, monto: categorias[cat] }))
            .sort((a, b) => b.monto - a.monto);

        console.log("[Estadísticas] ✅ Finanzas procesadas:", {
            ingresos: totalIngresos,
            gastos: totalGastos,
            balance: totalIngresos - totalGastos
        });

        return {
            ingresos: totalIngresos,
            gastos: totalGastos,
            balance: totalIngresos - totalGastos,
            gastosPorCategoria: gastosPorCategoria
        };
    }

    // ============================================
    // FUNCIONES DE CÁLCULO DE TAREAS
    // ============================================

    function calcularProductividad() {
        console.log("[Estadísticas] 🔄 Calculando productividad...");
        
        if (tareas.length === 0) {
            console.log("[Estadísticas] ⚠️ No hay tareas para calcular productividad");
            return 0;
        }

        // Contar todas las tareas completadas vs total
        const totalCompletadas = tareas.filter(t => 
            t.estado_de_tarea === true || 
            t.completada === true || 
            t.estado === 'completada' ||
            t.estado === true
        ).length;
        
        const totalTareas = tareas.length;
        
        console.log(`[Estadísticas] Tareas completadas: ${totalCompletadas} de ${totalTareas}`);
        
        const productividad = totalTareas > 0 ? Math.round((totalCompletadas / totalTareas) * 100) : 0;
        console.log(`[Estadísticas] ✅ Productividad: ${productividad}%`);
        
        return productividad;
    }

    function tareasCompletadas() {
        const completadas = tareas.filter(t => 
            t.estado_de_tarea === true || 
            t.completada === true || 
            t.estado === 'completada' ||
            t.estado === true
        ).length;
        
        console.log(`[Estadísticas] Total tareas completadas: ${completadas} de ${tareas.length}`);
        return completadas;
    }

    function obtenerProgresoSemanal() {
        console.log("[Estadísticas] 🔄 Calculando progreso semanal...");
        
        const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Normalizar a medianoche
        const progresoSemanal = [];

        for (let i = 6; i >= 0; i--) {
            const fecha = new Date(hoy);
            fecha.setDate(hoy.getDate() - i);
            const fechaStr = fecha.toISOString().split('T')[0];
            
            console.log(`[Estadísticas] Procesando día: ${fechaStr}`);
            
            const tareasDelDia = tareas.filter(t => {
                const completada = t.estado_de_tarea === true || t.completada === true || t.estado === 'completada' || t.estado === true;
                const fechaLimite = t.fecha_limite || t.fechaLimite || t.fecha;
                
                if (!fechaLimite) return false;
                
                // Extraer solo la fecha (YYYY-MM-DD) sin importar el formato
                let fechaTarea;
                if (typeof fechaLimite === 'string') {
                    fechaTarea = fechaLimite.split('T')[0]; // Para formato ISO
                } else {
                    fechaTarea = new Date(fechaLimite).toISOString().split('T')[0];
                }
                
                const coincide = fechaTarea === fechaStr && completada;
                if (coincide) {
                    console.log(`  ✓ Tarea completada encontrada:`, t.titulo || t.nombre);
                }
                
                return coincide;
            });
            
            const tareasTotalesDelDia = tareas.filter(t => {
                const fechaLimite = t.fecha_limite || t.fechaLimite || t.fecha;
                
                if (!fechaLimite) return false;
                
                let fechaTarea;
                if (typeof fechaLimite === 'string') {
                    fechaTarea = fechaLimite.split('T')[0];
                } else {
                    fechaTarea = new Date(fechaLimite).toISOString().split('T')[0];
                }
                
                return fechaTarea === fechaStr;
            });
            
            const diaSemana = dias[fecha.getDay()];
            const diaNumero = fecha.getDate();
            
            console.log(`  → ${diaSemana} ${diaNumero}: ${tareasDelDia.length}/${tareasTotalesDelDia.length} completadas`);
            
            progresoSemanal.push({
                dia: diaSemana,
                numero: diaNumero,
                completadas: tareasDelDia.length,
                totales: tareasTotalesDelDia.length,
                mes: meses[fecha.getMonth()]
            });
        }

        console.log("[Estadísticas] ✅ Progreso semanal calculado:", progresoSemanal);
        return progresoSemanal;
    }

    function calcularPorPrioridad() {
        console.log("[Estadísticas] 🔄 Calculando tareas por prioridad...");
        
        const prioridades = ['alta', 'media', 'baja'];
        const resultado = prioridades.map(p => {
            const tareasPrioridad = tareas.filter(t => {
                const prioridadTarea = (t.prioridad || '').toLowerCase();
                return prioridadTarea === p;
            });
            
            const completadasPrioridad = tareasPrioridad.filter(t => 
                t.estado_de_tarea === true || 
                t.completada === true || 
                t.estado === 'completada' ||
                t.estado === true
            );
            
            return {
                prioridad: p,
                completadas: completadasPrioridad.length,
                totales: tareasPrioridad.length
            };
        });
        
        console.log("[Estadísticas] ✅ Por prioridad:", resultado);
        return resultado;
    }

    // ============================================
    // FUNCIONES DE RENDERIZADO
    // ============================================

    function actualizarTarjetasPrincipales(finanzas) {
        console.log("[Estadísticas] 🎨 Actualizando tarjetas principales...");
        
        const productividad = calcularProductividad();
        const completadas = tareasCompletadas();
        const totales = tareas.length;
        
        document.getElementById('productividad-valor').textContent = `${productividad}%`;
        document.getElementById('planes-ahorro-valor').textContent = `${planesAhorro.completados} / ${planesAhorro.totales}`;
        document.getElementById('balance-valor').textContent = `$ ${finanzas.balance.toFixed(2)}`;
        document.getElementById('tareas-completadas-valor').textContent = `${completadas} / ${totales}`;
        
        console.log("[Estadísticas] ✅ Tarjetas actualizadas");
    }

    function renderizarProgresoSemanal() {
        console.log("[Estadísticas] 🎨 Renderizando progreso semanal...");
        
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
        
        console.log("[Estadísticas] ✅ Progreso semanal renderizado");
    }

    function actualizarProgresoTareas() {
        console.log("[Estadísticas] 🎨 Actualizando progreso de tareas...");
        
        const completadas = tareasCompletadas();
        const pendientes = tareas.length - completadas;
        const porcentaje = tareas.length > 0 ? Math.round((completadas / tareas.length) * 100) : 0;
        
        document.getElementById('tareas-completadas-numero').textContent = completadas;
        document.getElementById('tareas-pendientes-numero').textContent = pendientes;
        document.getElementById('progreso-general-porcentaje').textContent = `${porcentaje}%`;
        document.getElementById('progreso-general-bar').value = porcentaje / 100;
        
        console.log("[Estadísticas] ✅ Progreso de tareas actualizado");
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
        console.log("[Estadísticas] 🎨 Renderizando rendimiento por prioridad...");
        
        const container = document.getElementById('rendimiento-prioridad-container');
        const porPrioridad = calcularPorPrioridad();
        
        container.innerHTML = '';
        
        const nombresPrioridad = { 'alta': 'Alta', 'media': 'Media', 'baja': 'Baja' };
        const classesPrioridad = { 'alta': 'trabajo', 'media': 'personal', 'baja': 'salud' };
        
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
        
        console.log("[Estadísticas] ✅ Rendimiento por prioridad renderizado");
    }

    function renderizarDistribucionGastos(finanzas) {
        const lista = document.getElementById('distribucion-gastos-lista');
        lista.innerHTML = '';
        
        if (finanzas.gastosPorCategoria.length === 0) {
            lista.innerHTML = '<li><span class="descripcion">No hay gastos registrados este mes</span></li>';
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
        console.log("\n[Estadísticas] ========================================");
        console.log("[Estadísticas] 🚀 INICIANDO CARGA DE DATOS");
        console.log("[Estadísticas] ========================================\n");
        
        try {
            // Cargar todos los datos en paralelo
            await Promise.all([
                cargarTareas(),
                cargarTransacciones(),
                cargarCalendarios(),
                cargarPlanesAhorro()
            ]);

            console.log("\n[Estadísticas] ========================================");
            console.log("[Estadísticas] 📊 RESUMEN DE DATOS CARGADOS:");
            console.log(`[Estadísticas]    - Tareas: ${tareas.length}`);
            console.log(`[Estadísticas]    - Transacciones: ${transacciones.length}`);
            console.log(`[Estadísticas]    - Calendarios: ${calendarios.totales}`);
            console.log(`[Estadísticas]    - Planes de Ahorro: ${planesAhorro.totales}`);
            console.log("[Estadísticas] ========================================\n");

            // Procesar finanzas
            const finanzas = procesarFinanzas(transacciones);

            // Renderizar todo
            console.log("[Estadísticas] 🎨 Renderizando interfaz...\n");
            actualizarTarjetasPrincipales(finanzas);
            renderizarProgresoSemanal();
            actualizarProgresoTareas();
            actualizarResumenFinanciero(finanzas);
            actualizarSeguimientoCalendarios();
            renderizarRendimientoPorPrioridad();
            renderizarDistribucionGastos(finanzas);

            console.log("\n[Estadísticas] ========================================");
            console.log("[Estadísticas] ✅ DASHBOARD INICIALIZADO CORRECTAMENTE");
            console.log("[Estadísticas] ========================================\n");
        } catch (error) {
            console.error("\n[Estadísticas] ========================================");
            console.error("[Estadísticas] ❌ ERROR FATAL AL INICIALIZAR");
            console.error("[Estadísticas]", error);
            console.error("[Estadísticas] ========================================\n");
        }
    }

    // ============================================
    // INICIAR
    // ============================================
    
    inicializarEstadisticas();

    // Recargar cuando la ventana recibe foco
    window.addEventListener('focus', () => {
        console.log("[Estadísticas] 🔄 Ventana enfocada, recargando datos...");
        inicializarEstadisticas();
    });

    // Exportar función para uso externo
    window.estadisticas = {
        actualizar: inicializarEstadisticas
    };
});