import mongoose from "mongoose";
import validator from "validator";
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
            unique: true,            
        },
        password: {
            type: String,
            required: true            
        },
        location: {
            type: String,
            default: 'mumbai'
        },
        active: {
            type: Boolean,
            default: false
        },
    },
    {timestamps: true}
);

export default mongoose.model('User', userSchema);