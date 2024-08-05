
import * as dotenv from 'dotenv';

dotenv.config();

export const PORT = +process.env.PORT || 3000;

export const DB_HOST = process.env.DB_HOST
export const DB_PORT = +process.env.DB_PORT
export const DB_USERNAME = process.env.DB_USERNAME
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_NAME = process.env.DB_NAME

export const SALT_ROUNDS = +process.env.SALT_ROUNDS

export const SECRET_VERIFICATION_TOKEN = process.env.SECRET_VERIFICATION_TOKEN

export const SECRET_LOGIN_TOKEN = process.env.SECRET_LOGIN_TOKEN
export const PREFIX_LOGIN_TOKEN = process.env.PREFIX_LOGIN_TOKEN
export const TIME_EXPIRE_TOKEN = process.env.TIME_EXPIRE_TOKEN

export const CLOUD_NAME = process.env.CLOUD_NAME
export const API_KEY = process.env.API_KEY
export const API_SECRET = process.env.API_SECRET

export const MAIN_FOLDER = process.env.MAIN_FOLDER
export const CLIENT_ID = process.env.CLIENT_ID





