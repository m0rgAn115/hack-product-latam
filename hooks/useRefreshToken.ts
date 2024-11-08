import AsyncStorage from "@react-native-async-storage/async-storage";
import useStoreTokens from "./useStoreToken";

export const useRefreshToken = async () => {


  const refresh_token_actual = await AsyncStorage.getItem('refresh_token');
    
  try {
    const response = await fetch('https://zttizctjsl.execute-api.us-east-1.amazonaws.com/backend/cognito/actualizar-token', {
      method: 'POST',
      body: JSON.stringify({
        refresh_token_actual
      }),
    });

    if (!response.ok) throw new Error('Error en la solicitud');

    const data = await response.json();

    const { sesion_token, refresh_token, token_type, id_token } = data


    if( sesion_token === undefined || refresh_token === undefined || token_type === undefined || id_token === undefined) throw new Error('Error en la solicitud')
      else {
        useStoreTokens(sesion_token, refresh_token, token_type, id_token)
        return {
          sesion_token, refresh_token, token_type, id_token
        }

    }

    console.log("Tokens almacenados correctamente!")

  } catch (error) {
    console.error('Error:', error);
    console.error("Error al validar el token")
  }


}