import React, { useState } from 'react';
import { View, StyleSheet, Text, Clipboard, ScrollView } from 'react-native';
// import { Clipboard } from '@react-native-community/clipboard';
import AppRoundTouchable from './AppRoundTouchable';
import AppIcon from './AppIcon';

import { BLACK, LIGHT_GREEN, LIGHT_GREY, WHITE } from '../constants/colors';

function AppWebCredential({ username, password }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
  };

  const iconSize = 19; // Set the desired icon size

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <AppIcon name="md-person" size={25} color={LIGHT_GREY} library="ion" iconStyle={{ marginHorizontal: 3 }} />
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
        <AppIcon name="lock-closed" size={25} color={LIGHT_GREY} library="ion" iconStyle={{ marginHorizontal: 3 }} />
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
    borderBottomWidth: 1,
    marginHorizontal: 6,
    marginVertical: 0,
    borderRadius: 7,
    // height: 87,
    backgroundColor: "white"
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginVertical: 5,
  },
  text: {
    marginRight: 10,
    color: 'black',
    fontSize: 20,
  },
  touchable: {
    width: 25,
    height: 25,
    borderRadius: 75,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'gray',
    marginHorizontal: 3,
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
