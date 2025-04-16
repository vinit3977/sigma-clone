const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/userModel');

// Get user profile
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        
        // Find user and update
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { 
                name,
                email,
                phone,
                address
            },
            { 
                new: true,
                runValidators: true
            }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

// Purchase courses
router.post('/purchase-courses', protect, async (req, res) => {
    try {
        const { courses } = req.body;
        
        // Update user's purchased courses using findOneAndUpdate
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.user._id },
            { 
                $addToSet: { 
                    purchasedCourses: { $each: courses } 
                } 
            },
            { 
                new: true,
                runValidators: true
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ 
            message: 'Courses purchased successfully', 
            purchasedCourses: updatedUser.purchasedCourses 
        });
    } catch (error) {
        console.error('Error purchasing courses:', error);
        res.status(500).json({ message: 'Failed to purchase courses' });
    }
});

// Get username
router.get('/username', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('name username');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            name: user.name,
            username: user.username
        });
    } catch (error) {
        console.error('Error fetching username:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 