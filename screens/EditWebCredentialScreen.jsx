import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import Screen from '../components/Screen';
import AppTextInput from '../components/AppTextInput';
import AppRoundTouchable from '../components/AppRoundTouchable';
import AppPasswordGenerator from '../components/AppPasswordGenerator';

import saveWebCredential from '../service/saveWebCredential';
import saveCardCredential from '../service/saveCardCredential';

const validationSchema = Yup.object().shape({
  url: Yup.string().when('selectedOption', {
    is: 'Web',
    then: Yup.string().url('Invalid URL').required('URL is required'),
  }),
  username: Yup.string().when('selectedOption', {
    is: 'Web',
    then: Yup.string().required('Username is required'),
  }),
  password: Yup.string().when('selectedOption', {
    is: 'Web',
    then: Yup.string().required('Password is required'),
  }),
  bank: Yup.string().when('selectedOption', {
    is: 'Card',
    then: Yup.string().required('Bank is required'),
  }),
  cardNumber: Yup.string().when('selectedOption', {
    is: 'Card',
    then: Yup.string().matches(/^\d{16}$/, 'Invalid card number').required('Card number is required'),
  }),
  expirationMonth: Yup.string().when('selectedOption', {
    is: 'Card',
    then: Yup.string().matches(/^(0[1-9]|1[0-2])$/, 'Invalid expiration month').required('Expiration month is required'),
  }),
  expirationYear: Yup.string().when('selectedOption', {
    is: 'Card',
    then: Yup.string().matches(/^\d{2}$/, 'Invalid expiration year').required('Expiration year is required'),
  }),
  securityCode: Yup.string().when('selectedOption', {
    is: 'Card',
    then: Yup.string().max(4, 'Security code must be at most 4 characters'),
  }),
});

function EditWebCredentialScreen(props) {
  const [selectedOption, setSelectedOption] = useState('Web');

  const handleSubmit = async (values) => {
    if (selectedOption === 'Web') {
      await saveWebCredential(values);
    } else if (selectedOption === 'Card') {
      const { cardNumber, securityCode, expirationMonth, expirationYear } = values;
      const expDate = `${expirationMonth}-${expirationYear}`;
      console.log("CARD CREDENTIALS - onSubmit: ", cardNumber, expDate, securityCode);
      await saveCardCredential({ cardNumber, expDate, securityCode });
    }
  };

  const renderForm = () => {
    if (selectedOption === 'Web') {
      return (
        <>
          <Field
            component={AppTextInput}
            name="url"
            placeholder="URL"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <ErrorMessage name="url" component={Text} style={styles.errorText} />

          <Field
            component={AppTextInput}
            name="username"
            placeholder="Username"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <ErrorMessage name="username" component={Text} style={styles.errorText} />

          <Field
            component={AppTextInput}
            name="password"
            placeholder="Password"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />
          <ErrorMessage name="password" component={Text} style={styles.errorText} />

          <View>
                <AppPasswordGenerator />
          </View>
        </>
      );
    } else if (selectedOption === 'Card') {
      return (
        <>
          <Screen>
              <View style={styles.bankContainer}>
                <Text style={styles.bankLabel}>Bank</Text>
                <Field
                  component={AppTextInput}
                  name="bank"
                  placeholder="Bank"
                  autoCapitalize="none"
                  autoCorrect={false}
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
                  secureTextEntry
                  style={styles.securityCodeInput}
                  maxLength={4}
                />
                <ErrorMessage name="securityCode" component={Text} style={styles.errorText} />
              </View>
          </Screen>
        </>
      );
    }

    return null;
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.optionsContainer}>
          <AppRoundTouchable
            iconName="web"
            iconColor='black'
            iconLibrary='material'
            iconSize={65}
            isSelected={selectedOption === 'Web'}
            onPress={() => setSelectedOption('Web')}
          />
          <AppRoundTouchable
            name="card"
            iconName='card'
            iconColor='black'
            iconLibrary='ion'
            iconSize={65}
            isSelected={selectedOption === 'Card'}
            onPress={() => setSelectedOption('Card')}
          />
        </View>

        <Formik
          initialValues={{
            url: '',
            username: '',
            password: '',
            bank: '',
            cardNumber: '',
            expirationMonth: '',
            expirationYear: '',
            securityCode: '',
          }}
          validationSchema={selectedOption === 'Web' ? validationSchema.web : validationSchema.card}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleSubmit, errors, touched }) => (
            <>
              {renderForm()}

              <AppRoundTouchable text="Save" onPress={handleSubmit} />
            </>
          )}
        </Formik>
      </View>
    </Screen>
  );
}

const styles = {
  container: {
    alignItems: 'center',
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
  bankContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 4,
  },
  bankLabel: {
    marginRight: 10,
  },
};

export default EditWebCredentialScreen;
