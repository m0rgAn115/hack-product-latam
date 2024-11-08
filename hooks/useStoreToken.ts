import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function useStoreTokens(sesion_token:string, refresh_token:string, token_type:string, id_token:string) {
  try {
    await AsyncStorage.setItem('session_token', sesion_token);
    await AsyncStorage.setItem('refresh_token', refresh_token);
    await AsyncStorage.setItem('token_type', token_type);
    await AsyncStorage.setItem('id_token', id_token);
    console.log('Token almacenado exitosamente');
  } catch (error) {
    console.error('Error al almacenar el token:', error);
  }
}