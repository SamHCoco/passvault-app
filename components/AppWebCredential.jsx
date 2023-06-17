import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import AppRoundTouchable from './AppRoundTouchable';

function AppWebCredential(props) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const password = 'password1';

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const iconSize = 25; // Set the desired icon size

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.text}>samuel.coco@email.co.uk</Text>
        <View style={styles.alignRight}>
          <AppRoundTouchable
            iconName="copy-outline"
            iconLibrary="ion"
            iconSize={iconSize}
            iconColor="black"
            touchableStyle={styles.touchable}
          />
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>{passwordVisible ? password : '•••••••••••••'}</Text>
        <View style={styles.alignRight}>
          <AppRoundTouchable
            iconName="eye-outline"
            iconLibrary="ion"
            iconSize={iconSize}
            iconColor="black"
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
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: 'black',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    marginRight: 10,
    color: 'black',
  },
  touchable: {
    width: 35,
    height: 35,
    borderRadius: 85,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
  },
  alignRight: {
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row'
  },
});

export default AppWebCredential;
