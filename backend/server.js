const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const fs = require("fs");

const config = require("./src/config/config");
const connectDB = require("./src/config/db");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();
const port = config.port;

// Connect Database
connectDB();

// Global Middlewares
app.use(helmet()); // Secure HTTP headers

// Standard rate limiter for production stability
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Apply rate limiting to API routes only
app.use("/api", apiLimiter);

// Enable CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Assets
app.use("/uploads", express.static("uploads"));

const frontendPath = path.resolve(__dirname, "../frontend");
const frontendDist = path.join(frontendPath, "dist");

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
} else if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
}

// Import Refactored Routes
const authRoutes = require("./src/routes/auth.routes");
const categoryRoutes = require("./src/routes/category.routes");
const subCategoryRoutes = require("./src/routes/subCategory.routes");
const productRoutes = require("./src/routes/product.routes");
const variantRoutes = require("./src/routes/variant.routes");
const cartRoutes = require("./src/routes/cart.routes");
const couponRoutes = require("./src/routes/coupon.routes");
const profileRoutes = require("./src/routes/profile.routes");
const giftCardRoutes = require("./src/routes/giftCard.routes");
const userRoutes = require("./src/routes/user.routes");

// Route Registrations
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/subCategory", subCategoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/variant", variantRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api", profileRoutes);
app.use("/api/giftCard", giftCardRoutes);

// Global Centralized Error Boundary Middleware (Must be registered last)
app.use(errorHandler);

// Start Server
app.listen(port, () => {
  console.log(`Server is running in ${config.env} mode on http://localhost:${port}`);
});
