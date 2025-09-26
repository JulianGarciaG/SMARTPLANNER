        document.addEventListener("DOMContentLoaded", () => {
            const usuarioJSON = localStorage.getItem("usuario");
            if (!usuarioJSON) {
                window.location.href = "../index.html";
                return;
            }

            const usuario = JSON.parse(usuarioJSON);

            // Actualizar saludo con el nombre del usuario
            const saludo = document.getElementById("saludo");
            if (usuario.nombre) {
                saludo.textContent = `¡Buen día, ${usuario.nombre}! 👋`;
            }

            // Ejemplo: actualizar datos de resumen si vienen en usuario
            // Ajusta estos campos según los datos que tengas disponibles
            if (usuario.tareasCompletadasHoy !== undefined && usuario.tareasTotalesHoy !== undefined) {
                document.getElementById("tareasCompletadas").textContent = `${usuario.tareasCompletadasHoy}/${usuario.tareasTotalesHoy}`;
            }
            if (usuario.tiempoEnfocadoHoy !== undefined) {
                document.getElementById("tiempoEnfocado").textContent = `${usuario.tiempoEnfocadoHoy}h`;
            }
            if (usuario.gastosDia !== undefined) {
                document.getElementById("gastosDia").textContent = `$${usuario.gastosDia}`;
            }
            if (usuario.balanceMensual !== undefined) {
                document.getElementById("balanceMensual").textContent = `$${usuario.balanceMensual}`;
            }
        });