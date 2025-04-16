const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Transaction = require('../models/transactionModel');
const Course = require('../models/courseModel');

// Get user transactions
router.get('/user', protect, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id })
            .populate({
                path: 'courses.course',
                select: 'title description image duration category'
            })
            .sort({ createdAt: -1 });
        
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching user transactions:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new transaction
router.post('/', protect, async (req, res) => {
    try {
        const { orderId, courses, totalAmount } = req.body;
        
        // Validate input
        if (!orderId || !courses || !totalAmount) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        
        // Check if transaction already exists
        const existingTransaction = await Transaction.findOne({ orderId });
        if (existingTransaction) {
            return res.status(400).json({ message: 'Transaction already exists' });
        }
        
        // Create the transaction
        const transaction = await Transaction.create({
            user: req.user._id,
            orderId,
            courses,
            totalAmount,
            paymentStatus: 'completed'
        });
        
        res.status(201).json(transaction);
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ message: 'Failed to create transaction' });
    }
});

// Get transaction by ID
router.get('/:id', protect, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id)
            .populate({
                path: 'courses.course',
                select: 'title description image duration category'
            });
        
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        
        // Check if the transaction belongs to the current user
        if (transaction.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this transaction' });
        }
        
        res.json(transaction);
    } catch (error) {
        console.error('Error fetching transaction:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 