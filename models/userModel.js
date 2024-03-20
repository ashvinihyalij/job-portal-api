import mongoose from "mongoose";
import bcrypt from "bcrypt";
//const bcryptSalt = process.env.BCRYPT_SALT;
import jwt from 'jsonwebtoken';
import { SECRET_ACCESS_TOKEN, BCRYPT_SALT } from '../config/index.js';
// schema
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        lastName: {
            type: String            
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        location: {
            type: String,
            default: 'mumbai'
        },
        active: {
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
    },
    {timestamps: true}
);
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const hash = await bcrypt.hash(this.password, Number(BCRYPT_SALT));
    this.password = hash;
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
    await user.save();
    return user;
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
        expiresIn: '60m',
    });
};

export default mongoose.model('User', userSchema);