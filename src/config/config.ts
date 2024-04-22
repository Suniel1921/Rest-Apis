import {config as conf} from 'dotenv';
conf();

const _config = {
    port : process.env.PORT,
    databaseUrl : process.env.MONGO_CONNECTION_STRING,
    env : process.env.NODE_ENV,
    jwtSecret : process.env.JWT_SECRET,
    cloudinary_name : process.env.CLOUDINARY_NAME,
    cloudinary_api_key : process.env.CLOUDINARY_API_KEY,
    cloudinary_secret_key : process.env.CLOUDINARY_SECRET_KEY,
};

export const config = Object.freeze(_config) //freeze mean it does not allowed to overwrite. read only
