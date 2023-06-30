import React from 'react';
import { TextInput, View , StyleSheet, Platform } from 'react-native';
import { LIGHT_GREY } from '../constants/colors';

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
        borderRadius: 15,
        flexDirection: "row",
        width: '100%',
        padding: 15,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: LIGHT_GREY
    },
    text: {
        fontSize: 22,
        fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir"
    }
})

export default AppTextInput;