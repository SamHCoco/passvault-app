import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

function Tile({ data }) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="email" size={screenWidth * 0.0487} color="black" />
      <Text>{data.username}</Text>
      <MaterialCommunityIcons name="lock" size={screenWidth * 0.0487} color="dodgerblue" />
      <Text>{data.password}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: screenWidth * 0.0243,
    margin: screenWidth * 0.0243, 
    borderRadius: screenWidth * 0.0122,
    borderWidth: screenWidth * 0.0024,
    borderColor: '#cccccc',
  },
});

export default Tile;
