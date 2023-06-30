import React from 'react';
import { View, StyleSheet } from 'react-native';

import AppIcon from '../components/AppIcon';
import { BLACK, LIGHT_GREEN } from '../constants/colors';
import AppSetting from '../components/AppSetting';

function SettingsScreen(props) {
    return (
        <View style={styles.container}>
                <AppIcon name="cog" size={95} color={LIGHT_GREEN} />
                <AppSetting title="Security" settingName="Change Pin" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    }
})

export default SettingsScreen;