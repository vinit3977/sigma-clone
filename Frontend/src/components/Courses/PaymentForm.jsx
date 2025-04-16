import React, { useState, useEffect } from 'react';
import { 
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement 
} from '@stripe/react-stripe-js';

// Basic card styling options
const cardElementOptions = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: "Arial, sans-serif",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  }
};

const PaymentForm = ({ onSubmit, isLoading, disabled, onCardChange }) => {
  const [cardNumberError, setCardNumberError] = useState(null);
  const [cardExpiryError, setCardExpiryError] = useState(null);
  const [cardCvcError, setCardCvcError] = useState(null);
  const [isCardComplete, setIsCardComplete] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false
  });

  // Check if all card fields are complete
  useEffect(() => {
    const allFieldsComplete = 
      isCardComplete.cardNumber && 
      isCardComplete.cardExpiry && 
      isCardComplete.cardCvc;
    
    // Call parent component with the complete status
    onCardChange({ complete: allFieldsComplete });
  }, [isCardComplete, onCardChange]);

  const handleCardNumberChange = (event) => {
    if (event.error) {
      setCardNumberError(event.error.message);
    } else {
      setCardNumberError(null);
    }
    setIsCardComplete(prev => ({ ...prev, cardNumber: event.complete }));
  };

  const handleCardExpiryChange = (event) => {
    if (event.error) {
      setCardExpiryError(event.error.message);
    } else {
      setCardExpiryError(null);
    }
    setIsCardComplete(prev => ({ ...prev, cardExpiry: event.complete }));
  };

  const handleCardCvcChange = (event) => {
    if (event.error) {
      setCardCvcError(event.error.message);
    } else {
      setCardCvcError(null);
    }
    setIsCardComplete(prev => ({ ...prev, cardCvc: event.complete }));
  };

  return (
    <form id="payment-form" onSubmit={onSubmit} className="stripe-payment-form">
      <div className="payment-card-container">
        <div className="card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
          <span>Card Details</span>
        </div>
        
        <div className="form-group">
          <label htmlFor="card-number-element">Card Number</label>
          <div className="card-input-wrapper">
            <CardNumberElement
              id="card-number-element"
              options={cardElementOptions}
              onChange={handleCardNumberChange}
              className="card-element"
            />
          </div>
          {cardNumberError && <div className="card-error">{cardNumberError}</div>}
        </div>

        <div className="card-row">
          <div className="form-group card-expiry">
            <label htmlFor="card-expiry-element">Expiry Date</label>
            <div className="card-input-wrapper">
              <CardExpiryElement
                id="card-expiry-element"
                options={cardElementOptions}
                onChange={handleCardExpiryChange}
                className="card-element"
              />
            </div>
            {cardExpiryError && <div className="card-error">{cardExpiryError}</div>}
          </div>

          <div className="form-group card-cvc">
            <label htmlFor="card-cvc-element">CVC</label>
            <div className="card-input-wrapper">
              <CardCvcElement
                id="card-cvc-element"
                options={cardElementOptions}
                onChange={handleCardCvcChange}
                className="card-element"
              />
            </div>
            {cardCvcError && <div className="card-error">{cardCvcError}</div>}
          </div>
        </div>
      </div>
      
      <div className="card-info-message">
        <strong>Test Card:</strong> 4242 4242 4242 4242 | Exp: Any future date | CVC: Any 3 digits
      </div>
      
      <div className="secure-payment-badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        <span>Secure credit card payment</span>
      </div>

      <button 
        disabled={disabled} 
        id="submit" 
        className="payment-button"
      >
        <span id="button-text">
          {isLoading ? "Processing..." : "Pay now"}
        </span>
      </button>
      
      <div className="card-logos">
        <span className="card-logo visa">Visa</span>
        <span className="card-logo mastercard">Mastercard</span>
        <span className="card-logo amex">Amex</span>
      </div>
    </form>
  );
};

export default PaymentForm; 