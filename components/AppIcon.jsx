import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

function AppIcon({ name, size, color, library, iconStyle }) {
    const IconComponent = library === 'material' ? MaterialCommunityIcons : Ionicons;
    return (
        <View style={iconStyle}>
            <IconComponent name={name} size={size} color={color} />
        </View>
    );
}

export default AppIcon;