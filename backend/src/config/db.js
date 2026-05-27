const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async () => {
  try {
    if (!config.mongoose.url) {
      throw new Error("MongoDB URI is not defined in configuration.");
    }
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    console.log("MongoDB Connected Successfully :)");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
