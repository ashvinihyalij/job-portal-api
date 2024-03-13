import mongoose from "mongoose";
import bcrypt from "bcrypt";
const bcryptSalt = process.env.BCRYPT_SALT;
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
    const hash = await bcrypt.hash(this.password, Number(bcryptSalt));
    this.password = hash;
    next();
});
export default mongoose.model('User', userSchema);