import { Pressable, Text, TextInput, View, Alert } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export const Login = () => {

  const router = useRouter();


  const [emailValue, setEmailValue] = useState('ejemplo@ejemplo.com');
  const [passValue, setPassValue] = useState('pruebacontra');

  async function saveSessionToken(sesion_token:string, refresh_token:string, token_type:string) {
    try {
      await AsyncStorage.setItem('session_token', sesion_token);
      await AsyncStorage.setItem('refresh_token', refresh_token);
      await AsyncStorage.setItem('token_type', token_type);
      console.log('Token almacenado exitosamente');
    } catch (error) {
      console.error('Error al almacenar el token:', error);
    }
  }


  const fetchLogin = async () => {
    try {
      const response = await fetch('https://cognito-idp.us-east-1.amazonaws.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-amz-json-1.1',
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
        },
        body: JSON.stringify({
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: '31c7pn6i9gcr04htabaog56053',
          AuthParameters: {
            USERNAME: emailValue,
            PASSWORD: passValue,
          },
        }),
      });

      if (!response.ok) throw new Error('Error en la solicitud');

      const data = await response.json();
      console.log(data);
      
      const session_token = data.AuthenticationResult.AccessToken;
      const refresh_token = data.AuthenticationResult.RefreshToken
      const token_type = data.AuthenticationResult.TokenType



      // Handle successful login here

      if(session_token && refresh_token && token_type){
        Alert.alert('Login Successful', 'Welcome back!');
        saveSessionToken(session_token,refresh_token, token_type).then(() => {
          router.navigate(`/(tabs)/`)
        })
      }
      else
        Alert.alert('Error al iniciar sesion')

    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Lo siento, hubo un error procesando tu solicitud.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingVertical: 20, paddingHorizontal: 40, justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, marginTop: 20, textAlign: 'center', fontWeight: '600' }}>Bienvenido a Tepoz</Text>

      <TextInput
        value={emailValue}
        onChangeText={setEmailValue}
        style={{ backgroundColor: '#ededed', marginVertical: 10, borderRadius: 5, textAlign: 'center', padding: 10 }}
        placeholder="Email"
      />

      <TextInput
        value={passValue}
        onChangeText={setPassValue}
        style={{ backgroundColor: '#ededed', marginVertical: 10, borderRadius: 5, textAlign: 'center', padding: 10 }}
        placeholder="Password"
        secureTextEntry={true} // Set to true for security
      />

      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: '#0a77c5',
            paddingVertical: 5,
            marginTop: 10,
            width: '50%',
            alignSelf: 'center', // Center the button
          },
          { opacity: pressed ? 0.8 : 1 },
        ]}
        onPress={fetchLogin}
      >
        <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: '600', color: 'white' }}>Login</Text>
      </Pressable>
    </View>
  );
};

export default Login;
