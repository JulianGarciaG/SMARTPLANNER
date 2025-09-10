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

        const btnTodas = document.getElementById("todas");
        const btnIngresos = document.getElementById("ingresos");
        const btnEgresos = document.getElementById("egresos");

        if (btnTodas) btnTodas.textContent = `Todas (${total})`;
        if (btnIngresos) btnIngresos.textContent = `Ingresos (${ingresos})`;
        if (btnEgresos) btnEgresos.textContent = `Gastos (${egresos})`;
    }

    actualizarContadores();

    // Filtros de botones
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

        actualizarContadores();
        });
    });
});
