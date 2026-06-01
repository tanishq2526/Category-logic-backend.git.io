/*
 * middleware/authMiddleware.js
 *
 * Authentication & Authorization middleware.
 * Every protected route in this app passes through one or more of these.
 *
 * ─── What's in this file ─────────────────────────────────────────────────────
 *
 *   protect          → Verifies the JWT, fetches the user from DB, attaches
 *                      the full user object to req.user.
 *                      Must run FIRST on any protected route.
 *
 *   admin            → Legacy role check. Confirms req.user.role === "admin".
 *                      Still used by existing order/user routes — do not remove.
 *
 *   authorizeRoles   → Flexible role guard. Accepts one or more role strings.
 *                      Use this for ALL new routes (vendor, admin, future roles).
 *                      Must run AFTER protect.
 *
 * ─── Typical middleware chain ─────────────────────────────────────────────────
 *
 *   Admin route:
 *     protect → authorizeRoles("admin") → controller
 *
 *   Vendor route:
 *     protect → authorizeRoles("vendor") → attachVendorContext → validateVendorOwnership → controller
 *
 *   Route open to both admin and vendor:
 *     protect → authorizeRoles("admin", "vendor") → controller
 *
 * ─── Token sources (in priority order) ───────────────────────────────────────
 *   1. Authorization header:  Authorization: Bearer <token>
 *   2. HTTP-only cookie:      token=<token>  (set by /api/auth/login)
 */

import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ─────────────────────────────────────────────────────────────────────────────
// protect
// Verifies the JWT and attaches the full user document to req.user.
// Any middleware or controller that runs after this can safely read req.user.
// ─────────────────────────────────────────────────────────────────────────────
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Read token from Authorization header first, fall back to cookie.
    // This supports both Postman/API clients (Bearer) and browser clients (cookie).
    const token =
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null) || req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Please log in.",
      });
    }

    // Decode and verify the token using the secret from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the full user from DB (so req.user has the latest role, status, etc.)
    // Exclude the password field — never expose it downstream
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      // Token was valid but the user no longer exists (e.g. account deleted)
      return res.status(401).json({
        success: false,
        message: "User account not found. Please log in again.",
      });
    }

    // Attach the user to the request — available in every middleware/controller after this
    req.user = user;

    next();
  } catch (error) {
    console.error("protect middleware error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// admin  (legacy — kept for backward compatibility)
// Checks that req.user.role === "admin".
// Still used internally by existing routes/order.js and routes/user.js.
// For all NEW routes, use authorizeRoles("admin") instead.
// ─────────────────────────────────────────────────────────────────────────────
const admin = (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// authorizeRoles(...roles)
//
// A flexible, reusable role guard.
// Pass one or more allowed role strings — the user must have one of them.
//
// MUST run after protect (needs req.user to be set).
//
// Examples:
//   authorizeRoles("admin")            → only admins
//   authorizeRoles("vendor")           → only vendors
//   authorizeRoles("admin", "vendor")  → admins OR vendors
//
// How it works:
//   authorizeRoles("admin") returns a middleware function.
//   That middleware function checks if req.user.role is in the allowed list.
//   If yes → next(). If no → 403 Forbidden.
// ─────────────────────────────────────────────────────────────────────────────
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // req.user is guaranteed to exist here because protect ran before this
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This route requires role: ${roles.join(" or ")}.`,
      });
    }

    next();
  };
};

export { protect, admin, authorizeRoles };

// /*
//  * Handover note:
//  * Authentication & authorization middleware.
//  *
//  * Features:
//  *  - Supports Bearer token and cookie token
//  *  - Verifies JWT
//  *  - Fetches full user from DB
//  *  - Attaches clean req.user object
//  *  - Admin role protection
//  */

// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// // ─────────────────────────────────────────────────────────────
// // Protect Routes Middleware
// // ─────────────────────────────────────────────────────────────
// const protect = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     // Support BOTH:
//     // 1. Authorization: Bearer TOKEN
//     // 2. Cookie token
//     const token =
//       (authHeader && authHeader.startsWith("Bearer ")
//         ? authHeader.split(" ")[1]
//         : null) || req.cookies?.token;

//     // No token
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "No token provided",
//       });
//     }

//     // Verify JWT
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Fetch user from DB
//     const user = await User.findById(decoded.id).select("-password");

//     // User not found
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Attach user to request
//     req.user = user;

//     next();
//   } catch (error) {
//     console.error("JWT Verify Error:", error.message);

//     return res.status(401).json({
//       success: false,
//       message: "Invalid token",
//     });
//   }
// };

// // ─────────────────────────────────────────────────────────────
// // Admin Middleware
// // ─────────────────────────────────────────────────────────────
// const admin = (req, res, next) => {
//   try {
//     if (req.user && req.user.role === "admin") {
//       return next();
//     }

//     return res.status(403).json({
//       success: false,
//       message: "Not authorized as admin",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export { protect, admin };
