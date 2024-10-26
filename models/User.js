const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true, 
        match: [emailRegex, 'Please fill a valid email address'] 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        default: 'user', 
        enum: ['admin', 'user'] // Restrict to specific roles
    },
    passwordResetToken: { 
        type: String 
    },
    passwordResetExpires: { 
        type: Date 
    }
}, { timestamps: true });

// Hash the password before saving a new user
User Schema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare entered password with hashed password in the database
User Schema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to update user role
User Schema.methods.updateRole = function(newRole) {
    if (['admin', 'user'].includes(newRole)) {
        this.role = newRole;
    }
};

// Method to set password reset token and expiration
User Schema.methods.setPasswordResetToken = function(token) {
    this.passwordResetToken = token;
    this.passwordResetExpires = Date.now() + 3600000; // 1 hour
};

module.exports = mongoose.model('User ', UserSchema);
