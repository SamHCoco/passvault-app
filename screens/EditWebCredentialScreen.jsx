import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Formik, Field} from 'formik';

import Screen from '../components/Screen';
import AppTextInput from '../components/AppTextInput';
import AppRoundTouchable from '../components/AppRoundTouchable';
import AppToggleButton from '../components/AppToggleButton';

import saveWebCredential from '../service/saveWebCredential';
import saveCardCredential from '../service/saveCardCredential';
import AppSlider from '../components/AppSlider';
import AppIcon from '../components/AppIcon';

import generateRandomPassword from '../service/generatePassword';

import { useNavigation } from '@react-navigation/native';
import { BLACK, LIGHT_GREEN, LIGHT_GREY, WHITE } from '../constants/colors';
import isValidUrl from '../service/urlUtil';
import updateWebCredential from '../service/updateWebCredential';
import updateCardCredential from '../service/updateCardCredential';

import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-5113688719095404~2869573168';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

function EditWebCredentialScreen({ route }) {
  const navigation = useNavigation();

  const [item, setItem] = useState();
  const [selectedOption, setSelectedOption] = useState('Web');
  const [initialValues, setInitialValues] = useState();

  // web credential states
  const [id, setId] = useState();
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // card credential states
  const [bank, setBank] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationMonth, setExpirationMonth] = useState('');
  const [expirationYear, setExpirationYear] = useState('');
  const [securityCode, setSecurityCode] = useState('');

  // password generator states
  const [sliderValue, setSliderValue] = useState(10);
  const [passwordGeneratorConfig, setPasswordGeneratorConfig] = useState({
      length: 10,
      includeLowerCase: true,
      includeNumbers: true,
      includeSpecialChars: true,
      includeUpperCase: true});

  useEffect(() => {
    var effectItem;

    if (route && route.params && route.params.item) {
      setItem(route.params.item);
      effectItem = route.params.item;
    } else if (route.params.createType) {
      effectItem = route.params;
    }

    if (effectItem) {
      const { type } = effectItem;
      if (type === 'web') {
        setSelectedOption('Web');
        setId(effectItem.id);
        setName(effectItem.name);
        setUrl(effectItem.url);
        setUsername(effectItem.username);
        setPassword(effectItem.password);
        
        setInitialValues({
          url: effectItem.url || '',
          name: effectItem.name || '',
          username: effectItem.username || '',
          password: effectItem.password || '',
        });
      } else if (type === 'card') {
        setSelectedOption('Card');

        setId(effectItem.id);
        setBank(effectItem.bank);
        setCardNumber(effectItem.cardNumber);
        if (effectItem.expDate && effectItem.securityCode) {
          setExpirationMonth(effectItem.expDate.substring(0, 2));
          setExpirationYear(effectItem.expDate.substring(3, 5));
          setSecurityCode(effectItem.securityCode.toString());
        }

        setInitialValues({
          bank: effectItem.bank || '',
          cardNumber: effectItem.cardNumber || '',
          expirationMonth: effectItem.expirationMonth || '',
          expirationYear: effectItem.expirationYear || '',
          securityCode: effectItem.securityCode ?  effectItem.securityCode.toString() : '',
        });
      }
    }
  }, [route]);

  const handleFormSubmit = async (values) => {
    const hasErrors = validateForm();

    if (hasErrors) {
      return;
    }

    if (selectedOption === 'Web') {
      if(!id) {
        await saveWebCredential({
          url,
          name,
          username,
          password
        });
      } else {
        await updateWebCredential({
          id: id,
          url,
          name,
          username,
          password
        });
      }
      setWebFormBlank();
    
      navigation.replace('Tabs', { selectedOption: 'web'});
    
    } else if (selectedOption === 'Card') {
      // Remove all dashes from the cardNumber state
      const cardNumberWithoutDashes = cardNumber.replace(/-/g, '');
      if (!id) {
        await saveCardCredential({
          bank,
          cardNumber: cardNumberWithoutDashes,
          expirationMonth,
          expirationYear,
          securityCode,
        });
      } else {
        
        await updateCardCredential({
          id: id,
          bank,
          cardNumber: cardNumberWithoutDashes,
          expirationMonth,
          expirationYear,
          securityCode,
        });
      }
      setCardFormBlank();
      navigation.replace('Tabs', { selectedOption: 'card'});
    }
  };

  const validateForm = () => {
    let hasErrors = false;

    if (selectedOption === 'Web') {
      if (!name) {
        hasErrors = true;
      }
      if (!url) {
        hasErrors = true;
      } else {
        if (!isValidUrl(url)) {
          hasErrors = true;
        }
      }
      if (!username) {
        hasErrors = true;
      }
      if (!password) {
        hasErrors = true;
      }
    } else if (selectedOption === 'Card') {
      if (!bank) {
        hasErrors = true;
      }
      if (!cardNumber) {
        hasErrors = true;
      }
      if (!expirationMonth) {
        hasErrors = true;
      }
      if (!expirationYear) {
        hasErrors = true;
      } 
      if (!securityCode) {
        hasErrors = true;
      }
    }
    return hasErrors;
  };

  const handleInputChange = (value, inputName) => {
    if (inputName === 'url') {
      setUrl(value);
    } else if (inputName === 'name') {
      setName(value);
    } else if (inputName === 'username') {
      setUsername(value);
    } else if (inputName === 'password') {
      setPassword(value);
    } else if (inputName === 'bank') {
      setBank(value);
    }  else if (inputName === 'cardNumber') {
      // Remove any existing spaces from the value
      const newValue = value.replace(/ /g, '');

      // Split the value into groups of 4 characters
      const groups = newValue.match(/.{1,4}/g);

      // Add empty spaces after every group of 4 characters
      const formattedValue = groups ? groups.join(' ') : ''

      // Update the state
      setCardNumber(formattedValue);
    } else if (inputName === 'expirationMonth') {
      // ensures inputs are always aligned
      setExpirationMonth(value);
      setSecurityCode('');
    } else if (inputName === 'expirationYear') {
      // ensures inputs are always aligned
      setExpirationYear(value);
      setSecurityCode('');
    } else if (inputName === 'securityCode') {
      setSecurityCode(value);
    }
  };

  const setWebFormBlank = () => {
    setUrl('');
    setUsername('');
    setPassword('');
  };

  const setCardFormBlank = () => {
    setBank('');
    setCardNumber('');
    setExpirationMonth('');
    setExpirationYear('');
    setSecurityCode('');
  };

  const renderForm = ({ handleChange, handleSubmit, errors, touched, values }) => {
    if (selectedOption === 'Web') {
      return (
        <>
          <View style={styles.webFormContainer}>
          <Field
              component={AppTextInput}
              name="name"
              placeholder="Name"
              autoCapitalize="none"
              autoCorrect={false}
              value={name}
              onChangeText={(value) => handleInputChange(value, 'name')}
          />

            <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center'}}>
                  <AppIcon name="web" color={LIGHT_GREEN} size={screenWidth * 0.1095} library="material" />
            </View>

              <Field
                  component={AppTextInput}
                  name="url"
                  placeholder="URL"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={url}
                  onChangeText={(value) => handleInputChange(value, 'url')}
              />

              <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center'}}>
                  <AppIcon name="md-person-circle" color={LIGHT_GREEN} size={screenWidth * 0.1095} library="ion" />
              </View>

              <Field
                  component={AppTextInput}
                  name="username"
                  placeholder="Username"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={username}
                  onChangeText={(value) => handleInputChange(value, 'username')}
              />

              <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center'}}>
                  <AppIcon name="md-lock-closed" color={LIGHT_GREEN} size={screenWidth * 0.1095} library="ion" />
              </View>
              
              <Field
                component={AppTextInput}
                name="password"
                placeholder="Password"
                autoCapitalize="none"
                autoCorrect={false}
                value={password}
                onChangeText={(value) => handleInputChange(value, 'password')}
              />

              <View style={{borderWidth: 0, marginVertical: screenWidth * 0.0633}}>
              <View style={styles.touchableButtonContainer}>
                  <AppRoundTouchable text={item ? "Edit" : "Save"} 
                                     onPress={() => handleFormSubmit(values)} 
                                     touchableStyle={styles.touchableButtonStyle} 
                  />
                  
                  <AppRoundTouchable text="Generate" 
                                     onPress={(values) => {
                                                      const password = generateRandomPassword(passwordGeneratorConfig);
                                                      setPassword(password);}} 
                                     touchableStyle={styles.touchableButtonStyle} 
                  />
              </View>
                    <View style={styles.passwordGeneratorContainer}>
                        <AppSlider value={sliderValue} label="Characters" onValueChange={(value) => {
                                                                              setSliderValue(value);
                                                                              passwordGeneratorConfig['length'] = value;
                        }} />
                        <AppToggleButton label="Special characters"
                                        initialValue={true} 
                                        onToggle={(value) => setPasswordGeneratorConfig(prevState => ({
                                                  ...prevState,
                                                  includeSpecialChars: value
                            }))} />
                        <AppToggleButton label="Numbers"
                                        initialValue={true} 
                                        onToggle={(value) => setPasswordGeneratorConfig(prevState => ({
                                                  ...prevState,
                                                  includeNumbers: value
                            }))} />
                        <AppToggleButton label="Uppercase"
                                        initialValue={true}
                                        onToggle={(value) => setPasswordGeneratorConfig(prevState => ({
                                                  ...prevState,
                                                  includeUpperCase: value
                            }))} />
                        <AppToggleButton label="Lowercase" 
                                        initialValue={true}
                                        onToggle={(value) => setPasswordGeneratorConfig(prevState => ({
                                                  ...prevState,
                                                  includeLowerCase: value
                            }))} />
                    </View>
              </View>
          </View>
        </>
      );
    } else if (selectedOption === 'Card') {
      return (
        <>
          <View style={styles.bankFormContainer}>
              <Text style={styles.bankLabel}>Bank</Text>
              <Field
                component={AppTextInput}
                name="bank"
                placeholder="Bank"
                autoCapitalize="none"
                textAlign='center'
                autoCorrect={false}
                value={bank}
                onChangeText={(value) => handleInputChange(value, 'bank')}
                inputWidth={screenWidth * 0.8516}
              />
            </View>

            <View style={styles.cardInputContainer}>
                    <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center'}}>
                          <AppIcon name="card" color={LIGHT_GREEN} size={screenWidth * 0.1095} library="ion" />
                    </View>

                    <View style={styles.cardContainer}>
                      <Text style={styles.cardLabel}>Card Number</Text>
                      <Field
                        component={AppTextInput}
                        name="cardNumber"
                        placeholder="Card Number"
                        keyboardType="numeric"
                        maxLength={19}
                        textAlign='center'
                        value={cardNumber}
                        onChangeText={(value) => handleInputChange(value, 'cardNumber')}
                        inputWidth={screenWidth * 0.6083}
                      />
                    </View>

                    <View style={styles.expirationContainer}>
                      <View style={styles.expirationMonthContainer}>
                        <Text style={styles.expirationLabel}>Exp Month</Text>
                        <Field
                          component={AppTextInput}
                          name="expirationMonth"
                          placeholder="MM"
                          keyboardType="numeric"
                          maxLength={2}
                          value={expirationMonth}
                          onChangeText={(value) => handleInputChange(value, 'expirationMonth')}
                        />
                      </View>

                      <View style={styles.expirationYearContainer}>
                        <Text style={styles.expirationLabel}>Exp Year</Text>
                        <Field
                          component={AppTextInput}
                          name="expirationYear"
                          placeholder="YY"
                          keyboardType="numeric"
                          maxLength={2}
                          value={expirationYear}
                          onChangeText={(value) => handleInputChange(value, 'expirationYear')}
                        />
                      </View>
                      <View style={styles.securityCodeContainer}>
                      <Text style={styles.securityCodeLabel}>Security Code</Text>
                      <Field
                        component={AppTextInput}
                        name="securityCode"
                        placeholder="Code"
                        autoCapitalize="none"
                        autoCorrect={false}
                        maxLength={4}
                        textAlign='center'
                        value={securityCode}
                        onChangeText={(value) => handleInputChange(value, 'securityCode')}
                        inputWidth={screenWidth * 0.2092}
                      />
                    </View>
                    </View>
                    <View style={styles.cardFormButton}>
                        <AppRoundTouchable text={item ? "Edit" : "Save"} 
                                onPress={handleFormSubmit} 
                                touchableStyle={styles.touchableButtonStyle}  />
                    </View>
            </View>
        </>
      );
    }

    return null;
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Screen>
        <View style={styles.container}>
          <View style={styles.optionsContainer}>
            <AppRoundTouchable
              iconName="web"
              iconColor={selectedOption === 'Web' ? LIGHT_GREEN : BLACK}
              iconLibrary="material"
              iconSize={screenWidth * 0.1582}
              isSelected={selectedOption === 'Web'}
              onPress={() => setSelectedOption('Web')}
            />
            <AppRoundTouchable
              name="card"
              iconName="card"
              iconColor={selectedOption === 'Card' ? LIGHT_GREEN : BLACK}
              iconLibrary="ion"
              iconSize={screenWidth * 0.1582}
              isSelected={selectedOption === 'Card'}
              onPress={() => setSelectedOption('Card')}
            />
          </View>

          <Formik
            initialValues={initialValues}
            onSubmit={handleFormSubmit}
          >
            {({ handleChange, handleFormSubmit, errors, touched, values }) => (
              <>
                <BannerAd
                  unitId={adUnitId}
                  size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                  requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                  }}
      />
                {renderForm({ handleChange, handleFormSubmit, errors, touched, values })}

              </>
            )}
          </Formik>
        </View>
      </Screen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cardFormButton: {
      alignItems: 'center',
      marginRight: screenWidth * 0.099
  },
  cardInputContainer: {
      borderWidth: 1,
      flex: 1,
      height: screenHeight * 0.45,
      width: screenWidth * 0.70,
      alignItems: 'center',
      borderColor: WHITE
  },
  passwordGeneratorContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    marginVertical: screenHeight * 0.033,
    borderRadius: 0.05 * screenWidth,
    borderColor: LIGHT_GREY,
  },
  touchableButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableButtonStyle: {
    width: screenWidth * 0.25,
    height: screenWidth * 0.25,
    borderRadius: 0.3 * screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: WHITE,
    backgroundColor: LIGHT_GREEN,
    marginLeft: screenWidth * 0.069,
  },
  webFormContainer: {
    width: screenWidth * 0.91,
    flex: 1,
  },
  bankFormContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    marginBottom: screenHeight * 0.008,
    borderRadius: 0.04 * screenWidth,
    width: screenWidth * 0.70,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    alignItems: 'center',
    paddingBottom: screenHeight * 0.027,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: screenHeight * 0.018,
    marginVertical: screenHeight * 0.015,
  },
  errorText: {
    color: 'red',
    fontSize: screenHeight * 0.019,
  },
  expirationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: screenHeight * 0.013,
    width: screenWidth * 0.62,
    marginVertical: 15 // todo - remove
  },
  expirationMonthContainer: {
    marginRight: screenWidth * 0.027,
  },
  expirationYearContainer: {
    marginRight: screenWidth * 0.027,
  },
  securityCodeContainer: {
    marginRight: screenWidth * 0.027,
    width: screenWidth * 0.24
  },
  
  expirationLabel: {
    marginRight: screenWidth * 0.027,
  },
  expirationFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expirationField: {
    width: screenWidth * 0.11,
  },
  cardContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: screenHeight * 0.004,
    width: screenWidth * 0.65,
    marginBottom: screenWidth * 0.0243
  },
  cardLabel: {
    marginRight: screenWidth * 0.018,
  },
  securityCodeLabel: {
    marginRight: screenWidth * 0.027,
    width: screenWidth * 0.243
  },
  bankLabel: {
    marginRight: screenWidth * 0.027,
  },
});


export default EditWebCredentialScreen;
