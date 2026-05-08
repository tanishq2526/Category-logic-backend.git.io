const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Database Connection
connectDB();

// Middleware
app.use(express.json());

// Routes
const categoryRoutes = require("./routes/category")
const subCategoryRoutes = require("./routes/subCategory")
const productRoutes = require("./routes/product")

app.use("/api/category", categoryRoutes)
app.use("/api/subCategory", subCategoryRoutes)
// app.use("/api/product", productRoutes)

// Server Start
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
