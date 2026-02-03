import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const History = ({ history }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.historyTitle}>History</Text>
      <FlatList
        style={styles.flatList}
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text>{item}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  historyTitle: {
    fontSize: 20,
    marginTop: 10,
  },
  flatList: {
    marginVertical: 10,
  },
});

export default History;
