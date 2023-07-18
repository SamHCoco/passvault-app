import React from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LIGHT_GREEN } from '../constants/colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

function AppAlert({ visible, onClose, children }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={screenWidth * 0.0584} color="black" />
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
    borderRadius: screenWidth * 0.0243,
    padding: screenWidth * 0.0388,
    width: screenWidth * 0.1941,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: screenWidth * 0.0194,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: screenWidth * 0.0388,
  },
  titleText: {
    fontSize: screenWidth * 0.0511,
    fontWeight: 'bold',
    color: LIGHT_GREEN
  },
});

export default AppAlert;