import { useState, useEffect } from 'react';
import { View, Button, Platform, StyleSheet, Text } from 'react-native';
import {
  useHyper,
  type InitPaymentSessionParams,
  type InitPaymentSessionResult,
  type PresentPaymentSheetParams,
  type PresentPaymentSheetResult,
} from 'hyperswitch-sdk-react-native';

export default function PaymentScreen() {
  const { initPaymentSession, presentPaymentSheet } = useHyper();
  const [status, setStatus] = useState<string | null | undefined>(null);
  const [isReloadNeeded, setIsReloadNeeded] = useState(false);
  const [message, setMessage] = useState<string | null | undefined>(null);
  const createPaymentIntent = async (): Promise<string> => {
    try {
      const baseUrl =
        Platform.OS === 'android'
          ? 'http://10.0.2.2:5252'
          : 'http://localhost:5252';
      const response = await fetch(`${baseUrl}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 2000, // $20.00 in cents
          currency: 'USD',
          description: 'Example payment',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      return data.client_secret;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  };
  const setup = async (): Promise<void> => {
    try {
      const paymentIntent = await createPaymentIntent();

      const params: InitPaymentSessionParams = {
        paymentIntentClientSecret: paymentIntent,
      };

      const result: InitPaymentSessionResult = await initPaymentSession(params);

      if (result.error) {
        setIsReloadNeeded(true);
        setStatus(`Initialization failed: ${result.error}`);
        console.error('Payment session initialization failed:', result.error);
      } else {
        setIsReloadNeeded(false);
        setMessage('');
        setStatus('');
      }
    } catch (error) {
      console.error('Setup failed:', error);
    }
  };
  useEffect(() => {
    setup();
  }, [setup, initPaymentSession]);

  const checkout = async (): Promise<void> => {
    try {
      const options: PresentPaymentSheetParams = {
        appearance: {
          theme: 'Dark',
        },
      };

      const result: PresentPaymentSheetResult =
        await presentPaymentSheet(options);
      if (result.error) {
        console.error('Payment failed:', JSON.stringify(result.error));
        setStatus(`Payment failed: ${JSON.stringify(result.error)}`);
      } else {
        setStatus(result.status);
        setMessage(`${result.message}`);
        console.log('Payment completed with status:', result.status);
        console.log('Message:', result.message);
      }
    } catch (error: any) {
      setMessage(`${error.message}`);
      setStatus(`Checkout failed: ${JSON.stringify(error.message)}`);
      console.error('Checkout failed:', error);
    }
    setIsReloadNeeded(true);
  };

  return (
    <View style={styles.container}>
      {!isReloadNeeded && <Button title="Checkout" onPress={checkout} />}
      {isReloadNeeded && <Button title="Restart" onPress={setup} />}
      {message && <Text>{message}</Text>}
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  statusText: {
    marginTop: 16,
    fontSize: 24,
    color: 'gray',
    textAlign: 'center',
  },
});
