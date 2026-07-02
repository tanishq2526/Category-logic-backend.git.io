import "dotenv/config";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

const seedAdmin = async () => {
  try {
    await connectDB();
    const email = "admin@test.com";
    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({
        name: "Admin",
        email: email,
        password: await bcrypt.hash("12345678", 10),
        role: "admin",
        status: "active"
      });
      await user.save();
      console.log("Admin user created successfully! Email: admin@test.com, Password: 12345678");
    } else {
      user.password = await bcrypt.hash("12345678", 10);
      user.role = "admin";
      await user.save();
      console.log("Admin user already existed. Password reset to: 12345678 and role ensured as admin.");
    }
  } catch (err) {
    console.error("Error seeding admin:", err);
  } finally {
    process.exit(0);
  }
};

seedAdmin();
