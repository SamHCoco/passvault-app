import React, { useState, useEffect } from 'react';
import { Button, Text, View, ScrollView } from 'react-native';
import { Formik, Field, ErrorMessage } from 'formik';

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

import { useNavigation } from '@react-navigation/native';

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

  useEffect(() => {
    var effectItem;
    if (route && route.params) {
      setItem(route.params.item);
      effectItem = route.params.item;
    }
    console.log("immediate useEFFECT effectItem: ", effectItem); // todo - remove

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
  }, []);

  // password generator states
  const [sliderValue, setSliderValue] = useState(10);
  const [passwordLength, setPasswordLength] = useState(10);
  const [isNumbers, setIsNumbers] = useState(true);
  const [isSpecialChars, setIsSpecialChars] = useState(true);
  const [isLowercase, setIsLowercase] = useState(true);
  const [isUppercase, setIsUppercase] = useState(true);
  const [passwordGeneratorConfig, setPasswordGeneratorConfig] = useState({
      length: 10,
      includeLowerCase: true,
      includeNumbers: true,
      includeSpecialChars: true,
      includeUpperCase: true});

  const handleFormSubmit = async (values) => {
    if (selectedOption === 'Web') {
      await saveWebCredential({
        url,
        username,
        password
      });
      setWebFormBlank();
      navigation.navigate('Vault', {selectedOption: 'web'});
    } else if (selectedOption === 'Card') {
      await saveCardCredential({
        bank,
        cardNumber,
        expirationMonth,
        expirationYear,
        securityCode,
      });
      setCardFormBlank();
      navigation.navigate('Vault', { selectedOption: 'card'});
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
                <AppIcon name="web" color="black" size={45} library="material" />
          </View>

            <Field
                component={AppTextInput}
                name="url"
                placeholder="URL"
                autoCapitalize="none"
                autoCorrect={false}
                value={url}
                onChangeText={setUrl}
              />
            <ErrorMessage name="url" component={Text} style={styles.errorText} />

            <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center'}}>
                <AppIcon name="md-person-circle" color="black" size={45} library="ion" />
            </View>

            <Field
                component={AppTextInput}
                name="username"
                placeholder="Username"
                autoCapitalize="none"
                autoCorrect={false}
                value={username}
                onChangeText={setUsername}
            />
            <ErrorMessage name="username" component={Text} style={styles.errorText} />

            <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center'}}>
                <AppIcon name="md-lock-closed" color="black" size={45} library="ion" />
            </View>
            
            <Field
              component={AppTextInput}
              name="password"
              placeholder="Password"
              autoCapitalize="none"
              autoCorrect={false}
              // secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <ErrorMessage name="password" component={Text} style={styles.errorText} />

            <View style={{borderWidth: 0}}>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <AppRoundTouchable text={item ? "Edit" : "Save"} onPress={() => handleFormSubmit(values)} />
                <AppRoundTouchable text="Generate" onPress={(values) => {
                      const password = generateRandomPassword(passwordGeneratorConfig);
                      setPassword(password);
                }} />
            </View>
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
                autoCorrect={false}
                value={bank}
                onChangeText={setBank}
              />
              <ErrorMessage name="bank" component={Text} style={styles.errorText} />
            </View>

            <View style={styles.cardContainer}>
              <Text style={styles.cardLabel}>Card Number</Text>
              <Field
                component={AppTextInput}
                name="cardNumber"
                placeholder="Card Number"
                keyboardType="numeric"
                style={styles.cardInput}
                maxLength={16}
                value={cardNumber}
                onChangeText={setCardNumber}
              />
              <ErrorMessage name="cardNumber" component={Text} style={styles.errorText} />
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
                  onChangeText={setExpirationMonth}
                />
                <ErrorMessage name="expirationMonth" component={Text} style={styles.errorText} />
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
                  onChangeText={setExpirationYear}
                />
                <ErrorMessage name="expirationYear" component={Text} style={styles.errorText} />
              </View>
            </View>

            <View style={styles.securityCodeContainer}>
              <Text style={styles.securityCodeLabel}>Security Code</Text>
              <Field
                component={AppTextInput}
                name="securityCode"
                placeholder="Security Code"
                autoCapitalize="none"
                autoCorrect={false}
                // secureTextEntry
                style={styles.securityCodeInput}
                maxLength={4}
                value={securityCode}
                onChangeText={setSecurityCode}
              />
              <ErrorMessage name="securityCode" component={Text} style={styles.errorText} />

              <AppRoundTouchable text={item ? "Edit" : "Save"} onPress={handleFormSubmit} />
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
              iconColor="black"
              iconLibrary="material"
              iconSize={65}
              isSelected={selectedOption === 'Web'}
              onPress={() => setSelectedOption('Web')}
            />
            <AppRoundTouchable
              name="card"
              iconName="card"
              iconColor="black"
              iconLibrary="ion"
              iconSize={65}
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

const styles = {
  webFormContainer: {
    // borderWidth: 1,
    // borderRadius: 12,
    width: 365
  },
  bankFormContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 4,
    borderRadius: 12
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 8,
  },
  expirationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  expirationLabel: {
    marginRight: 10,
  },
  expirationFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expirationField: {
    width: 40, // Adjust the width as needed
  },
  cardContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardLabel: {
    marginRight: 5,
  },
  // cardInput: {
  //   flex: 1,
  // },
  securityCodeContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 4,
  },
  securityCodeLabel: {
    marginRight: 10,
  },
  // securityCodeInput: {
  //   flex: 1,
  //   alignItems: 'center'
  // },
  bankLabel: {
    marginRight: 10,
  },
};

export default EditWebCredentialScreen;
