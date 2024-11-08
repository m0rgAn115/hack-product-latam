// import { Stack } from "expo-router";
import Header from "@/components/home/Header";
import Cards from "@/components/home/Cards";
import Balance from "@/components/home/Balance";
import Slides from "@/components/home/Slides";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {

  

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
