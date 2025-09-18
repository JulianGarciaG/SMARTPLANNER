// const informacion1 = document.getElementById("informacion1");
// const informacion2 = document.getElementById("informacion2");
// const informacion3 = document.getElementById("informacion3");

// const texto1 = document.getElementById("texto1");
// const texto2 = document.getElementById("texto2");
// const texto3 = document.getElementById("texto3");

// const input1 = document.getElementById("input-informacion1");
// const input2 = document.getElementById("input-informacion2");
// const input3 = document.getElementById("input-informacion3");

// input1.addEventListener("click", function () {
//     if (input1.checked) {
//         informacion1.style.backgroundColor = "rgb(236 253 245)";
//         texto1.style.textDecoration = "line-through";
//         texto1.style.color = "#6b7280";
//     } else {
//         informacion1.style.backgroundColor = "white";
//         texto1.style.textDecoration = "none";
//         texto1.style.color = "#1e293b";
//     }
// });

// input2.addEventListener("click", function () {
//     if (input2.checked) {
//         informacion2.style.backgroundColor = "rgb(236 253 245)";
//         texto2.style.textDecoration = "line-through";
//         texto2.style.color = "#6b7280";
//     } else {
//         informacion2.style.backgroundColor = "white";
//         texto2.style.textDecoration = "none";
//         texto2.style.color = "#1e293b";
//     }
// });

// input3.addEventListener("click", function () {
//     if (input3.checked) {
//         informacion3.style.backgroundColor = "rgb(236 253 245)";
//         texto3.style.textDecoration = "line-through";
//         texto3.style.color = "#6b7280";
//     } else {
//         informacion3.style.backgroundColor = "white";
//         texto3.style.textDecoration = "none";
//         texto3.style.color = "#1e293b";
//     }
// });

// Seleccionamos todas las tareas
const tareas = document.querySelectorAll(".tarea");

tareas.forEach(tarea => {
  const input = tarea.querySelector(".input-tarea");
  const texto = tarea.querySelector(".texto-titulo");

  input.addEventListener("click", () => {
    if (input.checked) {
      tarea.style.backgroundColor = "rgb(236 253 245)";
      texto.style.textDecoration = "line-through";
      texto.style.color = "#6b7280";
    } else {
      tarea.style.backgroundColor = "white";
      texto.style.textDecoration = "none";
      texto.style.color = "#1e293b";
    }
  });
});
