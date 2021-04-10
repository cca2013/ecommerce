import React from 'react'
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';

import STRIPE_PUBLISHABLE from '../constants/stripe';
import PAYMENT_SERVER_URL from '../constants/server';

const CURRENCY = 'EUR';

//const fromDollarToCent = amount =>{ parseInt(amount * 100)};

const successPayment = data => {
  alert('Payment Successful');
};

const errorPayment = data => {
  alert('Payment Error');
};

const onToken = (amount, description) => token =>
  axios.post(PAYMENT_SERVER_URL,
    {
      description,
      source: token.id,
      currency: CURRENCY,
      amount: amount
    })
    .then(successPayment)
    .catch(errorPayment);

const Checkout = ({ name, description, amount }) =>
  <StripeCheckout
     name={name}
     description={description}
     amount={amount}
     token={onToken(amount, description)}
     currency={CURRENCY}
     stripeKey={'pk_live_51HSOU6JAFxyfv0LkzEpk9DLr2E0hBbCQe4NU9GGXoRQ7z1MIoOQmgxYr8OPIizQCBjznjw0d19BndUxW31nq9PdZ000S1Vyhj9'}
     zipCode
     email
     allowRememberMe
  />

export default Checkout;