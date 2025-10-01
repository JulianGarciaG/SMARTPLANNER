document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("containerCalendario");
    const listaCalendarios = document.getElementById("listaCalendarios");
    const colorInput = document.getElementById("colorSeleccionado");
    const compartirCheckbox = document.getElementById("compartirCalendario");

    const apiCalendarios = "http://localhost:8080/api/calendarios";
    const apiCompartidos = "http://localhost:8080/api/calendarios-compartidos";
    const apiEventos = "http://localhost:8080/api/eventos";

    // Header
    const tituloHeader = document.getElementById("calendarioSeleccionado");
    const puntoHeader = document.getElementById("puntoCalendario");

    // Colores conocidos
    const KNOWN_CLASSES = ["verde", "morado", "naranja", "azul", "rojo", "rosa"];

    function mapColorToClass(rawColor) {
        if (!rawColor) return null;
        const c = rawColor.trim().toLowerCase();
        const map = {
            "#34a853": "verde",
            "#34d399": "verde",
            "#4285f4": "azul",
            "#60a5fa": "azul",
            "#fbbc05": "naranja",
            "#ff9253": "naranja",
            "#ea4335": "rojo",
            "#a142f4": "morado",
            "#9934d3": "morado",
            "#f442ce": "rosa"
        };
        return map[c] || null;
    }

    function clearKnownColorClasses(el) {
        if (!el) return;
        KNOWN_CLASSES.forEach(cls => el.classList.remove(cls));
    }

    function setHeaderColorByClassOrHex(colorClass, colorHex) {
        if (!puntoHeader) return;
        clearKnownColorClasses(puntoHeader);
        puntoHeader.style.background = "";
        if (colorClass) {
            puntoHeader.classList.add(colorClass);
        } else if (colorHex) {
            puntoHeader.style.background = colorHex;
        } else {
            puntoHeader.style.background = "#cccccc";
        }
    }

    function getUsuario() {
        return JSON.parse(localStorage.getItem("usuario"));
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

    // Crear calendario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = form.querySelector("input[type='text']").value.trim();
        const tipoCalendario = document.getElementById("tipoCalendario").value;
        const color = colorInput.value;
        const usuario = getUsuario();
        const correo = usuario ? usuario.correoElectronico : null;

        if (!correo) { alert("No se detectó usuario en sesión."); return; }
        if (!nombre) { alert("El nombre es obligatorio"); return; }
        if (!color) { alert("Debes elegir un color"); return; }

        try {
            // Crear calendario
            const resCal = await fetch(apiCalendarios, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, tipo_de_calendario: tipoCalendario, color })
            });
            if (!resCal.ok) throw new Error(await resCal.text());

            const calendario = await resCal.json();
            const idCalendario = calendario.idCalendario ?? calendario.id_calendario ?? calendario.id;
            if (!idCalendario) throw new Error("No se obtuvo id del calendario creado");

            let permiso = "no_compartido";
            if (compartirCheckbox && compartirCheckbox.checked) {
                const radio = form.querySelector("input[name='permiso']:checked");
                const val = radio ? radio.value : "soloVer";
                permiso = (val === "soloVer") ? "ver" : "editar";
            }

            // Crear relación calendario-usuario
            const resCompartido = await fetch(apiCompartidos, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    correo,
                    idCalendario: parseInt(idCalendario, 10),
                    permiso
                })
            });
            if (!resCompartido.ok) throw new Error(await resCompartido.text());

            alert("Calendario creado correctamente");
            form.reset();
            colorInput.value = "";
            colorCircles.forEach(c => c.classList.remove("selected"));
            cargarCalendarios();

        } catch (err) {
            console.error(err);
            alert("Error: " + (err.message || err));
        }
    });

    async function cargarCalendarios() {
        listaCalendarios.innerHTML = "";
        const usuario = getUsuario();
        if (!usuario) return;

        try {
            const res = await fetch(`${apiCompartidos}/usuario/${usuario.idUsuario}`);
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();

            if (!Array.isArray(data) || data.length === 0) {
                listaCalendarios.innerHTML = "<p>No hay calendarios disponibles.</p>";
                return;
            }

            for (const item of data) {
                const cont = document.createElement("div");
                cont.classList.add("elep-calendario");

                const safeColor = String(item.color || "#cccccc").toLowerCase();
                const colorClass = mapColorToClass(safeColor);
                const safeNombre = escapeHtml(item.nombre || `Calendario #${item.idCalendario}`);

                let totalEventos = 0;
                try {
                    const resEventos = await fetch(`http://localhost:8080/api/eventos/calendario/${item.idCalendario}`);
                    if (resEventos.ok) {
                        const eventos = await resEventos.json();
                        totalEventos = Array.isArray(eventos) ? eventos.length : 0;
                    }
                } catch (err) {
                    console.warn("No se pudieron contar los eventos:", err);
                }

                const spanHtml = colorClass
                    ? `<span class="punto ${colorClass}"></span>`
                    : `<span class="punto" style="background:${safeColor}"></span>`;

                cont.innerHTML = `
                    ${spanHtml}
                    <h2>${safeNombre}</h2>
                    <h3>Eventos</h3>
                    <h4>${totalEventos} evento${totalEventos !== 1 ? "s" : ""}</h4>
                    <div class="contenedor-botones">
                        <button class="boton toggle-ocultar"
                                data-id="${item.idCalendario}"
                                data-nombre="${safeNombre}"
                                data-color="${safeColor}"
                                data-color-class="${colorClass ?? ''}">
                            Mostrar
                        </button>
                        <button class="boton toggle-compartir">Compartir</button>
                        <span class="badge-compartido">${escapeHtml(item.permiso)}</span>
                    </div>
                `;
                listaCalendarios.appendChild(cont);
            }

        } catch (err) {
            console.error("Error al cargar calendarios:", err);
            alert("Error: " + (err.message || err));
        }
    }

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

    // 👉 Mostrar/Ocultar calendario
    document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("toggle-ocultar")) {
            const idCalendario = e.target.getAttribute("data-id");
            const nombreCalendario = e.target.getAttribute("data-nombre");
            const colorHex = e.target.getAttribute("data-color");
            const colorClass = e.target.getAttribute("data-color-class") || null;

            if (e.target.textContent.trim() === "Mostrar") {
                setHeaderColorByClassOrHex(colorClass, colorHex);
                if (tituloHeader) tituloHeader.textContent = `Viendo: ${nombreCalendario}`;
                if (typeof window.setCalendarioActivo === "function") {
                    window.setCalendarioActivo(idCalendario, nombreCalendario, colorHex);
                }
                e.target.textContent = "Ocultar";
            } else {
                document.getElementById("listaEventosHoy").innerHTML = "";
                e.target.textContent = "Mostrar";
                if (tituloHeader) tituloHeader.textContent = "No hay calendarios seleccionados";
                setHeaderColorByClassOrHex(null, "#cccccc");
                if (typeof window.setCalendarioActivo === "function") {
                    window.setCalendarioActivo(null);
                }
            }
        }
    });

    // 👉 Compartir calendario manual
    document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("toggle-compartir")) {
            const card = e.target.closest(".elep-calendario");
            const idCalendario = card.querySelector(".toggle-ocultar")?.getAttribute("data-id");
            if (!idCalendario) return;

            const correo = prompt("Ingrese el correo del usuario con quien compartir:");
            if (!correo) return;

            try {
                const permiso = "ver"; // por defecto

                // Crear relación calendario-compartido
                const res = await fetch(apiCompartidos, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        correo,
                        idCalendario: parseInt(idCalendario, 10),
                        permiso
                    })
                });

                if (!res.ok) throw new Error(await res.text());

                // ✅ Enviar notificación al usuario compartido
                await fetch("http://localhost:8080/api/notificaciones/crear-por-correo", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({
                        correoDestino: correo,
                        titulo: "Calendario compartido",
                        mensaje: "Se te ha compartido un calendario",
                        tipo: "alerta" // puede ser "recordatorio" o "alerta_critica"
                    })
                });

                alert(`✅ Calendario compartido con ${correo}`);
            } catch (err) {
                console.error(err);
                alert("❌ Error al compartir: " + err.message);
            }
        }
    });

});
