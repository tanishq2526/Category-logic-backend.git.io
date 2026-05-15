const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");


const connectDB = require("./config/db");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Database Connection
connectDB();

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.static("frontend"));

// Import verifyToken
const verifyToken = require("./middleware/auth");

// Import Routes
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");
const subCategoryRoutes = require("./routes/subCategory");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const couponRoutes = require("./routes/coupon");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/category", verifyToken, categoryRoutes);
app.use("/api/subCategory", verifyToken, subCategoryRoutes);
app.use("/api/product", verifyToken, productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupon", verifyToken, couponRoutes);

// Server Start
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
