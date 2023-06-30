import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import AppIcon from '../components/AppIcon';
import { LIGHT_GREEN, LIGHT_GREY, WHITE, BLACK } from '../constants/colors';
import AppRoundTouchable from '../components/AppRoundTouchable';

function BackupScreen(props) {
    const [backupKey, setBackupKey] = useState('');

    return (
        <View style={styles.container}>
            <AppIcon name="file-restore-outline" size={95} color={LIGHT_GREEN} />
            <AppIcon name="vpn-key" size={60} color={LIGHT_GREEN} library="materialIcon" />
            <View style={styles.keyContainer}>
                <TextInput
                style={styles.keyInput}
                placeholder="Enter your backup key"
                placeholderTextColor="#999"
                value={backupKey}
                onChangeText={(text) => {
                    setBackupKey(text);
                }}
                />
                <TouchableOpacity style={styles.keyButton} onPress={() => console.log("key button pressed")}>
                <AppIcon name="md-checkmark-sharp" size={25} color={BLACK} library="ion" />
                </TouchableOpacity>
            </View>
            

            <View style={styles.row}>
                <AppRoundTouchable iconName="file-restore" 
                                    iconSize={45} 
                                    iconColor={WHITE} 
                                    iconLibrary="material" 
                                    touchableStyle={styles.touchableStyle}
                                    textStyle={styles.textStyle}
                                    text="Backup"
                                    onPress={() => console.log("Backup pressed")}
                />
                                    
                <AppRoundTouchable text="Restore" 
                                   style={styles.touchableStyle} 
                                   iconColor={WHITE}
                                   onPress={() => console.log("Restore Pressed")}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    touchableStyle: {
        width: 100,
        height: 100,
        borderRadius: 150,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: LIGHT_GREY,
        backgroundColor: WHITE,
        marginLeft: 25,
    },
    textStyle: {
        fontSize: 32
    },
    keyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 20,
        paddingLeft: 10,
        paddingRight: 5,
        backgroundColor: 'white',
        borderWidth: 0,
        marginHorizontal: 25
      },
      keyInput: {
        flex: 1,
        height: 45,
        fontSize: 16,
        color: BLACK,
        marginRight: 5,
        paddingTop: 0,
        paddingBottom: 0,
      },
      keyButton: {
        padding: 5,
      },
});

export default BackupScreen;
