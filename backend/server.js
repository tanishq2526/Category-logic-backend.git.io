import "dotenv/config";

// Core dependencies
import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Security and Middleware
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";

// Internal configurations & utilities
import logger from "./utils/logger.js";
import connectDB from "./config/db.js";
import { initSocket } from "./socket.js";
import setupCronJobs from "./cron.js";
import { protect } from "./middleware/authMiddleware.js";

// Route imports
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/category.js";
import subCategoryRoutes from "./routes/subCategory.js";
import productRoutes from "./routes/product.js";
import variantRoutes from "./routes/variant.js";
import cartRoutes from "./routes/cart.js";
import wishlistRoutes from "./routes/wishlist.js";
import couponRoutes from "./routes/coupon.js";
import giftCardRoutes from "./routes/giftCard.js";
import profileRoutes from "./routes/profile.js";
import uploadRoutes from "./routes/upload.js";
import addressRoutes from "./routes/addresses.js";
import orderRoutes from "./routes/order.js";
import userRoutes from "./routes/user.js";
import paymentRoutes from "./routes/payment.js";
import adminVendorRoutes from "./routes/adminVendorRoutes.js";
import adminAuditRoutes from "./routes/adminAuditRoutes.js";

// Vendor Route Imports
import vendorProfileRoutes from "./routes/vendor/vendorProfileRoutes.js";
import vendorCategoryRoutes from "./routes/vendor/vendorCategoryRoutes.js";
import vendorSubCategoryRoutes from "./routes/vendor/vendorSubCategoryRoutes.js";
import vendorProductRoutes from "./routes/vendor/vendorProductRoutes.js";
import vendorCouponRoutes from "./routes/vendor/vendorCouponRoutes.js";
import vendorOrderRoutes from "./routes/vendor/vendorOrderRoutes.js";
import vendorUploadRoutes from "./routes/vendor/vendorUploadRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Allowed Origins Setup
const isProd = process.env.NODE_ENV === 'production';
const allowedOrigins = isProd
  ? [process.env.FRONTEND_URL || "https://yourdomain.com"]
  : ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"];

if (process.env.CLIENT_URL) {
  process.env.CLIENT_URL.split(",").forEach(url => {
    if (!allowedOrigins.includes(url.trim())) allowedOrigins.push(url.trim());
  });
}

// Database & Socket Initialization
connectDB();
initSocket(server, allowedOrigins);

// Middleware - Security
app.use(helmet());
app.use((req, res, next) => {
  ['body', 'params', 'headers', 'query'].forEach(k => req[k] && mongoSanitize.sanitize(req[k]));
  next();
});

app.use(cors({
  origin(origin, callback) {
    if (!origin && !isProd) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", apiLimiter);

// Middleware - Razorpay Webhook Parser
// Note: Must be placed before express.json() for valid HMAC signature verification
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

// Middleware - Standard Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("frontend"));

// Documentation & Health Check
const swaggerDocument = JSON.parse(fs.readFileSync(new URL('./swagger.json', import.meta.url)));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (_req, res) => res.json({ success: true, message: "API running successfully 🚀" }));

if (process.env.NODE_ENV !== "production") {
  app.get("/test-payment", (_req, res) => res.sendFile(path.join(__dirname, "test-razorpay.html")));
}

// Routes - Public
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/subCategory", subCategoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/variant", variantRoutes);

// Routes - Protected (Customers)
app.use("/api/cart", protect, cartRoutes);
app.use("/api/wishlist", protect, wishlistRoutes);
app.use("/api/coupon", protect, couponRoutes);
app.use("/api/giftCard", protect, giftCardRoutes);
app.use("/api/addresses", addressRoutes); // Protect is inside routes
app.use("/api/admin", protect, profileRoutes);

// Routes - Orders, Users, Payments & Uploads
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/upload", uploadRoutes);

// Routes - Admin 
app.use("/api/admin/vendors", adminVendorRoutes);
app.use("/api/admin/audit-logs", adminAuditRoutes);

// Routes - Vendors (Scoped by vendorSlug)
app.use("/api/vendor/:vendorSlug", vendorProfileRoutes);
app.use("/api/vendor/:vendorSlug/categories", vendorCategoryRoutes);
app.use("/api/vendor/:vendorSlug/subcategories", vendorSubCategoryRoutes);
app.use("/api/vendor/:vendorSlug/products", vendorProductRoutes);
app.use("/api/vendor/:vendorSlug/coupons", vendorCouponRoutes);
app.use("/api/vendor/:vendorSlug/orders", vendorOrderRoutes);
app.use("/api/vendor/:vendorSlug/upload", vendorUploadRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(`GLOBAL ERROR: ${err.message}`, { error: err.stack, url: req.originalUrl, method: req.method });
  if (res.headersSent) return next(err);

  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal Server Error";

  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = "File too large. Maximum allowed size is 5 MB.";
  } else if (err.name === "MulterError") {
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal Server Error" : message,
  });
});

// Start Server
setupCronJobs();
server.listen(PORT, () => logger.info(`🚀 Server running successfully on port ${PORT}`));

export default app;
