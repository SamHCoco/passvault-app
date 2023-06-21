import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import AppIcon from './AppIcon';

function AppCardCredential({ bank, cardNumber, expDate, securityCode }) {
  return (
    <View style={styles.container}>
      {/* First Row */}
      <View style={styles.row}>
        <Text style={styles.bankText}>{bank}</Text>
        <AppIcon name="contactless-payment" library="material" style={styles.appIcon} />
      </View>

      {/* Second Row */}
      <View style={styles.row}>
        <Text style={styles.cardNumberText}>{cardNumber}</Text>
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  bankText: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
  },
  appIcon: {
    alignSelf: 'flex-end',
    textAlign: 'right',
  },
  cardNumberText: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    fontSize: 16,
  },
  expText: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    fontSize: 16,
  },
  expDateText: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    fontSize: 16,
  },
  securityCodeText: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    fontSize: 16,
  },
});

export default AppCardCredential;