document.addEventListener("DOMContentLoaded", async () => {
    const usuarioJSON = localStorage.getItem("usuario");
    if (!usuarioJSON) {
        window.location.href = "login.html";
        return;
    }

    const lista = document.getElementById("lista-tareas");
    const tituloSeccion = document.querySelector('.tareas h1');
    const inputBuscar = document.getElementById('inputBuscar');
    const selectPrioridad = document.getElementById('selectPrioridad');
    const totalTareas = document.getElementById("totalTareas");
    const tareasCompletadas = document.getElementById("tareasCompletadas");
    const tareasAltaPrioridad = document.getElementById("tareasAltaPrioridad");

    const btnTodas = document.getElementById("btnTodas");
    const btnPendientes = document.getElementById("btnPendientes");
    const btnCompletadas = document.getElementById("btnCompletadas");

    let estadoFiltro = 'todas';
    let textoBusqueda = '';
    let prioridadFiltro = 'todas';

    function actualizarResumen() {
        const arr = Array.isArray(window.tareasData) ? window.tareasData : [];
        const total = arr.length;
        const completadas = arr.filter(t => t.estado_de_tarea === true || t.completada).length;
        const altaPrioridad = arr.filter(t => (t.prioridad || '').toLowerCase() === "alta").length;

        if (totalTareas) totalTareas.textContent = total;
        if (tareasCompletadas) tareasCompletadas.textContent = completadas;
        if (tareasAltaPrioridad) tareasAltaPrioridad.textContent = altaPrioridad;

        if (btnTodas) btnTodas.textContent = `Todas (${total})`;
        if (btnPendientes) btnPendientes.textContent = `Pendientes (${total - completadas})`;
        if (btnCompletadas) btnCompletadas.textContent = `Completadas (${completadas})`;
    }

    function coincideBusqueda(li) {
        const q = textoBusqueda.trim().toLowerCase();
        if (!q) return true;
        const nombre = li.dataset.nombre || '';
        const descripcion = li.dataset.descripcion || '';
        return nombre.includes(q) || descripcion.includes(q);
    }

    function aplicarFiltros() {
        const items = lista ? Array.from(lista.querySelectorAll('li')) : [];
        items.forEach(li => {
            if (!li.dataset) return;
            const estadoOk =
                (estadoFiltro === 'todas') ||
                (estadoFiltro === 'pendientes' && li.dataset.estado === 'pendiente') ||
                (estadoFiltro === 'completadas' && li.dataset.estado === 'completada');

            const prioridadOk =
                (prioridadFiltro === 'todas') ||
                (li.dataset.prioridad === prioridadFiltro);

            const busquedaOk = coincideBusqueda(li);

            li.style.display = (estadoOk && prioridadOk && busquedaOk) ? 'flex' : 'none';
        });

        actualizarResumen();

        if (tituloSeccion) {
            if (estadoFiltro === 'todas') tituloSeccion.textContent = 'Todas las tareas';
            if (estadoFiltro === 'pendientes') tituloSeccion.textContent = 'Tareas pendientes';
            if (estadoFiltro === 'completadas') tituloSeccion.textContent = 'Tareas completadas';
        }
    }

    // Eventos de filtro
    if (btnTodas) btnTodas.addEventListener('click', () => { estadoFiltro = 'todas'; aplicarFiltros(); });
    if (btnPendientes) btnPendientes.addEventListener('click', () => { estadoFiltro = 'pendientes'; aplicarFiltros(); });
    if (btnCompletadas) btnCompletadas.addEventListener('click', () => { estadoFiltro = 'completadas'; aplicarFiltros(); });
    if (inputBuscar) inputBuscar.addEventListener('input', (e) => { textoBusqueda = e.target.value; aplicarFiltros(); });
    if (selectPrioridad) selectPrioridad.addEventListener('change', (e) => { prioridadFiltro = e.target.value; aplicarFiltros(); });

    // Reaplicar filtros cuando se cargan tareas o cambian en memoria
    window.addEventListener('tareas:loaded', aplicarFiltros);
    window.addEventListener('tareas:changed', aplicarFiltros);

    // Primera pasada
    aplicarFiltros();
});