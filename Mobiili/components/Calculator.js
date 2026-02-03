import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const Calculator = ({ setHistory, history }) => {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [result, setResult] = useState('');

  const plus = () => {
    const newResult = parseFloat(num1) + parseFloat(num2);
    setResult(newResult);
    addHistory(`${num1} + ${num2} = ${newResult}`);
  }

  const minus = () => {
    const newResult = parseFloat(num1) - parseFloat(num2);
    setResult(newResult);
    addHistory(`${num1} - ${num2} = ${newResult}`);
  }

  const addHistory = (entry) => {
    setHistory((prevHistory) => [...prevHistory, entry]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.result}>Result: {result}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter first number"
        keyboardType="numeric"
        onChangeText={text => setNum1(text)}
        value={num1}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter second number"
        keyboardType="numeric"
        onChangeText={text => setNum2(text)}
        value={num2}
      />
      <View style={styles.buttonContainer}>
        <Button title="+" onPress={plus} color="pink" />
        <Button title="-" onPress={minus} color="pink" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  input: {
    width: 200,
    borderColor: 'grey',
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
  },
  result: {
    fontSize: 20,
    marginTop: 50,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '30%',
    marginBottom: 20,
  },
});

export default Calculator;
