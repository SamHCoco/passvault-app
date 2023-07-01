import React, { useState } from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppTextInput from './AppTextInput';
import AppRoundTouchable from './AppRoundTouchable';
import { LIGHT_GREEN, WHITE, LIGHT_GREY } from '../constants/colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

function AppAlert({ visible, onClose, children }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    width: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  titleText: {
    fontSize: 21,
    fontWeight: 'bold',
    color: LIGHT_GREEN
  },
  touchableButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableButtonStyle: {
    width: screenWidth * 0.25,
    height: screenWidth * 0.25,
    borderRadius: screenWidth * 0.25, // Make it circular
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: LIGHT_GREY,
    backgroundColor: LIGHT_GREEN,
  },
});

export default AppAlert;
