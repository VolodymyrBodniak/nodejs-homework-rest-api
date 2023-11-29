const mongoose = require("mongoose");
const {
  DB_MONGO_USER,
  DB_MONGO_PASSWORD,
  DB_MONGO_HOST,
  DB_MONGO_DATABASE,
} = require("../constants/env");

const setupMongoConnection = async () => {
  try {
    const status = await mongoose.connect(
      `mongodb+srv://${DB_MONGO_USER}:${DB_MONGO_PASSWORD}@${DB_MONGO_HOST}/${DB_MONGO_DATABASE}`
    );
    console.log(status);
    console.log("Mongo connection is established");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = setupMongoConnection;
