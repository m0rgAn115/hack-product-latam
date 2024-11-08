import React, { useEffect, useState } from 'react';
import PlaidLink from '@/components/Plaid/PlaidLink'
import { View, Alert, Text } from 'react-native';

const API_BASE_URL = 'https://zttizctjsl.execute-api.us-east-1.amazonaws.com/lazy-devs-plaid/';

export default function PlaidShow() {
  const [linkToken, setLinkToken] = useState(null);

  useEffect(() => {
    const createLinkToken = async () => {
      try {
        const response = await fetch(API_BASE_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
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

  const handleSuccess = async (success) => {

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      console.log('Server response:', data);
    } catch (error) {
      console.error('Error during data submission:', error);
      Alert.alert(
        'Connection Error',
        'Unable to connect. Please try again later.',
        [{ text: 'OK' }]
      );
    }

  };

  return (
    
    <PlaidLink
      linkToken={linkToken}
      onEvent={(event) => console.log('Plaid event:', event)}
      onExit={(exit) => console.log('Plaid exit:', exit)}
      onSuccess={(success) => handleSuccess(success)}
    />
  )
}