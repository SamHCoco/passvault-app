import React, { useEffect, useRef } from 'react';
import { Animated, ImageBackground, StyleSheet, View, Image } from 'react-native';

function SplashScreen(props) {
  const logoAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimation();
  }, []);

  const startAnimation = () => {
    Animated.timing(logoAnimation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require('../assets/blue-background.jpeg')}
    >
      <View style={styles.logoContainer}>
        <Animated.View
          style={[
            styles.logo,
            {
              transform: [
                {
                  translateY: logoAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-200, 0], // Slide the logo from top to center
                  }),
                },
              ],
            },
          ]}
        >
          <Image source={require('../assets/logo-icon-2.png')} style={styles.logoImage} />
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default SplashScreen;
