document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("containerCalendario");
    const listaCalendarios = document.getElementById("listaCalendarios");
    const colorInput = document.getElementById("colorSeleccionado"); // hidden input que ya tienes
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
        const idUsuario = getUserId(); // ✅ ahora desde el objeto

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
            let permiso = "no-compartido";
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

    // Cargar calendarios compartidos
    // Reemplaza la función cargarCalendarios existente por esta
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

            const data = await res.json(); // array de objetos CalendarioCompartido

            // Identificar ids de calendarios que NO vienen anidados (no tienen item.calendario)
            const idsNecesarios = new Set();
            data.forEach(item => {
                const idCad = item.id?.idCalendario ?? item.idCalendario ?? item.id_calendario ?? item.id;
                if (!item.calendario && idCad) idsNecesarios.add(parseInt(idCad, 10));
            });

            // Mapa id -> calendario (información)
            const mapaCalendarios = {};

            // 1) Intento: obtener cada calendario por /api/calendarios/{id} (paralelo)
            if (idsNecesarios.size > 0) {
                const idsArray = Array.from(idsNecesarios);
                try {
                    const promesas = idsArray.map(id =>
                        fetch(`${apiCalendarios}/${id}`).then(r => r.ok ? r.json() : null)
                    );
                    const resultados = await Promise.all(promesas);
                    resultados.forEach((cal, idx) => {
                        const id = idsArray[idx];
                        if (cal) mapaCalendarios[id] = cal;
                    });
                } catch (err) {
                    // si falla el fetch por item, lo ignoramos y probaremos el fallback
                    console.warn("No fue posible obtener calendarios por id individual:", err);
                }
            }

            // 2) Fallback: si no obtuvimos todos los calendarios, pedir todo y mapear por id
            const faltantes = Array.from(idsNecesarios).filter(id => !mapaCalendarios[id]);
            if (faltantes.length > 0) {
                try {
                    const resAll = await fetch(apiCalendarios);
                    if (resAll.ok) {
                        const all = await resAll.json();
                        all.forEach(cal => {
                            const idVal = cal.idCalendario ?? cal.id_calendario ?? cal.id;
                            if (idVal != null) mapaCalendarios[parseInt(idVal, 10)] = cal;
                        });
                    } else {
                        console.warn("Fallback GET /api/calendarios no disponible:", await resAll.text());
                    }
                } catch (err) {
                    console.warn("Error en fallback GET /api/calendarios:", err);
                }
            }

            // Ahora renderizamos usando preferentemente item.calendario o el mapa obtenido
            data.forEach((item) => {
                // obtener idCalendario de la relación
                const idCalendario = item.id?.idCalendario ?? item.idCalendario ?? item.id_calendario ?? item.id;
                const idNum = idCalendario != null ? parseInt(idCalendario, 10) : null;

                // obtener info de calendario (si existe)
                const calendario = item.calendario ?? (idNum ? mapaCalendarios[idNum] : null);

                // normalizar nombre y color (varias posibles claves)
                const nombre = calendario?.nombre ?? calendario?.name ?? calendario?.titulo ?? `Calendario #${idNum ?? 'N/A'}`;
                const color = calendario?.color ?? calendario?.colorHex ?? calendario?.color_code ?? "#cccccc";

                const permisoTexto = item.permiso ?? "";

                const cont = document.createElement("div");
                cont.classList.add("elep-calendario");

                // aplico color directamente a background; escapamos el valor por seguridad mínima
                const safeColor = String(color).replace(/"/g, '').replace(/</g, '');
                cont.innerHTML = `
                <span class="punto" style="background:${safeColor}"></span>
                <h2>${escapeHtml(nombre)}</h2>
                <h3>Eventos</h3>
                <h4>0 eventos</h4>
                <div class="contenedor-botones">
                    <button class="boton toggle-ocultar">Ocultar</button>
                    <button class="boton toggle-compartir">Compartir</button>
                    ${permisoTexto ? `<span class="badge-compartido">${escapeHtml(permisoTexto)}</span>` : ""}
                </div>
            `;
                listaCalendarios.appendChild(cont);
            });

            if (!Array.isArray(data) || data.length === 0) {
                listaCalendarios.innerHTML = "<p>No hay calendarios disponibles.</p>";
            }

        } catch (err) {
            console.error("Error al cargar calendarios:", err);
            alert("Error: Error al obtener calendarios");
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
