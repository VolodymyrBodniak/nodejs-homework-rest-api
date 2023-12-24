const dotenv = require("dotenv");

dotenv.config();

const {
  DB_MONGO_HOST,
  DB_MONGO_USER,
  DB_MONGO_PASSWORD,
  DB_MONGO_DATABASE,
  JWT_SECRET_KEY,
  SENDGRID_API_KEY,
  BASE_URL,
} = process.env;

if (!DB_MONGO_HOST) {
  console.log("DB_MONGO_HOST is not set!");
  process.exit(1);
}

if (!DB_MONGO_USER) {
  console.log("DB_MONGO_USER is not set!");
  process.exit(1);
}

if (!DB_MONGO_PASSWORD) {
  console.log("DB_MONGO_PASSWORD is not set!");
  process.exit(1);
}

if (!DB_MONGO_DATABASE) {
  console.log("DB_MONGO_DATABASE is not set!");
  process.exit(1);
}

if (!JWT_SECRET_KEY) {
  console.log("JWT_SECRET_KEY is not set!");
  process.exit(1);
}

if (!SENDGRID_API_KEY) {
  console.log("SENDGRID_API_KEY is not set!");
  process.exit(1);
}

if (!BASE_URL) {
  console.log("BASE_URL is not set!");
  process.exit(1);
}

module.exports = {
  DB_MONGO_HOST,
  DB_MONGO_USER,
  DB_MONGO_PASSWORD,
  DB_MONGO_DATABASE,
  JWT_SECRET_KEY,
  SENDGRID_API_KEY,
  BASE_URL,
};
