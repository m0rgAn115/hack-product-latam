// import { Stack } from "expo-router";
import Header from "@/components/home/Header";
import Cards from "@/components/home/Cards";
import Balance from "@/components/home/Balance";
import Slides from "@/components/home/Slides";

export default function HomeScreen() {

  async function getToken() {
    try {
      const sesion_token = await AsyncStorage.getItem('session_token');
      const refresh_token = await AsyncStorage.getItem('refresh_token');
      const token_type = await AsyncStorage.getItem('token_type');
      console.log(sesion_token, refresh_token, token_type)
    } catch (error) {
      console.error('Error al recuperar el token:', error);
    }
  }

  const handleRecuperarToken = () => {
    // getSessionToken().then(t => console.log('token:', t))
  }

  return (
    <>
      <Header />
      <Balance />
      <Cards />
      <Slides />
    </>
  );
}
