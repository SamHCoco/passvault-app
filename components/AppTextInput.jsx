import React, { useRef} from 'react';
import { TextInput, View , StyleSheet, Platform, Dimensions } from 'react-native';
import { LIGHT_GREY, WHITE } from '../constants/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { width: screenWidth } = Dimensions.get('window');

function AppTextInput({ textAlign, inputWidth, ...props }) {
    const inputRef = useRef(null);

    const handleInputPress = () => {
      inputRef.current.focus();
    };

    return (
        <TouchableOpacity onPress={handleInputPress}>
              <View style={[styles.container, { width: inputWidth || '100%' }]}>
                  <TextInput ref={inputRef} style={[styles.text]} {...props}/>
              </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColour: WHITE,
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