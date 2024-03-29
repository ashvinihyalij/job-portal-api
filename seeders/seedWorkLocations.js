import workLocation from "../models/workLocation.js";
import connectDb from '../config/mongoose.js';
import logger from '../utils/winston/index.js';
// Run 'node seeders/seedWorkLocations.js' to seed work locations
const locations = [
    { name: 'Mumbai' },
    { name: 'Pune'},
    { name: 'Banglore' },
    { name: 'Hydrabad' },
    { name: 'Noida' },
    { name: 'Chennai' }
];

const seedWorkLocations = async () => {
    await connectDb();
    try {
        await workLocation.deleteMany(); // Optional: clears the collection before seeding
        await workLocation.insertMany(locations);
        logger.info('Work locations data successfully seeded');
      } catch (error) {
        logger.error(`Error while seeding work locations data:${error}`);
      }
      process.exit();
};

seedWorkLocations();
