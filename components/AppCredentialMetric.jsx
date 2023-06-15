import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const AppCredentialMetric = ({ image, text, subText }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image source={image} style={styles.image} />
      </View>
      <View style={styles.labels}>
        <Text style={styles.label}>{text}</Text>
        <Text style={styles.subLabel}>{subText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    padding: 3,
    flexDirection: "row"
  },
  labels: {
    flexDirection: "column"
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
