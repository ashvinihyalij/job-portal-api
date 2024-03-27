import mongoose from 'mongoose';
//import jobCategory from "./jobCategoryModel.js";
import mongoosePaginate from 'mongoose-paginate-v2';
const jobTemplateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobCategory',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  templateStatus: {
    type: String,
    required: true,
    enum: [0, 1], // 1 => 'active', 0 => 'inactive'
    default: 1,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

// Apply the pagination plugin
jobTemplateSchema.plugin(mongoosePaginate);

// Middleware to automatically exclude soft deleted documents
jobTemplateSchema.pre(/^find/, function(next) {
  // `this` points to the current query
  this.find({ is_deleted: { $ne: true } });
  next();
});

// Instance method for soft delete
jobTemplateSchema.methods.softDelete = async function() {
  this.is_deleted = true;
  await this.save();
};

export default mongoose.model('JobTemplate', jobTemplateSchema);
