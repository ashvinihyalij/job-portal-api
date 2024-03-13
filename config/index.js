import * as dotenv from "dotenv";
dotenv.config();

const { PORT, DEV_MODE, MONGO_URL, BASE_URL, BCRYPT_SALT, SECRET_ACCESS_TOKEN } = process.env;

export { PORT, DEV_MODE, MONGO_URL, BASE_URL, BCRYPT_SALT, SECRET_ACCESS_TOKEN };