import React from 'react';
import { TextInput, View , StyleSheet, Platform, Dimensions } from 'react-native';
import { LIGHT_GREY } from '../constants/colors';

const { width: screenWidth } = Dimensions.get('window');

function AppTextInput({ textAlign, ...props }) {
    return (
        <View style={styles.container}>
            <TextInput style={[styles.text, { textAlign }]} {...props}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColour: "grey",
      borderRadius: screenWidth * 0.0365,
      flexDirection: "row",
      width: '100%',
      padding: screenWidth * 0.0365,
      marginVertical: screenWidth * 0.0243,
      borderWidth: screenWidth * 0.0024,
      borderColor: LIGHT_GREY
    },
    text: {
      fontSize: screenWidth * 0.0535,
      fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir"
    }
});

export default AppTextInput;