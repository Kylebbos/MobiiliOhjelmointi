import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import * as Location from 'expo-location';

const API_KEY = 'AIzaSyDQZdpTXHM4TbJZhfXHAR5CvYpVilJZ8iM';

export default function Map() {
  const [gasStations, setGasStations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserLocationAndGasStations = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('No permission to access location');
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.coords.latitude},${location.coords.longitude}&radius=4000&type=gas_station&key=${API_KEY}`);
        setGasStations(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchUserLocationAndGasStations();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.4,
            longitudeDelta: 0.4,
          }}
          showsUserLocation={true}
        >
          {gasStations.map((station, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: station.geometry.location.lat, longitude: station.geometry.location.lng }}
              title={station.name}
              description={station.vicinity}
              pinColor="blue"
            />
          ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
