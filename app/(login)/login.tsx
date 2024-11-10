import { Pressable, Image, Text, TextInput, View, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useUserStore } from '@/store/useUserStore';
import useFetch from '@/hooks/useFetch';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Login = () => {
  const router = useRouter();
  const { setUser } = useUserStore();

  const [emailValue, setEmailValue] = useState('');
  const [passValue, setPassValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUse] = useState(false);

  const storeTokens = async (tokens: { [key: string]: string }) => {
    try {
      await AsyncStorage.multiSet(
        Object.entries(tokens).map(([key, value]) => [key, value])
      );
      console.log('Tokens almacenados exitosamente');
    } catch (error) {
      console.error('Error al almacenar los tokens:', error);
    }
  };

  const setDemoUser = async () => {
    setLoadingUse(true);
    setEmailValue('damianmor3005@gmail.com');
    setPassValue('Moar758849@');
    setLoadingUse(false);
  };

  const fetchLogin = async () => {
    if (!emailValue || !passValue) {
      return Alert.alert('Error', 'Por favor ingresa un correo y una contraseña.');
    }

    setLoading(true);

    try {
      const response = await fetch('https://zttizctjsl.execute-api.us-east-1.amazonaws.com/backend/cognito/crear-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-amz-json-1.1',
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
        },
        body: JSON.stringify({
          email: emailValue,
          password: passValue,
        }),
      });

      if (!response.ok) throw new Error('Error en la solicitud');

      const data = await response.json();

      const { access_token, refresh_token, token_type, id_token } = data;

      if (access_token && refresh_token && token_type) {
        Alert.alert('Login Exitoso', '¡Bienvenido de nuevo!');
        await storeTokens({
          session_token: access_token,
          refresh_token: refresh_token,
          token_type: token_type,
          id_token: id_token,
        });

        const userData = await useFetch('https://zttizctjsl.execute-api.us-east-1.amazonaws.com/backend/dynamo/consultar-usuario', {
          correo: emailValue,
        }, 'POST');

        setUser({
          nombre: userData.response.nombre,
          correo: userData.response.correo,
          accessToken: userData.response.accessToken,
          img_url: userData.response.img_url,
          saldo: 0
        });

        router.navigate(`/(tabs)/`);
      } else {
        Alert.alert('Error', 'Error al iniciar sesión.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Lo siento, hubo un error procesando tu solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.supContainer}>
        <View style={styles.cont}>
          <Image source={require('@/assets/images/log-reg/backLog.png')}
            style={styles.login_image}
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>

          <View>
            <Text style={styles.caption}>
              Email
            </Text>
            <TextInput
              value={emailValue}
              onChangeText={setEmailValue}
              style={styles.input}
              placeholder="example@example.com"
              keyboardType="email-address"
            />
          </View>

          <View>
            <Text style={styles.caption}>
              Password
            </Text>
            <TextInput
              value={passValue}
              onChangeText={setPassValue}
              style={styles.input}
              placeholder="example..."
              secureTextEntry={true}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={fetchLogin}
            disabled={loading} // Deshabilita el botón durante la carga
          >
            {loading ? (
              <View style={[styles.button]}>
                <ActivityIndicator size="small" color="white" />
              </View>
            ) : (
              <View style={styles.button}>
                <Text style={styles.loginText}>Sign in</Text>
              </View>
            )}
          </Pressable>
        
          <View style={styles.demoCont}>
            <Text style={styles.try}>
              Try our demo user: 
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.loginButtonDemo,
                { opacity: pressed ? 0.2 : 1 },
              ]}
              onPress={setDemoUser}
              disabled={loadingUser}
            >
                  <Text style={styles.demoText}>Demo account</Text> 
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  supContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  cont: {
    height: '40%',
    width: '100%',
  },
  login_image: {
    flex: 1,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight: '700',
    color: '#000',
  },
  input: {
    backgroundColor: '#F0F0F0',
    marginBottom: 14,
    borderRadius: 8,
    padding: 10,
    paddingHorizontal: 15
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  loginButton: {
    width: "100%",
    paddingVertical: 10,
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 5,
  },
  loginButtonDemo: {
    width: "100%",
    paddingVertical: 10,
    alignSelf: 'center',
    borderRadius: 5,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  demoText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  demoCont:{
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  try: {
    fontSize: 15,
    color: '#000',
    marginRight: 8,
  },
  caption: {
    marginBottom: 5,
    fontSize: 15,
  }
});

export default Login;
