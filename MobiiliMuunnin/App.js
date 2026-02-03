import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [result, setResult] = useState('');
  const [currencies, setCurrencies] = useState([]);
  const [ratesData, setRatesData] = useState(null);
  const API_KEY = 'H4uXs1k09WIcEfGebS8XzgZ8B3M4vygL';

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      const response = await fetch(`https://api.apilayer.com/exchangerates_data/latest`, {
        headers: {
          'apikey': API_KEY
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch currencies');
      }
      const data = await response.json();
      if (!data.rates) {
        throw new Error('Rates not found in response data');
      }
      const currencies = Object.keys(data.rates);
      setCurrencies(currencies);
      setRatesData(data);
    } catch (error) {
      console.error('Error fetching currencies:', error);
    }
  }

  const convertToEuro = () => {
    try {
      if (!ratesData) {
        throw new Error('Exchange rates data not available');
      }
      const rate = ratesData.rates[currency];
      const convertedAmount = parseFloat(amount) / rate;
      const formattedResult = `${convertedAmount.toFixed(2)} €`;
      setResult(formattedResult);
    } catch (error) {
      console.error('Error converting to euro:', error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 20, marginBottom: 20}}>{result}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { borderBottomColor: 'pink', borderBottomWidth: 2 }]}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={text => setAmount(text)}
          underlineColorAndroid="transparent"
        />
        <Picker
          selectedValue={currency}
          style={{ height: 50, width: 130 }}
          onValueChange={(itemValue) => setCurrency(itemValue)}
        >
          {currencies.map((currency) => (
            <Picker.Item key={currency} label={currency} value={currency} />
          ))}
        </Picker>
      </View>
      <Button title="Convert" onPress={convertToEuro} color='pink' />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: 100,
  },
});
