const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: { 
        type: String, 
        required: true 
    },
    address: { 
        type: String 
    },
    phoneNumber: { 
        type: String 
    },
    gender: { 
        type: Boolean 
    },
    image: { 
        type: String 
    },
    roleId: { 
        type: String 
    },
    positionId: { 
        type: String 
    }
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;