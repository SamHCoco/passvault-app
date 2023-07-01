import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Dimensions, Text } from 'react-native';
import AppIcon from '../components/AppIcon';
import { LIGHT_GREEN, LIGHT_GREY, WHITE, BLACK } from '../constants/colors';
import AppRoundTouchable from '../components/AppRoundTouchable';
import AppAlert from '../components/AppAlert';
import AppTextInput from '../components/AppTextInput';
import * as DocumentPicker from 'expo-document-picker';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

function BackupScreen(props) {
    const [backupKey, setBackupKey] = useState('');
    const [showBackupAlert, setShowBackupAlert] = useState(false);
    const [showRestoreAlert, setShowRestoreAlert] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleSelectFile = async () => {
        try {
          const fileResult = await DocumentPicker.getDocumentAsync({ type: '*/*' });
          if (fileResult.type === 'success') {
            setSelectedFile(fileResult.uri);
          }
        } catch (error) {
          console.log('Error selecting file:', error);
        }
      };

    const handleOpenBackupAlert = () => {
        setShowBackupAlert(true);
      };
    
    const handleCloseBackupAlert = () => {
        setShowBackupAlert(false);
    };

    const handleOpenRestoreAlert = () => {
        setShowRestoreAlert(true);
    }

    const handleCloseRestoreAlert = () => {
        setShowRestoreAlert(false);
    }

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
                <TouchableOpacity style={styles.keyButton} onPress={() =>setBackupKey('')}>
                <AppIcon name="window-close" size={25} color={BLACK} library="material" />
                </TouchableOpacity>
            </View>
            

            <View style={styles.row}>
                <AppRoundTouchable iconName="file-restore" 
                                    // iconSize={45} 
                                    // iconColor={WHITE} 
                                    // iconLibrary="material" 
                                    touchableStyle={styles.touchableStyle}
                                    textStyle={styles.textStyle}
                                    text="Backup"
                                    onPress={() => handleOpenBackupAlert()}
                />
                                    
                <AppRoundTouchable text="Restore" 
                                   style={styles.touchableStyle} 
                                //    iconColor={WHITE}
                                   touchableStyle={styles.touchableStyle}
                                   textStyle={styles.textStyle}
                                   onPress={handleOpenRestoreAlert}/>
            </View>
            <AppAlert visible={showBackupAlert} onClose={handleCloseBackupAlert}> 
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>Create Backup</Text>
                </View>
                <AppTextInput placeholder="Enter backup name" />
                <View style={styles.touchableButtonContainer}>
                    <AppRoundTouchable text="Backup" touchableStyle={styles.touchableButtonStyle} />
                </View>
            </AppAlert>
            
            <AppAlert visible={showRestoreAlert} onClose={handleCloseRestoreAlert}> 
            <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Restore Backup</Text>
          </View>
            <View style={styles.fileSelectionContainer}>
                <Text style={styles.selectedFileText}>{selectedFile ? selectedFile : 'No file selected'}</Text>
                <AppRoundTouchable
                text="Select"
                touchableStyle={styles.selectFileButton}
                onPress={handleSelectFile}
                />
            </View>
            <View style={styles.touchableButtonContainer}>
                <AppRoundTouchable text="Restore" touchableStyle={styles.touchableButtonStyle} />
            </View>
            </AppAlert>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: WHITE
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    titleText: {
        fontSize: 21,
        fontWeight: 'bold',
        color: LIGHT_GREEN
    },
    touchableButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    touchableButtonStyle: {
        width: screenWidth * 0.25,
        height: screenWidth * 0.25,
        borderRadius: screenWidth * 0.25, // Make it circular
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: LIGHT_GREEN,
        backgroundColor: LIGHT_GREEN,
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
    fileSelectionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    selectedFileText: {
        flex: 1,
        marginRight: 8,
    },
    selectFileButton: {
        width: 100,
        height: 25,
        borderRadius: 8,
        backgroundColor: LIGHT_GREEN,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default BackupScreen;
