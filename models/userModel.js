import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { SECRET_ACCESS_TOKEN, BCRYPT_SALT } from '../config/index.js';

// schema
const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String            
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        phoneNumber: {
            type: String,
            default: ''
        },
        isActive: {
            type: Boolean,
            default: false
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            required: true,
            default: "msp",
        },
        roleStatus: {
            type: Number,
            enum: [1, 2],
            default: 2
        },
        about: {
            type: String,
            default: ''
        }
    },
    {timestamps: true}
);
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const hash = await bcrypt.hash(this.password, Number(BCRYPT_SALT));
    this.password = hash;
    console.log(this);
    next();
});

userSchema.statics.findUser = async function(condition, password = false) {
    if(password) {
        return this.findOne(condition).select('+password').exec();
    }
    return this.findOne(condition).select('-password').exec();
};

userSchema.statics.createUser = async function(params) {
    const user = new this(params);
    try {
        // This is automatically wrapped in a Promise because the function is async
        return await user.save();        
    } catch (error) {
        throw error; // This will cause the promise to be rejected with the thrown error
    }
};

userSchema.statics.findUserById = async function(userId, password = false) {
    if(password) {
        return await this.findById(userId).select('+password');
    }
    return await this.findById(userId);
};

userSchema.methods.generateAccessJWT = function () {
    let payload = {
        id: this._id,
    };
    
    return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
        expiresIn: '20m',
    });
};

export default mongoose.model('User', userSchema);