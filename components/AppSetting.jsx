import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Dimensions } from 'react-native';
import { LIGHT_GREY } from '../constants/colors';

const { width: screenWidth } = Dimensions.get('window');

function AppSetting({ title, settingName, onPress }) {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.sectionContainer}>
                <TouchableOpacity onPress={onPress}>
                    <Text style={styles.item}>{settingName}</Text>
                </TouchableOpacity>
            </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: LIGHT_GREY
  },
  sectionTitle: {
    fontSize: screenWidth * 0.0438,
    fontWeight: 'bold',
    marginBottom: screenWidth * 0.0243,
  },
  sectionContainer: {
    borderWidth: screenWidth * 0.0024,
    borderColor: '#ccc',
    padding: screenWidth * 0.0243,
    borderRadius: screenWidth * 0.0122,
  },
  item: {
    fontSize: screenWidth * 0.0388,
    paddingVertical: screenWidth * 0.0194,
  },
});

export default AppSetting;