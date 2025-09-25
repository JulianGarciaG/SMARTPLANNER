document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("containerCalendario");
    const listaCalendarios = document.getElementById("listaCalendarios");
    const colorInput = document.getElementById("colorSeleccionado"); // hidden input
    const compartirCheckbox = document.getElementById("compartirCalendario");

    const apiCalendarios = "http://localhost:8080/api/calendarios";
    const apiCompartidos = "http://localhost:8080/api/calendarios-compartidos";

    // Función para obtener idUsuario desde localStorage
    function getUserId() {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        return usuario ? usuario.idUsuario : null;
    }

    // Selección de color
    const colorCircles = document.querySelectorAll(".color-circle");
    colorCircles.forEach(circle => {
        circle.addEventListener("click", () => {
            const selectedColor = circle.getAttribute("data-color");
            colorInput.value = selectedColor;
            colorCircles.forEach(c => c.classList.remove("selected"));
            circle.classList.add("selected");
        });
    });

    // Submit: crear calendario y luego relación en Calendario_Compartido
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = form.querySelector("input[type='text']").value.trim();
        const tipoCalendario = document.getElementById("tipoCalendario").value;
        const color = colorInput.value;
        const idUsuario = getUserId();

        if (!idUsuario) {
            alert("No se detectó usuario en sesión. Inicia sesión e intenta de nuevo.");
            return;
        }
        if (!nombre) {
            alert("El nombre es obligatorio");
            return;
        }
        if (!color) {
            alert("Debes elegir un color");
            return;
        }

        try {
            // 1) Crear calendario
            const resCal = await fetch(apiCalendarios, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, tipo_de_calendario: tipoCalendario, color })
            });

            if (!resCal.ok) {
                const txt = await resCal.text();
                throw new Error(txt || "Error al crear calendario");
            }

            const calendario = await resCal.json();
            const idCalendario = calendario.idCalendario ?? calendario.id_calendario ?? calendario.id;
            if (!idCalendario) throw new Error("No se obtuvo id del calendario creado");

            // 2) Decidir permiso
            let permiso = "no_compartido";
            if (compartirCheckbox && compartirCheckbox.checked) {
                const radio = form.querySelector("input[name='permiso']:checked");
                const val = radio ? radio.value : "soloVer";
                permiso = (val === "soloVer") ? "ver" : "editar";
            }

            // 3) Insertar en Calendario_Compartido
            const resCompartido = await fetch(apiCompartidos, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idUsuario: parseInt(idUsuario, 10),
                    idCalendario: parseInt(idCalendario, 10),
                    permiso: permiso
                })
            });

            if (!resCompartido.ok) {
                const txt = await resCompartido.text();
                throw new Error(txt || "Error al crear relación en Calendario_Compartido");
            }

            alert("Calendario creado y vinculado correctamente");
            form.reset();
            colorInput.value = "";
            colorCircles.forEach(c => c.classList.remove("selected"));
            cargarCalendarios();

        } catch (err) {
            console.error(err);
            alert("Error: " + (err.message || err));
        }
    });

    // Cargar calendarios compartidos del usuario (nuevo endpoint optimizado)
    async function cargarCalendarios() {
        listaCalendarios.innerHTML = "";
        const idUsuario = getUserId();
        if (!idUsuario) {
            console.warn("No hay usuario en sesión. No se cargan calendarios.");
            return;
        }

        try {
            const res = await fetch(`${apiCompartidos}/usuario/${idUsuario}`);
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Error al obtener calendarios compartidos");
            }

            const data = await res.json(); // array de CalendarioCompartidoDetalleDto
            console.log("Calendarios compartidos:", data);

            if (!Array.isArray(data) || data.length === 0) {
                listaCalendarios.innerHTML = "<p>No hay calendarios disponibles.</p>";
                return;
            }

            data.forEach(item => {
                const cont = document.createElement("div");
                cont.classList.add("elep-calendario");

                const safeColor = String(item.color || "#cccccc").replace(/"/g, '').replace(/</g, '');
                const safeNombre = escapeHtml(item.nombre || `Calendario #${item.idCalendario}`);

                cont.innerHTML = `
                    <span class="punto" style="background:${safeColor}"></span>
                    <h2>${safeNombre}</h2>
                    <h3>Eventos</h3>
                    <h4>0 eventos</h4>
                    <div class="contenedor-botones">
                        <button class="boton toggle-ocultar">Ocultar</button>
                        <button class="boton toggle-compartir">Compartir</button>
                        <span class="badge-compartido">${escapeHtml(item.permiso)}</span>
                    </div>
                `;
                listaCalendarios.appendChild(cont);
            });

        } catch (err) {
            console.error("Error al cargar calendarios:", err);
            alert("Error: " + (err.message || err));
        }
    }

    // helper simple para prevenir inyección de HTML en texto
    function escapeHtml(str) {
        if (str == null) return '';
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    cargarCalendarios();
});
