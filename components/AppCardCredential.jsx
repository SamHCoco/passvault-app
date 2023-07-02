import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { LIGHT_GREEN, WHITE, LIGHT_GREY } from '../constants/colors';

import AppIcon from './AppIcon';

function formatCardNumber(cardNumber) {
  const formattedNumber = cardNumber.replace(/\s/g, ''); // Remove existing spaces
  const chunks = [];
  let index = 0;

  while (index < formattedNumber.length) {
    chunks.push(formattedNumber.substr(index, 4));
    index += 4;
  }

  return chunks.join('  ');
}

function AppCardCredential({ bank, cardNumber, expDate, securityCode }) {
  const formattedCardNumber = formatCardNumber(cardNumber);

  return (
    <View style={styles.container}>
      {/* First Row */}
      <View style={styles.row}>
        <Text style={styles.bankText}>{bank}</Text>
        <AppIcon name="contactless-payment" library="material" color='white' size={50} style={styles.appIcon} />
      </View>

      {/* Second Row */}
      <View style={styles.row}>
        <Text style={styles.cardNumberText}>{formattedCardNumber}</Text>
      </View>

      {/* Third Row */}
      <View style={styles.row}>
        <Text style={styles.expText}>exp.</Text>
        <Text style={styles.expDateText}>{expDate}</Text>
        <Text style={styles.securityCodeText}>{securityCode}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginHorizontal: 8,
    borderRadius: 10,
    marginVertical: 3,
    borderWidth: 2,
    backgroundColor: LIGHT_GREEN,
    borderColor: LIGHT_GREY
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  bankText: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    fontSize: 19,
    fontWeight: 'bold',
    color: 'white'
  },
  appIcon: {
    alignSelf: 'flex-end',
    textAlign: 'right'
  },
  cardNumberText: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white'
  },
  expText: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    fontSize: 16,
    color: 'white'
  },
  expDateText: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    fontSize: 21,
    color: 'white'
  },
  securityCodeText: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    fontSize: 21,
    color: 'white'
  },
});

export default AppCardCredential;