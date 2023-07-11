import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';

import { LIGHT_GREEN, WHITE } from '../constants/colors';

import AppIcon from './AppIcon';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
        <View style={styles.expRow}>
          <Text style={styles.expText}>exp.</Text>
          <Text style={styles.expDateText}>{expDate}</Text>
        </View>
        <Text style={styles.securityCodeText}>{securityCode}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingHorizontal: screenWidth * 0.04,
    paddingTop: screenHeight * 0.02,
    marginHorizontal: screenWidth * 0.02,
    borderRadius: screenWidth * 0.02,
    borderWidth: screenWidth * 0.001,
    backgroundColor: LIGHT_GREEN,
    borderColor: WHITE
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: screenHeight * 0.02,
  },
  bankText: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    fontSize: screenWidth * 0.05,
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
    fontSize: screenWidth * 0.06,
    fontWeight: 'bold',
    color: 'white'
  },
  expRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  expText: {
    fontSize: screenWidth * 0.035,
    color: 'white'
  },
  expDateText: {
    marginLeft: screenWidth * 0.01,
    fontSize: screenWidth * 0.045,
    color: 'white'
  },
  securityCodeText: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    fontSize: screenWidth * 0.045,
    color: 'white'
  },
});

export default AppCardCredential;
