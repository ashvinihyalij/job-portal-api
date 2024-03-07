import mongoose from 'mongoose';

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to mongo db database ${mongoose.connection.host}`)
    } catch (error) {
        console.log(`MongoDb errors ${error}`);
    }
}

export default connectDb;
