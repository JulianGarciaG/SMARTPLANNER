document.addEventListener("DOMContentLoaded", () => {
    const botonesFiltro = document.querySelectorAll(".filtros button");
    const transacciones = document.querySelectorAll("#lista-tareas li");

    transacciones.forEach((item) => {
        if (item.querySelector(".ingreso")) {
            item.classList.add("ingresos");
        } else if (item.querySelector(".egreso")) {
            item.classList.add("egresos");
        }
    });

    function actualizarContadores() {
        const total = transacciones.length;
        const ingresos = document.querySelectorAll("#lista-tareas li.ingresos").length;
        const egresos = document.querySelectorAll("#lista-tareas li.egresos").length;

        document.getElementById("todas").textContent = `Todas (${total})`;
        document.getElementById("ingresos").textContent = `Ingresos (${ingresos})`;
        document.getElementById("egresos").textContent = `Gastos (${egresos})`;
    }

    actualizarContadores();

    botonesFiltro.forEach((boton) => {
        boton.addEventListener("click", function (e) {
            e.preventDefault();
            const filtro = this.id;

            transacciones.forEach((item) => {
                if (filtro === "todas") {
                    item.style.display = "flex";
                } else {
                    item.style.display = item.classList.contains(filtro)
                    ? "flex"
                    : "none";
                }
            });
        });
    });
});
