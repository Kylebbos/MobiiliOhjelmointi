import React, { useState, useEffect } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { getDatabase, ref, push, onValue, remove } from 'firebase/database';
import app from './FirebaseConfig';

const database = getDatabase(app);

export default function AddVehicle() {
  const [vehicle, setVehicle] = useState({
    make: '',
    model: '',
  });

  const [vehicles, setVehicles] = useState([]);

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

  const handleSave = () => {
    push(ref(database, '/vehicles'), vehicle);
    setVehicle({
      make: '',
      model: '',
    });
  };

  const handleDelete = (vehicleId) => {
    remove(ref(database, `/vehicles/${vehicleId}`));
  };

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={[{ key: 'vehicleForm' }, ...vehicles]}
      renderItem={({ item }) => {
        if (item.key === 'vehicleForm') {
          return (
            <>
              <TextInput
                style={styles.input}
                value={vehicle.make}
                onChangeText={value => setVehicle({ ...vehicle, make: value })}
                placeholder='Vehicle Make'
              />
              <TextInput
                style={styles.input}
                value={vehicle.model}
                onChangeText={value => setVehicle({ ...vehicle, model: value })}
                placeholder='Vehicle Model'
              />
              <View style={styles.buttonContainer}>
                <Button title="Save" onPress={handleSave} color="pink" />
              </View>
            </>
          );
        } else {
          return (
            <View style={styles.itemContainer} key={item.id}>
              <Text>{item.make} - {item.model}</Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteLink}>Delete</Text>
              </TouchableOpacity>
            </View>
          );
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
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
});