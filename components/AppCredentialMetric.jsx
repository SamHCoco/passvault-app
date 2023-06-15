import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const AppCredentialMetric = ({ image, text, subText }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>{text}</Text>
        <Image source={image} style={styles.image} />
      </View>
      <Text style={styles.subLabel}>{subText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    padding: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  image: {
    width: 50,
    height: 50,
  },
  subLabel: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default AppCredentialMetric;
