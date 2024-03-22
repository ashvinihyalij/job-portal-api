import jobCategory from "../models/jobCategoryModel.js";
import connectDb from '../config/mongoose.js';
import logger from '../utils/winston/index.js';
// Run 'node seeders/seedJobCategories.js' to seed categories
const categories = [
    { title: 'Administrative' },
    { title: 'Light Industrial'},
    { title: 'Touch Labor' },
    { title: 'Professional' }
];

const seedJobCategories = async () => {
    await connectDb();
    try {
        await jobCategory.deleteMany(); // Optional: clears the collection before seeding
        await jobCategory.insertMany(categories);
        logger.info('Data successfully seeded');
      } catch (error) {
        logger.error(`Error seeding data:${error}`);
      }
      process.exit();
};

seedJobCategories();
