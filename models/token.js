import mongoose from "mongoose";
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: [true, 'User id is required'],
        ref: "User",
    },
    token: {
        type: String,
        required: [true, 'Token is required'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
});
export default mongoose.model('Token', tokenSchema);