import mongoose from 'mongoose';
import workLocation from "./workLocation.js";
import department from "./department.js";
import mongoosePaginate from 'mongoose-paginate-v2';
import { JOB_STATUS, JOB_WORKING_MODE, REASON_FOR_HIRE, ROLES, SHIFT } from '../config/index.js';


const jobSchema = new mongoose.Schema({
    jobTemplate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobTemplate',
        required: true
    },
    jobCode: {
        type: String,
        required: true,
        unique: true
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
        enum: Object.values(JOB_WORKING_MODE),
    },
    reasonForHire: {
        type: String,
        enum: Object.values(REASON_FOR_HIRE),
    },
    shift: {
        type: String,
        enum: Object.values(SHIFT),
    },
    shiftStartTime: {
        type: String
    },
    shiftEndTime: {
        type: String
    },
    releasedDate: {
        type: Date,
        default: null
    },
    jobStatus: {
        type: String,
        enum: Object.values(JOB_STATUS),
        default: JOB_STATUS.Open
    },
    budget: {
        min: {
            type: Number,
            default: null
        },
        max: {
            type: Number,
            default: null
        }
    },
    experience: {
        min: {
            type: Number,
            default: null
        },
        max: {
            type: Number,
            default: null
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdType: {
        type: String,
        enum: Object.values(ROLES),
        required: true
    },
    is_deleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

// Apply the pagination plugin
jobSchema.plugin(mongoosePaginate);

// Middleware to automatically exclude soft deleted documents
jobSchema.pre(/^find/, function (next) {
    // `this` points to the current query
    this.find({ is_deleted: { $ne: true } });
    next();
});

// Instance method for soft delete
jobSchema.methods.softDelete = async function () {
    this.is_deleted = true;
    await this.save();
};

const Job = mongoose.model('Job', jobSchema);

export default Job;
