// js/api/transaccion.js
const API_URL = "http://localhost:8080/api/transacciones";

export async function createTransaccion(transaccion) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaccion),
    });

    if (!response.ok) {
      // opcional: mostrar detalle de error del servidor
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

// (puedes añadir getTransacciones, update, delete etc. aquí)
