const dotenv = require("dotenv");
const path = require("path");

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, "../../.env") });

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  mongoose: {
    url: process.env.MONGO_URI,
    options: {
      maxPoolSize: 10,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES || "7d",
  },
  admin: {
    secret: process.env.ADMIN_SECRET,
  },
};

// Required environment configuration
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI env variable is required");
}
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET env variable is required");
}
if (!process.env.ADMIN_SECRET) {
  console.warn("WARNING: ADMIN_SECRET env variable is not set. Admin registration is disabled until ADMIN_SECRET is defined.");
}

module.exports = config;
