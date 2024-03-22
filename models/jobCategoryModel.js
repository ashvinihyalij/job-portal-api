import mongoose from "mongoose";

const jobCategorySchema = new mongoose.Schema({
    title: {
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

  export default mongoose.model('JobCategory', jobCategorySchema);