import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { LIGHT_GREY } from '../constants/colors';

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
        justifyContent: 'center',
        backgroundColor: LIGHT_GREY
      },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      sectionContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
      },
      item: {
        fontSize: 16,
        paddingVertical: 8,
      },
})

export default AppSetting;