
/*
 * Handover note: User/admin account schema.
 * Auth routes create and read these documents; role controls whether the frontend
 * sends the person to the admin dashboard or the user shopping experience.
 */
// const mongoose = require("mongoose");
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
  },
  { timestamps: true },
);

// module.exports = mongoose.model("User", UserSchema);
const User = mongoose.model("User", UserSchema);
export default User;
