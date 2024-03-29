import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Number,
      default: 1,
      enum: [0, 1]
    }
  }, { timestamps: true });

  export default mongoose.model('Department', departmentSchema);