import { View, StyleSheet, Image, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '@/components/login/buttons';
import { StatusBar } from 'expo-status-bar';
import { useRouter, Router } from 'expo-router';

const handlePress = (router: Router) => {
  router.navigate(`/login`);
};

export const Login = () => {
  const router = useRouter();

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.containerSup}>
        <View style={styles.imageCont}>
          <Image
            source={require("@/assets/images/log-reg/home.png")}
            style={styles.home_image}
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>
            Upgrade plan to highly experience
          </Text>
          <Text style={styles.description}>
            Take control of your money: track expenses, visualize finances, and make smarter decisions!
          </Text>
          <View style={styles.buttons}>
            <CustomButton
              text="Login"
              backgroundColor="#000"
              onPress={() => handlePress(router)}
            />
            <CustomButton
              text="Register"
              backgroundColor="#FFF"
              onPress={() => handlePress(router)}
              textStyle={{ color: "#000" }}
              buttonStyle={{ marginTop: 10, borderWidth: 1, borderColor: "#000" }}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  containerSup: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingTop: 20,
  },
  description: {
    marginTop: 10,
    fontSize: 16,
  },
  imageCont: {
    height: '50%',
    position: 'relative', // Asegúrate de que el gradiente se posicione bien
  },
  home_image: {
    flex: 1,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  buttons: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

export default Login;
