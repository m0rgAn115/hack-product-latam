import { Pressable, Image, Text, View, ActivityIndicator, StyleSheet, KeyboardTypeOptions, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useUserStore } from '@/store/useUserStore';
import useFetch from '@/hooks/useFetch';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '@/components/login/InputField';
import { PlaidTransaction } from '@/components/home/expensess';
import { useTransactionsStore } from '@/store/useTransactionsStore';
import { filterTransactions } from '@/components/Expenses/filterTransactions';
import { useCardsStore } from '@/store/useCardStore';

export const Login = () => {
  const router = useRouter();
  const { setUser } = useUserStore();

  const { setTransacciones } = useTransactionsStore()

  const { setCards } = useCardsStore()

  const [emailValue, setEmailValue] = useState('');
  const [passValue, setPassValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUse] = useState(false);
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
      placeholder: 'example...',
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

  const setDemoUser = async () => {
    setLoadingUse(true);
    setEmailValue('damianmor3005@gmail.com');
    setPassValue('Moar758849@');
    setLoadingUse(false);
  };

  const fetchLogin = async () => {
    if (!emailValue || !passValue) {
      setErrorSession('Please enter an email and a password.');
      return;
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

        fetchTransactions(userData.response.correo)
        fetchCardsForTokens(userData.response.correo)
        router.replace(`/(tabs)/`);
        
      } else {
        setErrorSession('Please check your email and password, or try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorSession('Please check your email and password, or try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCardsForTokens = async (correo:string) => {
    await useFetch(
      'https://zttizctjsl.execute-api.us-east-1.amazonaws.com/backend/account/cards/email',
      { correo },
      'POST'
    ).then((data) => {
      const newCards = data.cuentas.map((card: any) => ({
        id: card.account_id,
        balance: card.balances.current,
        name: card.name,
        type: card.type,
        accent: card.accent,
      }));
      setCards(newCards);
    });
  };

  const fetchTransactions = async (correo:string) => {
    try {
      const data = await useFetch(
        'https://zttizctjsl.execute-api.us-east-1.amazonaws.com/backend/transactions/email',
        { correo },
        'POST'
      );
  
      if (data && data.transacciones) {
        // Formatear las transacciones
        const formattedTransactions: PlaidTransaction[] = data.transacciones
          .flat()
          .map((transaction: any) => ({
            date: transaction.date,
            amount: transaction.amount,
            logo_url: transaction.logo_url,
            merchant_name: transaction.merchant_name,
            name: transaction.name,
            category: Array.isArray(transaction.category) ? transaction.category : [],
            mainCategory: transaction.mainCategory || "Others",
          }));
  
        console.log(data);
        console.log(data.transacciones);
        // Filtrar las transacciones
        const filteredData = filterTransactions(formattedTransactions);
        setTransacciones(filteredData);
      } else {
        new Error('No se encontraron transacciones')
      }
  
    } catch (error) {
      console.error('Error al obtener las transacciones:', error);
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
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <View style={styles.cont}>
              <Image
                source={require('@/assets/images/log-reg/backLog.png')}
                style={styles.login_image}
              />
            </View>

            <View style={styles.container}>
              <Text style={styles.title}>
                Welcome back! {"\n"}Sign in to your account
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
                onPress={fetchLogin}
                disabled={loading}
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

              <Pressable
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                onPress={() => router.navigate(`/register`)}
                disabled={loading}
              >
                <Text style={styles.registerText}>Create a new account</Text>
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
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  cont: {
    height: 250,
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
  demoCont: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  try: {
    fontSize: 15,
    color: '#000',
    marginRight: 8,
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
