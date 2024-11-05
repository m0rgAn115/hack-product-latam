import React, { useEffect, useState } from 'react';
import PlaidLink from '@/components/Plaid/PlaidLink'
import { Text } from 'react-native';

export default function App() {

  const [linkToken, setLinkToken] = useState(null);

  useEffect(() => {
    const createLinkToken = async () => {
      const response = await fetch('https://6vy6af7h6j.execute-api.us-east-1.amazonaws.com/Prod/api/create_link_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setLinkToken(data.link_token); // Asigna el token de enlace recibido
    };

    createLinkToken();
  }, []);

  if (!linkToken) {
    return <Text>Loading...</Text>; // Muestra un mensaje de carga mientras se genera el token
  }

  return (
    <PlaidLink
      linkToken={linkToken}
      onEvent={(event) => console.log(event)}
      onExit={(exit) => console.log(exit)}
      onSuccess={(success) => console.log(success.publicToken)}
    />
  )
}