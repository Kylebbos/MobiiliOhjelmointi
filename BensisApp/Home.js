import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text, View, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function Home() {
  const [wallpaper, setWallpaper] = useState(null);

  const choosePhotoFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setWallpaper(result.uri);
      }
    } else {
      console.error('Library permission not granted!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 18 }}>Welcome to the Bensis application!</Text>
      <Text style={{ fontSize: 16 }}>You can see the Gas stations near you via the Map page. You can make a list of your fill ups via the list page.</Text>

      <View style={styles.buttonContainer}>
        <Button title="Set Wallpaper from Library" onPress={choosePhotoFromLibrary} />
      </View>

      {wallpaper && <Image source={{ uri: wallpaper }} style={styles.wallpaper} />}

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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  wallpaper: {
    width: '100%',
    height: 'auto',
    resizeMode: 'contain',
    marginVertical: 20,
  },
});
