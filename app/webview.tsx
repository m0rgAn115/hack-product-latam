import React, { useEffect, useState } from 'react';
import PlaidLink from '@/components/Plaid/PlaidLink'
import { View, Alert, Text } from 'react-native';
import useGetTokens from '@/hooks/useGetTokens';
import useFetch from '@/hooks/useFetch';
import { useUserStore } from '@/store/useUserStore';
import { router, useRouter } from 'expo-router';
import { useCardsStore } from '@/store/useCardStore';


const API_BASE_URL = 'https://zttizctjsl.execute-api.us-east-1.amazonaws.com/backend/';

export default function PlaidShow() {
  const [linkToken, setLinkToken] = useState(null);
  const { correo } = useUserStore(); 

  const router = useRouter();

  const handleKick = () => {
    router.navigate('/(tabs)')
  }

  const { setCards } = useCardsStore()

  useEffect(() => {
    const createLinkToken = async () => {
      const tokens = await useGetTokens()
    if (!tokens?.id_token) {
        throw new Error('No authorization token available');
        return;
    }
      

      try {
        const response = await fetch(API_BASE_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': tokens.id_token
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch the link token');
        }

        const data = await response.json();
        setLinkToken(data.link_token);

      } catch (error) {
        console.error('Error fetching link token:', error);
        Alert.alert(
          'Connection Error',
          'Unable to fetch link token. Please try again later.',
          [{ text: 'OK' }]
        );
      }
    };

    createLinkToken();
  }, []);

  if (!linkToken) {
    return <Text>Loading...</Text>;
  }

  const handleSuccess = async (success:any) => {
      const tokens = await useGetTokens()
    if (!tokens?.id_token) {
        throw new Error('No authorization token available');
        return;
    }

    console.log()
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': tokens.id_token
        },
        body: JSON.stringify({
          publicToken: success.publicToken,
          metadata: success.metadata,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post data');
      }

      const data = await response.json();
      const bodyData = JSON.parse(data.body);
      console.log('token:', bodyData.accessToken);

      console.log('Server response:', bodyData);
      console.log('token:', bodyData.accessToken);

      useFetch('https://zttizctjsl.execute-api.us-east-1.amazonaws.com/backend/dynamo', 
        {
          "correo": correo,
          "accessToken": bodyData.accessToken
        },
        'PUT'
      ).then((res) => {
        fetchCardsForTokens(correo)
        Alert.alert(
          'Account Connected',
          'The account was connected successfully!',
          [{ text: 'OK' }]

        );
        
        router.navigate('/(tabs)')
      })

    } catch (error) {
      console.error('Error during data submission:', error);
      Alert.alert(
        'Connection Error',
        'Unable to connect. Please try again later.',
        [{ text: 'OK' }]
      );
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

  return (
    
    <PlaidLink
      linkToken={linkToken}
      onEvent={(event: any) => console.log('Plaid event:', event)}
      onExit={(exit: any) => handleKick()}
      onSuccess={(success: any) => handleSuccess(success)}
      onEvent={(event:any) => console.log('Plaid event:', event)}
      onExit={(exit:any) => console.log('Plaid exit:', exit)}
      onSuccess={(success:any) => handleSuccess(success)}
    />
  )
}