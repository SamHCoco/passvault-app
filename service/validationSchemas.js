import * as Yup from 'yup';

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
}).test('selectedOption', 'Selected option is required', (values) => {
  const { selectedOption } = values;
  if (selectedOption !== 'Web' && selectedOption !== 'Card') {
    return false;
  }
  return true;
});

export { validationSchema };
