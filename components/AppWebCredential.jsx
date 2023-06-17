import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import AppRoundTouchable from './AppRoundTouchable';

function AppWebCredential(props) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const password = 'password1';

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const iconSize = 19; // Set the desired icon size

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
    marginHorizontal: 2
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
  },
  touchable: {
    width: 25,
    height: 25,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
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
