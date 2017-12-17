'use strict';

const stripe = require('stripe')(process.env.STRIPE_API_KEY);

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
}

const response = (resp) => Object.assign({}, resp, { headers });

module.exports.index = (event, context, callback) => {
  const {amount, token} = JSON.parse(event.body);

  if (!amount || !token) {
    callback(null, response({
      statusCode: 400,
      body: JSON.stringify({
        error: 'Missing Stripe token and/or amount',
      }),
    }));
  }

  stripe.charges.create({
    amount,
    source: token.id,
    currency: 'usd',
    description: 'Donation - Krypto.cash',
    statement_descriptor: 'Donation - Krypto.cash',
  }).then(resp => {
    callback(null, response({
      statusCode: 200,
      body: JSON.stringify(resp),
    }));
  }).catch(error => {
    callback(null, response({
      statusCode: error.statusCode,
      body: JSON.stringify({
        error: error.type,
      }),
    }));
  });
}