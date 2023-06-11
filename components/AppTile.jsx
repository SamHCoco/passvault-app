import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function Tile({ data }) {
  return (
    <View style={styles.container}>
      <Text>ID: {data.id}</Text>
      <Text>Username: {data.username}</Text>
      <Text>Password: {data.password}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#cccccc',
  },
});

export default Tile;
