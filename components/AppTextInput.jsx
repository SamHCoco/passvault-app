import React from 'react';
import { TextInput, View , StyleSheet, Platform } from 'react-native';

function AppTextInput({...props}) {
    return (
        <View style={styles.container}>
            <TextInput style={styles.text} {...props}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColour: "grey",
        borderRadius: 5,
        flexDirection: "row",
        width: '100%',
        padding: 15,
        marginVertical: 10,
        borderBottomWidth: 1
    },
    text: {
        fontSize: 18,
        fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir"
    }
})

export default AppTextInput;