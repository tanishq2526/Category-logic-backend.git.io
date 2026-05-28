/*
 * Backend Application Entry
 * Fully corrected version with:
 * ✅ Proper CORS
 * ✅ JWT auth support
 * ✅ Cookie support
 * ✅ Protected routes
 * ✅ Static uploads
 * ✅ Global error handling
 * ✅ Order routes fixed
 * ✅ No duplicate middleware execution
 */

import "dotenv/config";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// ─────────────────────────────────────────────────────────────
// LOCAL IMPORTS
// ─────────────────────────────────────────────────────────────
import connectDB from "./config/db.js";
import { protect } from "./middleware/authMiddleware.js";

// Routes
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/category.js";
import subCategoryRoutes from "./routes/subCategory.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import couponRoutes from "./routes/coupon.js";
import variantRoutes from "./routes/variant.js";
import profileRoutes from "./routes/profile.js";
import giftCardRoutes from "./routes/giftCard.js";
import orderRoutes from "./routes/order.js";
import userRoutes from "./routes/user.js";

// ─────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────
dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

// Frontend URLs allowed
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// ─────────────────────────────────────────────────────────────
// DATABASE
// ─────────────────────────────────────────────────────────────
connectDB();

// ─────────────────────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────────────────────

// ✅ CORS FIXED (Allows localhost:5174 via .env)
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman/mobile/curl/no-origin requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },

    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ✅ BODY PARSERS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ COOKIE PARSER
app.use(cookieParser());

// ✅ STATIC FOLDERS
app.use("/uploads", express.static("uploads"));
app.use(express.static("frontend"));

// ─────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────

// PUBLIC
app.use("/api/auth", authRoutes);

// PROTECTED
app.use("/api/category", protect, categoryRoutes);
app.use("/api/subCategory", protect, subCategoryRoutes);
app.use("/api/product", protect, productRoutes);
app.use("/api/variant", protect, variantRoutes);
app.use("/api/cart", protect, cartRoutes);
app.use("/api/coupon", protect, couponRoutes);
app.use("/api", protect, profileRoutes);
app.use("/api/giftCard", protect, giftCardRoutes);

/*
 * IMPORTANT:
 * Order routes already use protect/admin
 * inside routes/order.js
 *
 * DO NOT APPLY protect HERE AGAIN
 */
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

// ─────────────────────────────────────────────────────────────
// TEST ROUTE
// ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Running Successfully",
  });
});

// ─────────────────────────────────────────────────────────────
// GLOBAL ERROR HANDLER
// ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  // If headers already sent
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || err.status || 500;

  let message = err.message || "Internal Server Error";

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = "File too large. Maximum size is 5MB.";
  }

  // Multer generic
  if (err.name === "MulterError") {
    statusCode = 400;
  }

  return res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal Server Error" : message,
  });
});

// ─────────────────────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────────────────────
app.listen(port, () => {
  console.log(`
========================================
🚀 Server running successfully
🌍 PORT: ${port}
========================================
`);
});
// /*
//  * Handover note: Backend application entry point.
//  * Loads environment variables, connects MongoDB, configures CORS/JSON/static uploads,
//  * mounts each feature route under /api, and starts the Express server.
//  * Follow requests from here into backend/routes/*, then into backend/models/* for database shape.
//  *
//  * FIX (order routes): Removed the duplicate `protect` that was applied at mount level.
//  * Every individual route inside routes/order.js already declares `protect` (and `admin`
//  * where needed), so applying it again here was running the middleware twice per request.
//  */
// import "dotenv/config";
// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";

// // Local imports MUST have .js extension
// import connectDB from "./config/db.js";

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 3000;

// // Build allowed-origins list from CLIENT_URL env var (comma-separated)
// const allowedOrigins = (process.env.CLIENT_URL || "")
//   .split(",")
//   .map((origin) => origin.trim())
//   .filter(Boolean);

// // ── Database Connection ────────────────────────────────────────────────────────
// connectDB();

// // ── Middleware ─────────────────────────────────────────────────────────────────
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Allow requests with no origin (e.g. mobile apps, curl, Postman)
//       if (!origin || allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }
//       return callback(new Error("Not allowed by CORS"));
//     },
//   }),
// );

// app.use("/uploads", express.static("uploads"));
// app.use(express.json());
// app.use(express.static("frontend"));

// // ── Auth middleware (used only where needed at mount level) ────────────────────
// import { protect } from "./middleware/authMiddleware.js";

// // ── Route imports ──────────────────────────────────────────────────────────────
// import authRoutes from "./routes/auth.js";
// import categoryRoutes from "./routes/category.js";
// import subCategoryRoutes from "./routes/subCategory.js";
// import productRoutes from "./routes/product.js";
// import cartRoutes from "./routes/cart.js";
// import couponRoutes from "./routes/coupon.js";
// import variantRoutes from "./routes/variant.js";
// import profileRoutes from "./routes/profile.js";
// import giftCardRoutes from "./routes/giftCard.js";
// import orderRoutes from "./routes/order.js";

// // ── Route mounting ─────────────────────────────────────────────────────────────
// // Auth is public — no protect here
// app.use("/api/auth", authRoutes);

// // These routes rely on protect applied at mount level (routes inside don't re-apply it)
// app.use("/api/category", protect, categoryRoutes);
// app.use("/api/subCategory", protect, subCategoryRoutes);
// app.use("/api/product", protect, productRoutes);
// app.use("/api/variant", protect, variantRoutes);
// app.use("/api/cart", protect, cartRoutes);
// app.use("/api/coupon", protect, couponRoutes);
// app.use("/api", protect, profileRoutes);
// app.use("/api/giftCard", protect, giftCardRoutes);

// // ⚠️  Order routes: protect is NOT applied at mount level here.
// //    Every route inside routes/order.js already declares protect (and admin)
// //    individually — applying it again at mount would run the middleware twice,
// //    causing unnecessary DB lookups and potential token-decode conflicts.
// app.use("/api/orders", orderRoutes);

// // ── Global error handler ───────────────────────────────────────────────────────
// app.use((err, req, res, next) => {
//   console.error(err);

//   if (res.headersSent) {
//     return next(err);
//   }

//   const statusCode =
//     err.name === "MulterError" ? 400 : err.statusCode || err.status || 500;

//   const message =
//     err.code === "LIMIT_FILE_SIZE"
//       ? "File too large. Maximum size is 5MB."
//       : err.message || "Request failed";

//   return res.status(statusCode).json({
//     success: false,
//     message: statusCode === 500 ? "Internal server error" : message,
//   });
// });

// // ── Start ──────────────────────────────────────────────────────────────────────
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// // /*
// //  * Handover note: Backend application entry point.
// //  * Loads environment variables, connects MongoDB, configures CORS/JSON/static uploads,
// //  * mounts each feature route under /api, and starts the Express server.
// //  * Follow requests from here into backend/routes/*, then into backend/models/* for database shape.
// //  */
// // import "dotenv/config";
// // import express from "express";
// // import dotenv from "dotenv";
// // import cors from "cors";

// // // 1. Local imports MUST have .js extension
// // import connectDB from "./config/db.js";

// // dotenv.config();

// // const app = express();
// // const port = process.env.PORT || 3000;
// // const allowedOrigins = (process.env.CLIENT_URL || "")
// //   .split(",")
// //   .map((origin) => origin.trim())
// //   .filter(Boolean);

// // // Database Connection
// // connectDB();

// // // Middleware
// // app.use(
// //   cors({
// //     origin: (origin, callback) => {
// //       if (!origin || allowedOrigins.includes(origin)) {
// //         return callback(null, true);
// //       }

// //       return callback(new Error("Not allowed by CORS"));
// //     },
// //   }),
// // );
// // app.use("/uploads", express.static("uploads"));
// // app.use(express.json());
// // app.use(express.static("frontend"));

// // // 2. Import the new protect middleware we created
// // import { protect } from "./middleware/authMiddleware.js";

// // // 3. Import Routes (with .js extensions)
// // import authRoutes from "./routes/auth.js";
// // import categoryRoutes from "./routes/category.js";
// // import subCategoryRoutes from "./routes/subCategory.js";
// // import productRoutes from "./routes/product.js";
// // import cartRoutes from "./routes/cart.js";
// // import couponRoutes from "./routes/coupon.js";
// // import variantRoutes from "./routes/variant.js";
// // import profileRoutes from "./routes/profile.js";
// // import giftCardRoutes from "./routes/giftCard.js";
// // import orderRoutes from "./routes/order.js";

// // // Use Routes (Swapped verifyToken for protect)
// // app.use("/api/auth", authRoutes);
// // app.use("/api/category", protect, categoryRoutes);
// // app.use("/api/subCategory", protect, subCategoryRoutes);
// // app.use("/api/product", protect, productRoutes);
// // app.use("/api/variant", protect, variantRoutes);
// // app.use("/api/cart", protect, cartRoutes);
// // app.use("/api/coupon", protect, couponRoutes);
// // app.use("/api", protect, profileRoutes);
// // app.use("/api/giftCard", protect, giftCardRoutes);
// // app.use("/api/orders", protect, orderRoutes);

// // // Error Handling Middleware
// // app.use((err, req, res, next) => {
// //   console.error(err);

// //   if (res.headersSent) {
// //     return next(err);
// //   }

// //   const statusCode =
// //     err.name === "MulterError" ? 400 : err.statusCode || err.status || 500;
// //   const message =
// //     err.code === "LIMIT_FILE_SIZE"
// //       ? "File too large. Maximum size is 5MB."
// //       : err.message || "Request failed";

// //   return res.status(statusCode).json({
// //     success: false,
// //     message: statusCode === 500 ? "Internal server error" : message,
// //   });
// // });

// // // Server Start
// // app.listen(port, () => {
// //   console.log(`Server is running on port ${port}`);
// // });
