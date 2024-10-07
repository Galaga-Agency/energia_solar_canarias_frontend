export const loginOrRegister = async (data, isSignup) => {
  try {
    const endpoint = isSignup ? "/api/register" : "/api/login";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error al procesar tu solicitud.");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Hubo un problema en el servidor.");
  }
};
