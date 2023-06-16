import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

function Tile({ data }) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="email" size={20} color="black" />
      <Text>{data.username}</Text>
      <MaterialCommunityIcons name="lock" size={20} color="dodgerblue" />
      <Text>{data.password}</Text>
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
