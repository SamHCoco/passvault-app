import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';

function AppIcon({ name, size, color, library, iconStyle }) {
  let IconComponent = MaterialCommunityIcons; // Default to MaterialCommunityIcons

  if (library) {
    if (library === 'material') {
      IconComponent = MaterialCommunityIcons;
    } else if (library === 'ion') {
      IconComponent = Ionicons;
    } else if (library === 'materialIcon') {
      IconComponent = MaterialIcons;
    }
  }

  return (
    <View style={iconStyle}>
      <IconComponent name={name} size={size} color={color} />
    </View>
  );
}

export default AppIcon;
