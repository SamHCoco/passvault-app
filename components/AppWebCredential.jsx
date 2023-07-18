import React, { useState } from 'react';
import { View, StyleSheet, Text, Clipboard, ScrollView, Dimensions } from 'react-native';
import AppRoundTouchable from './AppRoundTouchable';
import AppIcon from './AppIcon';

import { BLACK, LIGHT_GREY, WHITE } from '../constants/colors';

const { width: screenWidth } = Dimensions.get('window');

function AppWebCredential({ username, password }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
  };

  const iconSize = screenWidth * 0.0462;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <AppIcon name="md-person" size={screenWidth * 0.0608} color={LIGHT_GREY} library="ion" iconStyle={{ marginHorizontal: 3 }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Text style={styles.text}>{username}</Text>
        </ScrollView>
        <View style={styles.alignRight}>
          <AppRoundTouchable
            iconName="copy-outline"
            iconLibrary="ion"
            iconSize={iconSize}
            iconColor="black"
            touchableStyle={styles.touchable}
            onPress={() => copyToClipboard(username)}
          />
        </View>
      </View>
      <View style={styles.row}>
        <AppIcon name="lock-closed" size={screenWidth * 0.0608} color={LIGHT_GREY} library="ion" iconStyle={{ marginHorizontal: 3 }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Text style={styles.text}>{passwordVisible ? password : '•••••••••••••'}</Text>
        </ScrollView>
        <View style={styles.alignRight}>
          <AppRoundTouchable
            iconName="eye-outline"
            iconLibrary="ion"
            iconSize={iconSize}
            iconColor={BLACK}
            onPress={togglePasswordVisibility}
            touchableStyle={styles.touchable}
          />
          <AppRoundTouchable
            iconName="copy-outline"
            iconLibrary="ion"
            iconSize={iconSize}
            iconColor="black"
            touchableStyle={styles.touchable}
            iconStyle={styles.icon}
            onPress={() => copyToClipboard(password)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    borderWidth: 0,
    borderColor: WHITE,
    borderBottomWidth: screenWidth * 0.0024,
    marginHorizontal: screenWidth * 0.0146,
    marginVertical: 0,
    borderRadius: screenWidth * 0.0170,
    backgroundColor: "white",

  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginVertical: screenWidth * 0.0122,
  },
  text: {
    marginRight: screenWidth * 0.0243,
    color: 'black',
    fontSize: screenWidth * 0.0486,
  },
  touchable: {
    width: screenWidth * 0.0608,
    height: screenWidth * 0.0608,
    borderRadius: screenWidth * 0.1825,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'gray',
    marginHorizontal: screenWidth * 0.0073,
  },
  icon: {
    alignSelf: 'center',
  },
  alignRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default AppWebCredential;
