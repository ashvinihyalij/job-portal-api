import mongoose from 'mongoose';
import logger from '../utils/winston/index.js';
const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        logger.info(`Connected to mongo db database ${mongoose.connection.host}`)
    } catch (error) {
        logger.error(`MongoDb errors ${error}`);
    }
}

export default connectDb;
