// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useCart } from '../Courses/CartContext';
// import { useAuth } from '../AuthContext/AuthContext';
// import axios from 'axios';
// import './PaymentPage.css';
// import { loadStripe } from '@stripe/stripe-js';
// import {
//   Elements,
//   useStripe,
//   useElements,
//   CardNumberElement,
//   CardExpiryElement,
//   CardCvcElement
// } from '@stripe/react-stripe-js';
// import PaymentForm from './PaymentForm';

// // Using simple Stripe config for better compatibility
// const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RB5LX3ogPbdylYhgnEbGMcnB8cdHhNcXlL6x3Wk0hoRoXjjiW8SJ3V1cb3P0cwPeXXyNYWXGCbU6F58PFzqQp8B008x042uvL';
// const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// function CheckoutForm() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { clearCart } = useCart();
//   const { user } = useAuth();
//   const [message, setMessage] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [clientSecret, setClientSecret] = useState('');
//   const [error, setError] = useState(null);
//   const [status, setStatus] = useState('initializing');
//   const [cardComplete, setCardComplete] = useState(false);
//   const cardElementRef = useRef(null);

//   const stripe = useStripe();
//   const elements = useElements();

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';


//   // Store card element reference when available
//   useEffect(() => {
//     if (elements) {
//       cardElementRef.current = elements.getElement(CardNumberElement);
//     }
//   }, [elements, cardComplete]);

//   // Clear message when status changes
//   useEffect(() => {
//     setMessage(null);
//   }, [status]);

//   useEffect(() => {
//     // Redirect if no valid state
//     if (!location.state || !location.state.courses || !location.state.orderId || !location.state.amount) {
//       setError('Incomplete payment information. Please return to checkout.');
//       setStatus('failed');
//       return;
//     }

//     if (!user) {
//       setError('Please login to complete the payment.');
//       setStatus('failed');
//       return;
//     }

//     // Create PaymentIntent as soon as the page loads
//     async function createPaymentIntent() {
//       try {
//         console.log('Creating payment intent with amount:', location.state.amount);
        
//         const response = await axios.post(
//           `${API_BASE_URL}/api/payment/create-payment-intent`,
//           {
//             amount: location.state.amount,
//             currency: 'inr',
//             orderId: location.state.orderId
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`
//             }
//           }
//         );

//         console.log('Payment intent created:', response.data);
        
//         if (response.data.clientSecret) {
//           setClientSecret(response.data.clientSecret);
//           setStatus('ready');
//         } else {
//           setError('Could not initialize payment');
//           setStatus('failed');
//         }
//       } catch (err) {
//         console.error('Create payment intent error details:', err.response || err);
//         setError(err.response?.data?.message || 'Failed to initialize payment');
//         setStatus('failed');
//       }
//     }

//     createPaymentIntent();
//   }, [location.state, user, navigate]);

//   const handleCardChange = (event) => {
//     setCardComplete(event.complete);
//     if (event.error) {
//       setMessage(event.error.message);
//     } else {
//       setMessage(null);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!stripe || !elements) {
//       console.error('Stripe.js has not loaded yet');
//       setMessage('Payment system is still initializing. Please try again.');
//       return;
//     }

//     if (!cardComplete) {
//       setMessage('Please complete your card information');
//       return;
//     }

//     // Use the stored card element reference
//     const cardNumber = cardElementRef.current;
    
//     if (!cardNumber) {
//       setMessage('Card number element not found');
//       return;
//     }

//     try {
//       console.log('Processing payment...');
      
//       // Save payment method BEFORE any state changes that could trigger re-renders
//       const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
//         type: 'card',
//         card: cardNumber,
//         billing_details: {
//           name: user.name || user.username || 'Unknown',
//           email: user.email || 'unknown@example.com',
//         },
//       });
      
//       if (methodError) {
//         throw methodError;
//       }
      
//       console.log('Payment method created:', paymentMethod.id);
      
//       // Now it's safe to update loading state
//       setIsLoading(true);
//       setStatus('processing');
      
//       // Then confirm payment with client secret and payment method ID
//       const result = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: paymentMethod.id
//       });

//       if (result.error) {
//         console.error('Payment error:', result.error);
//         setMessage(result.error.message);
//         setStatus('failed');
//         setError(result.error.message);
//       } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
//         console.log('Payment succeeded with payment intent ID:', result.paymentIntent.id);
//         setMessage('Payment succeeded!');
        
//         // Process order after payment
//         await processOrderConfirmation(result.paymentIntent.id);
        
//         setStatus('success');
//         clearCart();
        
//         setTimeout(() => {
//           navigate('/profile');
//         }, 3000);
//       } else {
//         console.error('Payment not completed, status:', result.paymentIntent ? result.paymentIntent.status : 'unknown');
//         setMessage('Something went wrong.');
//         setStatus('failed');
//         setError(`Payment was not completed. Status: ${result.paymentIntent ? result.paymentIntent.status : 'unknown'}`);
//       }
//     } catch (err) {
//       console.error('Payment submission error:', err);
//       setMessage(err.message || 'An unexpected error occurred.');
//       setStatus('failed');
//       setError(err.message || 'Payment processing failed');
//     }

//     setIsLoading(false);
//   };

//   // Process order confirmation after successful payment
//   const processOrderConfirmation = async (paymentIntentId) => {
//     try {
//       // Update user's purchased courses with retry mechanism
//       let retries = 3;
//       let purchaseSuccess = false;

//       while (retries > 0 && !purchaseSuccess) {
//         try {
//           await axios.post(
//             `${API_BASE_URL}/api/users/purchase-courses`,
//             {
//               courses: location.state.courses.map(course => course._id),
//               orderId: location.state.orderId,
//               amount: location.state.amount,
//               paymentIntentId: paymentIntentId
//             },
//             {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem('token')}`
//               },
//               timeout: 10000
//             }
//           );
//           purchaseSuccess = true;
//         } catch (err) {
//           retries--;
//           if (retries === 0) throw err;
//           await new Promise(resolve => setTimeout(resolve, 1000));
//         }
//       }

//       // Create transaction record
//       await axios.post(
//         `${API_BASE_URL}/api/transactions`,
//         {
//           orderId: location.state.orderId,
//           courses: location.state.courses.map(course => ({
//             course: course._id,
//             price: course.price
//           })),
//           totalAmount: location.state.amount,
//           paymentIntentId: paymentIntentId
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         }
//       );

//       // Send confirmation email
//       await axios.post(
//         `${API_BASE_URL}/api/payment/send-confirmation`,
//         {
//           orderId: location.state.orderId,
//           courses: location.state.courses,
//           amount: location.state.amount,
//           userDetails: location.state.userDetails,
//           paymentIntentId: paymentIntentId
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         }
//       );

//       return true;
//     } catch (error) {
//       console.error('Error in order confirmation:', error);
//       // We don't throw an error here, as payment was successful
//       return false;
//     }
//   };

//   // Render payment form
//   if (status === 'initializing') {
//     return (
//       <div className="processing-container">
//         <div className="loader-wrapper">
//           <div className="loader"></div>
//         </div>
//         <h2>Initializing Payment</h2>
//         <p className="processing-text">
//           Please wait while we prepare your payment...
//         </p>
//       </div>
//     );
//   }

//   if (status === 'processing') {
//     return (
//       <div className="processing-container">
//         <div className="loader-wrapper">
//           <div className="loader"></div>
//         </div>
//         <h2>Processing Your Payment</h2>
//         <div className="progress-bar">
//           <div
//             className="progress"
//             style={{
//               width: '90%',
//               transition: 'width 0.8s ease-in-out'
//             }}
//           ></div>
//         </div>
//         <p className="processing-text">
//           Please wait while we confirm your payment...
//         </p>
//         <div className="payment-details">
//           <p className="amount">Amount: ₹{location.state?.amount || 0}</p>
//           <p className="order-id">Order ID: {location.state?.orderId}</p>
//         </div>
//       </div>
//     );
//   }

//   if (status === 'success') {
//     return (
//       <div className="success-container">
//         <div className="success-animation">
//           <div className="checkmark">✓</div>
//         </div>
//         <h2>Payment Successful!</h2>
//         <div className="success-details">
//           <p className="success-amount">₹{location.state?.amount}</p>
//           <p className="success-message">Payment Completed</p>
//           <p className="order-details">Order ID: {location.state?.orderId}</p>
//           <div className="course-summary">
//             <p>{location.state?.courses?.length} course(s) purchased</p>
//           </div>
//         </div>
//         <p className="redirect-message">
//           Redirecting to your profile...
//         </p>
//       </div>
//     );
//   }

//   if (status === 'failed') {
//     return (
//       <div className="error-container">
//         <div className="error-icon">❌</div>
//         <h2>Payment Failed</h2>
//         <div className="error-details">
//           <p className="error-message">{error}</p>
//           <div className="error-actions">
//             <button
//               onClick={() => navigate('/checkout')}
//               className="retry-button"
//             >
//               Try Again
//             </button>
//             <button
//               onClick={() => navigate('/support')}
//               className="support-button"
//             >
//               Contact Support
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Default payment form (status === 'ready')
//   return (
//     <div className="stripe-form-container">
//       <h2>Complete Your Payment</h2>
//       <div className="order-summary">
//         <h3>Order Summary</h3>
//         <div className="summary-details">
//           <p>Courses: {location.state?.courses?.length}</p>
//           <p className="order-total">Total: ₹{location.state?.amount}</p>
//           <p className="order-id">Order ID: {location.state?.orderId}</p>
//         </div>
//       </div>

//       <PaymentForm 
//         onSubmit={handleSubmit} 
//         isLoading={isLoading} 
//         disabled={isLoading || !stripe || !elements || !cardComplete}
//         onCardChange={handleCardChange}
//       />
      
//       {message && <div id="payment-message" className="payment-error">{message}</div>}
//     </div>
//   );
// }

// export default function PaymentPage() {
//   return (
//     <div className="payment-page">
//       <div className="payment-container">
//         <div className="payment-card">
//           <Elements stripe={stripePromise}>
//             <CheckoutForm />
//           </Elements>
//         </div>
//       </div>
//     </div>
//   );
// } 