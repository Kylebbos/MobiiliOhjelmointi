import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { getDatabase, ref, push, onValue, remove } from 'firebase/database';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import { format } from 'date-fns';
import app from './FirebaseConfig';

const database = getDatabase(app);

export default function FillUp() {
  const [fillUp, setFillUp] = useState({
    fuelType: '',
    amount: '',
    price: '',
    odometer: '',
    date: '',
    vehicleId: null
  });

  const [fillUps, setFillUps] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [kmPerLiter, setKmPerLiter] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      onValue(ref(database, '/fillUps'), (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const fillUpsWithId = Object.entries(data).map(([id, fillUp]) => ({
            id,
            ...fillUp
          }));
          setFillUps(fillUpsWithId);
        } else {
          setFillUps([]);
        }
      });
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      onValue(ref(database, '/vehicles'), (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const vehiclesWithId = Object.entries(data).map(([id, vehicle]) => ({
            id,
            ...vehicle
          }));
          setVehicles(vehiclesWithId);
        } else {
          setVehicles([]);
        }
      });
    };

    fetchData();
  }, []);

  const calculateKmPerLiter = () => {
    if (fillUps.length >= 2 && selectedVehicle) {
      const vehicleFillUps = fillUps.filter(item => item.vehicleId === selectedVehicle.id);
      if (vehicleFillUps.length >= 2) {
        const lastTwoFillUps = vehicleFillUps.slice(0, 2);
        const lastTwoOdometer = lastTwoFillUps.map(item => parseFloat(item.odometer));
        const lastTwoAmount = lastTwoFillUps.map(item => parseFloat(item.amount));
        if (lastTwoOdometer[1] > lastTwoOdometer[0] && lastTwoAmount[0] > 0) {
          return ((lastTwoOdometer[1] - lastTwoOdometer[0]) / lastTwoAmount[0]).toFixed(2);
        }
      }
    }
    return null;
  };

  useEffect(() => {
    const kmPerLiter = calculateKmPerLiter();
    setKmPerLiter(kmPerLiter);
  }, [fillUps, selectedVehicle]);  

  const handleSave = () => {
    const filledUpData = { ...fillUp, vehicleId: selectedVehicle.id }; // Associate the selected vehicle's ID with the fill-up entry
    push(ref(database, '/fillUps'), filledUpData);
    setFillUp({
      fuelType: '',
      amount: '',
      price: '',
      odometer: '',
      date: '',
      vehicleId: null
    });
  };

  const handleDelete = (fillUpId) => {
    remove(ref(database, `/fillUps/${fillUpId}`));
  };

  const handleCancel = () => {
    setFillUp({
      fuelType: '',
      amount: '',
      price: '',
      odometer: '',
      date: '',
      vehicleId: null
    });
    setSelectedDate('');
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedVehicle}
        onValueChange={(itemValue) => setSelectedVehicle(itemValue)}
        style={styles.picker}>
        {vehicles.map((vehicle) => (
          <Picker.Item key={vehicle.id} label={`${vehicle.make} ${vehicle.model}`} value={vehicle} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        value={fillUp.fuelType}
        onChangeText={value => setFillUp({ ...fillUp, fuelType: value })}
        placeholder='Fuel Type'
      />
      <TextInput
        style={styles.input}
        value={fillUp.amount}
        onChangeText={value => setFillUp({ ...fillUp, amount: value })}
        placeholder='Amount (in litres)'
        keyboardType='numeric'
      />
      <TextInput
        style={styles.input}
        value={fillUp.price}
        onChangeText={value => setFillUp({ ...fillUp, price: value })}
        placeholder='Price'
        keyboardType='numeric'
      />
      <TextInput
        style={styles.input}
        value={fillUp.odometer}
        onChangeText={value => setFillUp({ ...fillUp, odometer: value })}
        placeholder='Odometer Reading'
        keyboardType='numeric'
      />
      {showCalendar && (
        <Calendar
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: 'blue' }
          }}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            setFillUp((prevFillUp) => ({
              ...prevFillUp,
              date: day.dateString
            }));
            setShowCalendar(false);
          }}
        />
      )}
      <TouchableOpacity onPress={() => {
        Keyboard.dismiss();
        setShowCalendar(true);
      }}>
        <TextInput
          style={styles.input}
          value={selectedDate}
          placeholder='Date'
          editable={false}
        />
      </TouchableOpacity>

      {kmPerLiter !== null && (
        <Text style={styles.kmPerLiterText}>Current km/l: {kmPerLiter}</Text>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={handleSave} color="pink" />
        <Button title="Cancel" onPress={handleCancel} color="gray" />
      </View>

      <FlatList
        data={fillUps.filter(item => item.vehicleId === selectedVehicle?.id).reverse()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer} key={item.id}>
            <Text>{item.fuelType} - {item.amount} L - {item.price}€ - {item.odometer} km - {format(new Date(item.date), 'dd.MM.yyyy')}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.deleteLink}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  picker: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  deleteLink: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  kmPerLiterText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});