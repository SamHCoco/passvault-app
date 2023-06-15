import React from 'react';

import { View, Image, Text, StyleSheet } from 'react-native';

const AppCredentialProvider = ({ provider }) => {
    return (
        <View style={styles.container}>
        <Image source={provider.image} style={styles.image} />
        <Text style={styles.label}>{provider.name}</Text>
        </View>
    );
    };

    const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 15,
        padding: 10,
        marginVertical: 6,
        marginHorizontal: 4
    },
    image: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    label: {
        fontSize: 12,
        color: "black"
    },
    });
export default AppCredentialProvider;