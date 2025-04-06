const express = require('express');
const { processStripePayment, processPayPalPayment, processGooglePay, processApplePay,createCheckoutSession, getTransactions  } = require('../controllers/paymentController');

const router = express.Router();

router.post('/paypal', processPayPalPayment);
router.post('/stripe', processStripePayment);
router.post('/google-pay', processGooglePay);
router.post('/apple-pay', processApplePay);
router.post('/checkout', createCheckoutSession);
router.get('/transactions', getTransactions);

module.exports = router;
