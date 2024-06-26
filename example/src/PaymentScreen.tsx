import * as React from 'react';
import { Platform } from 'react-native';
import { StyleSheet, View, Button, Text } from 'react-native';
import { useHyper } from 'hyperswitch-sdk-react-native';
import HeadlessExampleComponent from './HeadlessExampleComponent';

export default function PaymentScreen() {
  const { initPaymentSession, presentPaymentSheet } = useHyper();

  const [response, setResponse] = React.useState('');

  const fetchPaymentParams = async () => {
    const response = await fetch(
      Platform.OS == 'ios'
        ? `http://localhost:4242/create-payment-intent`
        : `http://10.0.2.2:4242/create-payment-intent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: [{ id: 'xl-tshirt' }] }),
      }
    );
    const val = await response.json();

    return val;
  };

  const initializePaymentSheet = async () => {
    const { clientSecret, customerId, ephemeralKey } =
      await fetchPaymentParams();

    console.log('clientSecret', clientSecret);
    const customAppearance = {
      colors: {
        light: {
          // primary: '#00FF00',
          background: '#F5F8F9',
          // componentBackground: 'grey',
          // componentBorder: '#ff0000',
          // secondaryText: '#00FF00',
          // componentText: '#00FF00',
          // placeholderText: '#0000FF',
        },
      },
      shapes: {
        borderRadius: 15,
        borderWidth: 0,
      },
      primaryButton: {
        shapes: {
          borderRadius: 0,
          borderWidth: 0,
        },
        colors: {
          light: {
            background: '#000',
            text: '#FFF',
            border: '#000',
          },
        },
      },
      locale: 'en',
    };
    // const googlePayParams = {
    //   environment: 'test',
    //   countryCode: 'US',
    //   currencyCode: 'USD',
    // };

    const paymentSheetProps = {
      configuration: {
        appearance: customAppearance,
        // googlePay: googlePayParams,
        // customer: {
        //   id: customerId,
        //   ephemeralKeySecret: ephemeralKey,
        // },
      },
      clientSecret: clientSecret,
      // merchantDisplayName: '',
      // customer: {
      //   id: customerId,
      //   ephemeralKeySecret: ephemeralKey,
      // },
    };

    const paymentSheetParams = await initPaymentSession(paymentSheetProps);

    let res = await presentPaymentSheet(paymentSheetParams);
    const stringifiedResponse = JSON.stringify(res);
    setResponse(stringifiedResponse);
  };
  let openPaymentSheet = async () => {
    await initializePaymentSheet();
  };

  return (
    <View style={styles.container}>
      <Button title="Open PaymentSheet" onPress={openPaymentSheet} />
      <View style={{ marginTop: 10 }} />
      <Text style={{ marginTop: 40, fontWeight: 'bold', fontSize: 15 }}>
        {response}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    marginTop: 30,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
