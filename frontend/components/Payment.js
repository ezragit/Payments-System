import { useState } from 'react';
import { GooglePayButton } from '@google-pay/button-react';
import axios from 'axios';

const Payment = () => {
    const [amount, setAmount] = useState(10);
	const [loading, setLoading] = useState(false);
    
    const handlePayPal = async () => {
        const { data } = await axios.post('http://localhost:5000/api/payments/paypal', { amount, currency: "USD" });
        window.location.href = data.approval_url;
    };

    const handleStripe = async () => {
        const { data } = await axios.post('http://localhost:5000/api/payments/stripe', { amount, currency: "USD", token: { id: "your-stripe-token" } });
        alert("Payment Successful!");
		
    const handleApplePayCheckout = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post("http://localhost:5000/api/payments/checkout", {
                amount: 20, 
                currency: "USD"
            });

            const stripe = await stripePromise;
            await stripe.redirectToCheckout({ sessionId: data.id });
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Choose Payment Method</h2>
            <button onClick={handlePayPal}>Pay with PayPal</button>
            <button onClick={handleStripe}>Pay with Visa/MasterCard (Stripe)</button>
        </div>
		<div>
            <h2>Choose Payment Method</h2>
            <button onClick={handleApplePayCheckout} disabled={loading}>
                Pay with Apple Pay (via Stripe Checkout)
            </button>
        </div>
    );
};



const GooglePayComponent = () => (
    <GooglePayButton
        environment="TEST"
        paymentRequest={{
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [{ type: 'CARD', parameters: { allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'], allowedCardNetworks: ['VISA', 'MASTERCARD'] }}],
            transactionInfo: { totalPriceStatus: 'FINAL', totalPrice: '10.00', currencyCode: 'USD' }
        }}
        onLoadPaymentData={paymentData => console.log('Payment Successful', paymentData)}
    />
);

export default Payment;
