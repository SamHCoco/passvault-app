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
import { validationSchema } from '../service/validationSchemas';

import { useNavigation, CommonActions } from '@react-navigation/native';
import { BLACK, LIGHT_GREEN, LIGHT_GREY, WHITE } from '../constants/colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

function EditWebCredentialScreen({ route }) {
  const navigation = useNavigation();

  const [item, setItem] = useState();
  const [selectedOption, setSelectedOption] = useState('Web');
  const [initialValues, setInitialValues] = useState();

  // web credential states
  const [id, setId] = useState();
  const [url, setUrl] = useState('');
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

  // error states
  const [urlError, setUrlError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const [bankError, setBankError] = useState('');
  const [cardNumberError, setCardNumberError] = useState('');
  const [expirationError, setExpirationError] = useState('');
  const [expirationMonthError, setExpirationMonthError] = useState('');
  const [expirationYearError, setExpirationYearError] = useState('');
  const [securityCodeError, setSecurityCodeError] = useState('');

  useEffect(() => {
    var effectItem;

    if (route && route.params) {
      setItem(route.params.item);
      effectItem = route.params.item;
    }

    if (effectItem) {
      const { type } = effectItem;
      if (type === 'web') {
        console.log("OPTION SET TO WEB"); // todo - remove
        setSelectedOption('Web');
        
        setId(effectItem.id);
        setUrl(effectItem.url);
        setUsername(effectItem.username);
        setPassword(effectItem.password);
        
        setInitialValues({
          url: effectItem.url || '',
          username: effectItem.username || '',
          password: effectItem.password || '',
          bank: '',
          cardNumber: '',
          expirationMonth: '',
          expirationYear: '',
          securityCode: '',
        });
      } else if (type === 'card') {
        setSelectedOption('Card');

        setBank(effectItem.bank);
        setCardNumber(effectItem.cardNumber);
        setExpirationMonth(effectItem.expDate.substring(0, 2));
        setExpirationYear(effectItem.expDate.substring(3, 5));
        setSecurityCode(effectItem.securityCode.toString());

        setInitialValues({
          url: '',
          username: '',
          password: '',
          bank: effectItem.bank || '',
          cardNumber: effectItem.cardNumber || '',
          expirationMonth: effectItem.expirationMonth || '',
          expirationYear: effectItem.expirationYear || '',
          securityCode: effectItem.securityCode.toString() || '',
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
      await saveWebCredential({
        url,
        username,
        password
      });
      setWebFormBlank();
      
      // navigation.navigate('Vault', { selectedOption: 'web' });

      // navigation.push('Vault', { selectedOption: 'web' });

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'Vault',
              params: {
                selectedOption: 'web'
              }
            }
          ],
        })
      );
 
    
    } else if (selectedOption === 'Card') {
      // Remove all dashes from the cardNumber state
      const cardNumberWithoutDashes = cardNumber.replace(/-/g, '');
      await saveCardCredential({
        bank,
        cardNumber: cardNumberWithoutDashes,
        expirationMonth,
        expirationYear,
        securityCode,
      });
      setCardFormBlank();
      navigation.navigate('Vault', { selectedOption: 'card'});
    }
  };

  const validateForm = () => {
    let hasErrors = false;

    if (selectedOption === 'Web') {
      if (!url) {
        setUrlError('Required');
        hasErrors = true;
      } else {
        setUrlError('');
      }
      if (!username) {
        setUsernameError('Required');
        hasErrors = true;
      } else {
        setUsernameError('');
      }
      if (!password) {
        setPasswordError('Required');
        hasErrors = true;
      } else {
        setPasswordError('');
      }
    } else if (selectedOption === 'Card') {
      if (!bank) {
        setBankError('Required');
        hasErrors = true;
      } else {
        setBankError('');
      }

      if (!cardNumber) {
        setCardNumberError('Required');
        hasErrors = true;
      } else {
        setCardNumberError('');
      }

      if (!expirationMonth) {
        setExpirationMonthError('Required');
        hasErrors = true;
      } else {
        setExpirationMonthError('');
      }

      if (!expirationYear) {
        setExpirationYearError('Required');
        hasErrors = true;
      } else {
        setExpirationYearError('');
      }

      if (!securityCode) {
        setSecurityCodeError('Required');
        hasErrors = true;
      } else {
        setSecurityCodeError('');
      }
    }

    return hasErrors;
  };

  const handleInputChange = (value, inputName) => {
    if (inputName === 'url') {
      setUrl(value);
      setUrlError('');
    } else if (inputName === 'username') {
      setUsername(value);
      setUsernameError('');
    } else if (inputName === 'password') {
      setPassword(value);
      setPasswordError('');
    } else if (inputName === 'bank') {
      setBank(value);
      setBankError('');
    }  else if (inputName === 'cardNumber') {
      // Remove any existing spaces from the value
      const newValue = value.replace(/ /g, '');

      // Split the value into groups of 4 characters
      const groups = newValue.match(/.{1,4}/g);

      // Add empty spaces after every group of 4 characters
      const formattedValue = groups ? groups.join(' ') : ''

      // Update the state
      setCardNumber(formattedValue);
      setCardNumberError('');
    } else if (inputName === 'expirationMonth') {
      // ensures inputs are always aligned
      setExpirationMonth(value);
      setExpirationMonthError('');
      setExpirationYearError('');
      setSecurityCode('');
    } else if (inputName === 'expirationYear') {
      // ensures inputs are always aligned
      setExpirationYear(value);
      setExpirationYearError('');
      setExpirationMonthError('');
      setSecurityCode('');
    } else if (inputName === 'securityCode') {
      setSecurityCode(value);
      setExpirationYearError('');
      setSecurityCodeError('');
      setExpirationMonthError('');
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
              
              {urlError ? (
                <Text style={styles.errorText}>{urlError}</Text>
              ) : null}

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
              {usernameError ? (
                <Text style={styles.errorText}>{usernameError}</Text>
              ) : null}

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
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}

              <View style={{borderWidth: 0}}>
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
              />
              {bankError ? (
                <Text style={styles.errorText}>{bankError}</Text>
              ) : null}
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
                      />
                      {cardNumberError ? (
                        <Text style={styles.errorText}>{cardNumberError}</Text>
                      ) : null}
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
                        {expirationMonthError ? (
                        <Text style={styles.errorText}>{expirationMonthError}</Text>
                      ) : null}
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
                        {expirationYearError ? (
                        <Text style={styles.errorText}>{expirationYearError}</Text>
                        ) : null}
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
                      />
                      {securityCodeError ? (
                        <Text style={styles.errorText}>{securityCodeError}</Text>
                        ) : null}
                    </View>
                    </View>
            </View>
          <AppRoundTouchable text={item ? "Edit" : "Save"} 
                             onPress={handleFormSubmit} 
                             touchableStyle={styles.touchableButtonStyle}  />
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
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
          >
            {({ handleChange, handleFormSubmit, errors, touched, values }) => (
              <>
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
    marginBottom: screenHeight * 0.008,
    borderRadius: 0.04 * screenWidth,
    width: screenWidth * 0.62,
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
    fontSize: screenHeight * 0.018,
  },
  expirationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: screenHeight * 0.013,
    width: screenWidth * 0.62, // Adjust the width as needed
  },
  expirationMonthContainer: {
    marginRight: screenWidth * 0.027, // Adjust the margin as needed
  },
  expirationYearContainer: {
    marginRight: screenWidth * 0.027, // Adjust the margin as needed
  },
  securityCodeContainer: {
    marginRight: screenWidth * 0.027, // Adjust the margin as needed
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
  },
  bankLabel: {
    marginRight: screenWidth * 0.027,
  },
});


export default EditWebCredentialScreen;
