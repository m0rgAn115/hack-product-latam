import { Pressable, Image, Text, View, ActivityIndicator, StyleSheet, KeyboardTypeOptions, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useUserStore } from '@/store/useUserStore';
import useFetch from '@/hooks/useFetch';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '@/components/login/InputField';

export const Login = () => {
  const router = useRouter();
  const { setUser } = useUserStore();

  const [emailValue, setEmailValue] = useState('');
  const [passValue, setPassValue] = useState('');
  const [confirmPassValue, setConfirmPassValue] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorSession, setErrorSession] = useState('');

  const inputFields: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    keyboardType?: KeyboardTypeOptions;
    caption: string;
    secureTextEntry: boolean;
  }[] = [
    {
      label: 'Full name',
      value: nameValue,
      onChangeText: setNameValue,
      placeholder: 'John Doe',
      secureTextEntry: false,
      caption: 'Name',
    },
    {
      label: 'Email',
      value: emailValue,
      onChangeText: setEmailValue,
      placeholder: 'example@example.com',
      keyboardType: 'email-address',
      caption: 'Email',
      secureTextEntry: false,
    },
    {
      label: 'Password',
      value: passValue,
      onChangeText: setPassValue,
      placeholder: 'password',
      secureTextEntry: true,
      caption: 'Password',
    },
    {
      label: 'Confirm password',
      value: confirmPassValue,
      onChangeText: setConfirmPassValue,
      placeholder: 'password',
      secureTextEntry: true,
      caption: 'Password',
    },
  ];

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

  const registerUser = async () => {
    if (!emailValue || !passValue || !confirmPassValue || !nameValue) {
      setErrorSession('Please fill all the fields.');
      return;
    }

    if (passValue !== confirmPassValue) {
      setErrorSession('Passwords do not match.');
      return;
    } 
    
    setLoading(true);

    try {
      // Aquí deberías hacer la solicitud al backend para registrar al usuario
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
        setErrorSession('Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorSession('Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.supContainer}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
            <View style={styles.cont}>
              <Image 
                source={require('@/assets/images/log-reg/new.png')}
                style={styles.login_image}
              />
            </View>
            <View style={styles.container}>
              <Text style={styles.title}>
                Track and save today!{'\n'}Create an account
              </Text>
              {inputFields.map((field, index) => (
                <InputField
                  key={index}
                  label={field.label}
                  value={field.value}
                  onChangeText={field.onChangeText}
                  placeholder={field.placeholder}
                  keyboardType={field.keyboardType}
                  secureTextEntry={field.secureTextEntry}
                />
              ))}
              {errorSession !== '' && (
                <Text style={{ color: 'red', opacity: 0.6, fontSize: 12 }}>
                  {errorSession}
                </Text>
              )}
              <Pressable
                style={({ pressed }) => [
                  styles.loginButton,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={registerUser}
                disabled={loading}
              >
                {loading ? (
                  <View style={[styles.button]}>
                    <ActivityIndicator size="small" color="white" />
                  </View>
                ) : (
                  <View style={styles.button}>
                    <Text style={styles.loginText}>Create a new account</Text>
                  </View>
                )}
              </Pressable>
              <Pressable
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                onPress={() => router.navigate(`/login`)}
                disabled={loading}
              >
                <Text style={styles.registerText}>Already have an account</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  supContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  cont: {
    height: 150, // Tamaño fijo para la imagen
    width: '100%',
  },
  login_image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    marginBottom: 20,
    fontWeight: '700',
    color: '#000',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 100,
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
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerText: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Login;
