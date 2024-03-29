import * as dotenv from "dotenv";
dotenv.config();

const { PORT, DEV_MODE, MONGO_URL, BASE_URL, BCRYPT_SALT, SECRET_ACCESS_TOKEN } = process.env;

const DEFAULT_PAGE_LIMIT = 10;
const DEFAULT_SORT_ORDER = 'desc';
const DEFAULT_SORT_FIELD = 'createdAt';

const ROLES = {
    SuperAdmin: 'superadmin',
    HiringManager: 'hiringmanager',
    Recruiter: 'recruiter'
};

export { PORT, DEV_MODE, MONGO_URL, BASE_URL, BCRYPT_SALT, SECRET_ACCESS_TOKEN, DEFAULT_PAGE_LIMIT, DEFAULT_SORT_ORDER, DEFAULT_SORT_FIELD, ROLES };