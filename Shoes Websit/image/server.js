const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')('your_stripe_secret_key');

const app = express();
const port = 3000;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (like your HTML and CSS)
app.use(express.static('public'));

// Handle payment form submission
app.post('/process-payment', async (req, res) => {
  try {
    const { cardHolder, cardNumber, expiryDate, cvc } = req.body;

    // Create a payment intent using Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // Amount in cents
      currency: 'usd',
      payment_method_data: {
        type: 'card',
        card: {
          number: cardNumber,
          exp_month: parseInt(expiryDate.split('-')[0]),
          exp_year: parseInt(expiryDate.split('-')[1]),
          cvc: cvc,
        },
      },
    });

    // Confirm the payment intent
    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id);

    // Handle successful payment
    console.log('Payment succeeded:', confirmedPaymentIntent);
    res.status(200).json({ message: 'Payment succeeded' });
  } catch (error) {
    console.error('Error processing payment:', error.message);
    res.status(500).json({ message: 'Error processing payment' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});