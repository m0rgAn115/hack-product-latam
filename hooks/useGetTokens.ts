import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function useGetTokens() {
  try {
    const sesion_token = await AsyncStorage.getItem('session_token');
    const refresh_token = await AsyncStorage.getItem('refresh_token');
    const token_type = await AsyncStorage.getItem('token_type');
    const id_token = await AsyncStorage.getItem('id_token');

    return {
      sesion_token,
      refresh_token,
      token_type,
      id_token
    }
  } catch (error) {
    console.error('Error al recuperar el token:', error);
  }
}