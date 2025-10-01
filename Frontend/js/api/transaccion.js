const API_URL = "http://localhost:8080/api/transacciones";

export async function createTransaccion(transaccion) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaccion),
    });
    if (!response.ok) {
      console.error("Error en createTransaccion:", response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error createTransaccion:", error);
    return null;
  }
}

// js/api/transaccion.js
export async function obtenerTransacciones() {
  try {
    const usuarioJSON = localStorage.getItem("usuario");
    if (!usuarioJSON) return [];
    const usuario = JSON.parse(usuarioJSON);

    const resp = await fetch(`http://localhost:8080/api/transacciones/usuario/${usuario.idUsuario}`);
    if (!resp.ok) throw new Error(await resp.text());

    return await resp.json();
  } catch (err) {
    console.error("Error al obtener transacciones:", err);
    return [];
  }
}
