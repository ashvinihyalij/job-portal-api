import mongoose from 'mongoose';
import workLocation from "./workLocation.js";
import department from "./department.js";
import mongoosePaginate from 'mongoose-paginate-v2';

const jobSchema = new mongoose.Schema({
    jobTemplateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobTemplate',
        required: true
    },
    jobCode: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hiringManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    workLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkLocation',
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    numOfOpenings: {
        type: Number,
        required: true,
        default: 1
    },
    workingMode: {
        type: String,
        enum: ['Remote', 'Onsite', 'Hybrid'],
    },
    reasonForHire: {
        type: String,
        enum: ['Expansion', 'Replacement'],
    },
    shift: {
        type: String,
        enum: ['First', 'Second', 'Third', 'General'],
    },
    shiftStartTime: {
        type: Number,
        min: 0,
        max: 23
    },
    shiftEndTime: {
        type: Number,
        min: 0,
        max: 23
    },
    additionalInfo: String,
    releasedDate: {
        type: Date,
        default: null
    },
    jobStatus: {
        type: String,
        enum: ['Pending', 'Open', 'Sourcing', 'Rejected', 'Closed', 'Filled'],
        default: 'Open'
    },
    is_deleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

// Apply the pagination plugin
jobSchema.plugin(mongoosePaginate);

// Middleware to automatically exclude soft deleted documents
jobSchema.pre(/^find/, function(next) {
  // `this` points to the current query
  this.find({ is_deleted: { $ne: true } });
  next();
});

// Instance method for soft delete
jobSchema.methods.softDelete = async function() {
  this.is_deleted = true;
  await this.save();
};

const Job = mongoose.model('Job', jobSchema);

export default Job;
