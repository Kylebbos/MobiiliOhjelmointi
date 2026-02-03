import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button, TextInput, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [address, setAddress] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [enteredLocation, setEnteredLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('No permission to get location');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
    })();
  }, []);

  const handleShowAddressOnMap = async () => {
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter an address');
      return;
    }

    try {
      const apiUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(address)}&api_key=65dc6ac1748f0324878406ejteecdd3`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data && data.length > 0 && data[0].lat && data[0].lon) {
        const latitude = parseFloat(data[0].lat);
        const longitude = parseFloat(data[0].lon);
        setEnteredLocation({ latitude, longitude });
      } else {
        Alert.alert('Error', 'Address not found');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      Alert.alert('Error', 'Failed to fetch coordinates');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: userLocation ? userLocation.coords.latitude : 60.1695,
          longitude: userLocation ? userLocation.coords.longitude : 24.9354,
          latitudeDelta: 0.4,
          longitudeDelta: 0.4,
        }}
      >
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            title="Your Location"
            pinColor="plum"
          />
        )}
        {enteredLocation && (
          <Marker
            coordinate={enteredLocation}
            title={address}
            pinColor="red"
          />
        )}
      </MapView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter address"
          value={address}
          onChangeText={setAddress}
        />
        <Button
          title="Show"
          onPress={handleShowAddressOnMap}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    elevation: 4,
  },
  input: {
    flex: 1,
    marginRight: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
  },
});
