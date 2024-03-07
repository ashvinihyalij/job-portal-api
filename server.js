// Packages imports
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import setupMorgan from './utils/morgan/index.js';
// File imports
import connectDb from './utils/mongoose/index.js'; // In module js need to add file extension otherwise it shows error
import testRoutes from './routes/testRoutes.js';
import errorHandler from './middelwares/errorHandler.js';
import setupRoutes from './routes/index.js';
//Dot env config
dotenv.config();

// Mongo DB connection
connectDb();

const app = express();

// middelwares
app.use(express.json());
app.use(cors());
setupMorgan(app);

// routes
app.use('/api/v1/test', testRoutes);
setupRoutes(app);
app.use(errorHandler);
//port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Node server is running in ${process.env.DEV_MODE} mode on port ${PORT}`);
});