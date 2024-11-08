import { Alert } from "react-native";
import useGetTokens from "./useGetTokens";
import { useRefreshToken } from "./useRefreshToken";
import { useValidateToken } from "./useValidateToken";
import { useRouter } from "expo-router";

const useFetch = async (endpoint: string, body:any, method:'POST'|'GET'|'PUT') => {
  try {

    // Get the tokens using the hook
    const tokens = await useGetTokens();
    if (tokens?.id_token) {
      const id_token = tokens.id_token;

      // const es_valido = await useValidateToken(id_token)

      // if(!es_valido)
      //   useRefreshToken().catch((error) => {
      //     console.error('Error al actualizar el token:', error);
      //     router.navigate(`/(login)`)
      //     Alert.alert("Sesion caducada", "Inicie sesion de nuevo.")
      //     return undefined
      //   })

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

      console.log(data);
      

      return data
      
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export default useFetch
