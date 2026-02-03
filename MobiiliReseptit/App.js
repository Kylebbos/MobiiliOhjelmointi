import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, FlatList, ActivityIndicator, Image } from 'react-native';

export default function App() {
  const [ingredient, setIngredient] = useState('');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMeals = () => {
    setLoading(true);
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
    .then(response => {
      if (!response)
        throw new Error('Error in fetch: ' + response.statusText);

      return response.json();
    })
    .then(data => {
      setMeals(data.meals);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    })
  }

  if (loading) {
    return(
      <View style={styles.container}>
        <ActivityIndicator size="large"/>
      </View>)
  }
  else {
      return (
        <View style={styles.container}>
          <View style={{ marginTop: 50, flex: 1}}>
            <TextInput
              placeholder='Type ingredient'
              value={ingredient}
              onChangeText={text => setIngredient(text)}
            />
            <Button title='Find' onPress={fetchMeals} />
          </View>
          <View style={{flex: 6, flexDirection: 'row'}}>
            <FlatList
              data={meals}
              renderItem={({ item }) => 
                <View style={{ margin: 9 }}>
                  <Text style={{ fontSize: 13 }}>{item.strMeal}</Text>
                  <Image source={{ uri: item.strMealThumb }} style={{ width: 140, height: 140 }} />
                </View>
              }
              keyExtractor={(item) => item.idMeal}
              style={{flexGrow: 1}}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: 'pink' }} />}
            />
          </View>
          <StatusBar style="auto" />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
