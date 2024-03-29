import department from "../models/department.js";
import connectDb from '../config/mongoose.js';
import logger from '../utils/winston/index.js';
// Run 'node seeders/seedDepartments.js' to seed work locations
const departments = [
    { name: 'Development' },
    { name: 'QA'},
    { name: 'VA' },
    { name: 'SEO' },
    { name: 'Accounting' },
    { name: 'Sales' },
    { name: 'HR' },
    { name: 'Designing' }
];

const seedDepartments = async () => {
    await connectDb();
    try {
        await department.deleteMany(); // Optional: clears the collection before seeding
        await department.insertMany(departments);
        logger.info('Department successfully seeded');
      } catch (error) {
        logger.error(`Error while seeding department data:${error}`);
      }
      process.exit();
};

seedDepartments();
