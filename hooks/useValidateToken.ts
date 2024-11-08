import useGetTokens from "./useGetTokens";

export const useValidateToken = async () => {
  try {
    // Retrieve tokens
    const tokens = await useGetTokens();
    const { id_token } = tokens || {};

    if (!id_token) {
      console.error("No token found");
      return false; // Consider invalid if token is not found
    }

    const response = await fetch(
      'https://zttizctjsl.execute-api.us-east-1.amazonaws.com/backend/cognito/crear-token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: id_token }),
      }
    );

    if (!response.ok) throw new Error('Error en la solicitud');

    const data = await response.json();

    return data.isValid;

  } catch (error) {
    console.error('Error:', error);
    console.error("Error al validar el token");
    return false; // Consider invalid if there was an error
  }
};
