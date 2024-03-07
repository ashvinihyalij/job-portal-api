import mongoose from "mongoose";
import validator from "validator";
// schema
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required']
        },
        lastName: {
            type: String,
            
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            //validate: validator.isEmail
            validate: {
                validator: validator.isEmail,
                message: props => `${props.value} is not a valid email address!`
            }
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password should be more than 6 characters']
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