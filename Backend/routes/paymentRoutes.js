const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { protect } = require('../middleware/authMiddleware');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Configure nodemailer with a more reliable approach
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Handle email error - temporarily disable email functionality if there's an error
let emailFunctionalityEnabled = true;

// Verify transporter
transporter.verify(function (error, success) {
    if (error) {
        console.log('Email configuration error:', error);
        emailFunctionalityEnabled = false;
        console.log('Email functionality has been temporarily disabled due to configuration errors');
    } else {
        console.log('Email server is ready to send messages');
        emailFunctionalityEnabled = true;
    }
});

// Create payment intent with Stripe
router.post('/create-payment-intent', protect, async (req, res) => {
    try {
        const { amount, currency = 'inr', orderId } = req.body;
        
        // Validate amount
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            return res.status(400).json({ 
                message: 'Invalid amount provided' 
            });
        }
        
        // Amount needs to be in smallest currency unit (paise for INR)
        const amountInPaise = Math.round(parseFloat(amount) * 100);
        
        // Check if we have a valid Stripe key
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('Missing Stripe secret key in environment variables');
            return res.status(500).json({ 
                message: 'Payment service configuration error' 
            });
        }
        
        // Log for debugging
        console.log('Creating payment intent with amount:', amountInPaise, 'paise, currency:', currency);
        
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInPaise,
            currency: currency,
            metadata: {
                orderId: orderId,
                userId: req.user._id.toString(),
                userEmail: req.user.email
            },
            description: `Order ${orderId} - Course purchase`,
            payment_method_types: ['card'],
        });

        console.log('Payment intent created:', paymentIntent.id);

        // Send the client secret to the client
        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(error.statusCode || 500).json({ 
            message: error.message || 'Error initializing payment',
            error: error.message
        });
    }
});

// Webhook to handle Stripe events
router.post('/webhook', async (req, res) => {
    let event;
    
    try {
        const signature = req.headers['stripe-signature'];
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret_key';
        
        try {
            // Ensure we have the raw body for webhook verification
            if (typeof req.body === 'string') {
                event = stripe.webhooks.constructEvent(
                    req.body,
                    signature,
                    webhookSecret
                );
            } else {
                // If body was already parsed as JSON, use stringified version
                event = stripe.webhooks.constructEvent(
                    JSON.stringify(req.body),
                    signature,
                    webhookSecret
                );
            }
        } catch (err) {
            console.log(`⚠️ Webhook signature verification failed: ${err.message}`);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
        
        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                console.log(`✅ Payment intent succeeded: ${paymentIntent.id}`);
                
                // Extract orderId and userId from metadata
                const { orderId, userId } = paymentIntent.metadata;
                console.log(`Order ID: ${orderId}, User ID: ${userId}`);
                
                // You could trigger additional processing here
                // For example, updating order status in your database
                
                break;
                
            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object;
                console.log(`❌ Payment failed: ${failedPayment.id}`);
                
                // Handle failed payment - you could notify the user or update status
                
                break;
                
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        
        // Return a 200 response to acknowledge receipt of the event
        res.status(200).json({received: true});
    } catch (err) {
        console.error(`Error processing webhook: ${err.message}`);
        res.status(500).send(`Server Error: ${err.message}`);
    }
});

// Send confirmation email
router.post('/send-confirmation', protect, async (req, res) => {
    try {
        const { orderId, courses, amount } = req.body;
        const { email, name } = req.user;

        // If email functionality is disabled, return success but with a note
        if (!emailFunctionalityEnabled) {
            console.log('Email sending skipped due to configuration issues');
            return res.status(200).json({ 
                message: 'Order processed successfully. Email delivery is currently unavailable.',
                emailSent: false
            });
        }

        // Create email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Course Purchase Confirmation',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: #6366f1; padding: 20px; border-radius: 10px; color: white; text-align: center; margin-bottom: 20px;">
                        <h1 style="margin: 0;">Thank You for Your Purchase!</h1>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <p style="font-size: 16px; color: #333;">Dear ${name},</p>
                        
                        <p style="font-size: 16px; color: #333;">Your order has been confirmed. Here are your order details:</p>
                        
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderId}</p>
                            <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${amount}</p>
                        </div>
                        
                        <h3 style="color: #333;">Purchased Courses:</h3>
                        <ul style="list-style: none; padding: 0;">
                            ${courses.map(course => `
                                <li style="padding: 10px; background: #f8f9fa; margin-bottom: 10px; border-radius: 5px;">
                                    <strong>${course.title}</strong><br>
                                    <span style="color: #666;">Duration: ${course.duration} hours</span>
                                </li>
                            `).join('')}
                        </ul>
                        
                        <p style="font-size: 16px; color: #333; margin-top: 20px;">
                            You can access your courses by visiting your profile page.
                        </p>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="http://localhost:3000/profile" 
                               style="background: #6366f1; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                View My Courses
                            </a>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
                        <p>If you have any questions, please contact our support team.</p>
                    </div>
                </div>
            `
        };

        // Send email
        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ 
                message: 'Confirmation email sent successfully',
                emailSent: true
            });
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            // Still return success, but note the email failed
            res.status(200).json({ 
                message: 'Order processed successfully. Email delivery failed.',
                emailSent: false
            });
        }
    } catch (error) {
        console.error('Error in confirmation process:', error);
        res.status(500).json({ message: 'Order processing error' });
    }
});

module.exports = router; 