import useGetTokens from "./useGetTokens";

const useFetch = async (endpoint: string, body:any, method:'POST'|'GET'|'PUT') => {
  try {

    // Get the tokens using the hook
    const tokens = await useGetTokens();
    if (tokens?.id_token) {
      const id_token = tokens.id_token;

      // Make the fetch request
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Authorization': id_token
        },
        body: JSON.stringify(body),
      });

      // Handle non-ok response
      if (!response.ok) throw new Error('Error en la solicitud');

      // Parse the response
      const data = await response.json();

      return data
      
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export default useFetch
