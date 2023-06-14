import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

function Tile({ data }) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="user" size={20} color="dodgerblue" />
      <Text>Username: {data.username}</Text>
      <MaterialCommunityIcons name="lock" size={20} color="dodgerblue" />
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
