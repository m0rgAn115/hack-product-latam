// import { Stack } from "expo-router";
import Header from "@/components/home/Header";
import Cards from "@/components/home/Cards";
import Balance from "@/components/home/Balance";
import Slides from "@/components/home/Slides";

export default function HomeScreen() {
  return (
    <>
      <Header />
      <Balance />
      <Cards />
      <Slides />
    </>
  );
}
