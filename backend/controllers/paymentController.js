const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('paypal-rest-sdk');
const Transaction = require("../models/Transactions");

console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);

// Configure PayPal
paypal.configure({
    mode: "sandbox", // Change to "live" for production
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_SECRET
});

// 📌 Stripe (Visa/MasterCard)
exports.processStripePayment = async (req, res) => {
    try {
        const { amount, currency, token } = req.body;
        const charge = await stripe.charges.create({
            amount: amount * 100,
            currency,
            source: token.id,
            description: "Payment for order"
        });

        res.json({ success: true, charge });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//Stripe Checkout 
exports.createCheckoutSession = async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'apple_pay'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: {
                            name: "Online Store Purchase",
                        },
                        unit_amount: amount * 100, // Convert to cents
                    },
                    quantity: 1,
                }
            ],
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });

        res.json({ id: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 📌 PayPal
exports.processPayPalPayment = (req, res) => {
    const { amount, currency } = req.body;
    
    const create_payment_json = {
        intent: "sale",
        payer: { payment_method: "paypal" },
        transactions: [{ amount: { currency, total: amount } }],
        redirect_urls: { return_url: "http://localhost:3000/success", cancel_url: "http://localhost:3000/cancel" }
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
        if (error) res.status(500).json({ error });
        else res.json({ approval_url: payment.links[1].href });
    });
};

// 📌 Google Pay (via Stripe)
exports.processGooglePay = async (req, res) => {
    try {
        const { paymentMethodId, amount, currency } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency,
            payment_method: paymentMethodId,
            confirm: true
        });

        res.json({ success: true, paymentIntent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 📌 Apple Pay (via Stripe)
exports.processApplePay = async (req, res) => {
    try {
        const { paymentMethodId, amount, currency } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency,
            payment_method: paymentMethodId,
            confirm: true
        });

        res.json({ success: true, paymentIntent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCheckoutSession = async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'apple_pay'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: { name: "Online Store Purchase" },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                }
            ],
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });

        // Save transaction to MongoDB
        await Transaction.create({
            amount,
            currency,
            status: "pending",
            payment_method: "Apple Pay / Card",
        });

        res.json({ id: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};