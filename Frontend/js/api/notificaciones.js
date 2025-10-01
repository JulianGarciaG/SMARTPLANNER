// =========================
//  notificaciones.js
// =========================

// Obtener idUsuario del localStorage
function getUserId() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    return usuario ? usuario.idUsuario : null;
}

// Llamar API backend para traer notificaciones
async function cargarNotificaciones(idUsuario) {
    try {
        const response = await fetch(`http://localhost:8080/api/notificaciones/usuario/${idUsuario}`);
        if (!response.ok) {
            throw new Error("Error al cargar notificaciones");
        }
        const lista = await response.json();
        renderNotificaciones(lista);
    } catch (error) {
        console.error("Error cargando notificaciones:", error);
    }
}

// Renderizar notificaciones en el DOM
function renderNotificaciones(lista) {
    const contenedor = document.querySelector(".tabla-notificaciones");
    contenedor.innerHTML = "";

    lista.forEach(n => {
        const noti = document.createElement("div");
        noti.classList.add("notificacion");
        noti.classList.add(n.leida ? "leida" : "nueva");

        noti.innerHTML = `
            <img class="cerraNotificacion" src="../img/cerrar.png" width="12" height="12" onclick="eliminarNotificacion(${n.idNotificacion})">
            <div class="estado">
                <img class="tipoNoficicacion" src="../img/cheque.png" width="18" height="18">
                <h1 class="estado">${n.titulo}</h1>
                <p class="tiempo">${formatearTiempo(n.fechaCreacion)}</p>
            </div>
            <div class="informacion">
                <p>${n.mensaje}</p>
            </div>
            ${n.leida ? "" : `<p class="marcar-leida" onclick="marcarLeida(${n.idNotificacion})">Marcar como leída</p>`}
        `;

        contenedor.appendChild(noti);
    });

    actualizarContador(lista);
}

// Actualizar el numerito 🔔 en la campana
function actualizarContador(lista) {
    const nuevas = lista.filter(n => !n.leida).length;
    const campana = document.getElementById("abrirNotificacion");
    if (campana) {
        campana.setAttribute("data-count", nuevas);
    }
}

// Marcar notificación como leída
async function marcarLeida(idNotificacion) {
    try {
        const response = await fetch(`http://localhost:8080/api/notificaciones/${idNotificacion}/leer`, {
            method: "PUT"
        });
        if (response.ok) {
            const idUsuario = getUserId();
            if (idUsuario) cargarNotificaciones(idUsuario);
        }
    } catch (error) {
        console.error("Error al marcar como leída:", error);
    }
}

// Eliminar notificación
async function eliminarNotificacion(idNotificacion) {
    try {
        const response = await fetch(`http://localhost:8080/api/notificaciones/${idNotificacion}`, {
            method: "DELETE"
        });
        if (response.ok) {
            const idUsuario = getUserId();
            if (idUsuario) cargarNotificaciones(idUsuario);
        }
    } catch (error) {
        console.error("Error al eliminar notificación:", error);
    }
}

// Formatear fecha/hora de la notificación
function formatearTiempo(fechaISO) {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString("es-CO", {
        dateStyle: "short",
        timeStyle: "short"
    });
}

// =========================
// Inicializar al cargar DOM
// =========================
document.addEventListener("DOMContentLoaded", () => {
    const idUsuario = getUserId();
    if (idUsuario) {
        cargarNotificaciones(idUsuario);
    } else {
        console.warn("⚠ No se encontró usuario logueado en localStorage");
    }
});
