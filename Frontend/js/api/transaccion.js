// js/transaccion.js
const API_URL = "http://localhost:8080/api/transacciones";

// ✅ Crear transacción
export async function createTransaccion(transaccion) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaccion),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Server error:", response.status, text);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("❌ createTransaccion:", error);
    return null;
  }
}

// ✅ Obtener transacciones de un usuario
export async function obtenerTransacciones(idUsuario) {
  try {
    const response = await fetch(`${API_URL}/usuario/${idUsuario}`);
    if (!response.ok) {
      console.error("Error obteniendo transacciones:", response.status);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error("❌ obtenerTransacciones:", error);
    return [];
  }
}
