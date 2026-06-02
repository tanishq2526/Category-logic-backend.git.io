const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'routes', 'auth.js');
let code = fs.readFileSync(filePath, 'utf8');

const startMarker = '// @route   POST /api/auth/register';
const endMarker = '// @route   POST /api/auth/login';

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newCode = code.substring(0, startIndex) + `// @route   POST /api/auth/register
// @desc    Unified registration for user, vendor, and admin
// @access  Public
router.post("/register", registerLimiter, async (req, res) => {
  try {
    const { name, email, password, phone, role, secretKey, shopName } = req.body;

    if (!name?.trim() || !email?.trim() || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and role are required",
      });
    }

    if (!["user", "vendor", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    if (role === "admin" && secretKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({
        success: false,
        message: "Invalid admin secret key",
      });
    }

    if (role === "vendor") {
      if (!shopName?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Shop name is required for vendors",
        });
      }
      if (!phone?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Phone number is required for vendors",
        });
      }
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email is already registered" });
    }

    let newUser;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "vendor") {
      const slug = await generateUniqueSlug(shopName.trim());
      try {
        newUser = await User.create({
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          phone: phone?.trim() || "",
          role: "vendor",
        });

        const createdVendor = await Vendor.create({
          user: newUser._id,
          shopName: shopName.trim(),
          slug,
          status: "pending",
        });

        newUser.vendorProfile = createdVendor._id;
        await newUser.save();

        return res.status(201).json({
          success: true,
          message: "Vendor registered successfully. Your account is pending admin approval.",
          vendor: {
            shopName: createdVendor.shopName,
            slug: createdVendor.slug,
            status: createdVendor.status,
          },
        });
      } catch (err) {
        if (newUser) {
          await User.findByIdAndDelete(newUser._id).catch(() => null);
        }
        throw err;
      }
    } else {
      newUser = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone?.trim() || "",
        role,
      });
      return sendAuthResponse(res, 201, \`\${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully\`, newUser);
    }
  } catch (error) {
    console.error("Register error:", error);
    if (error?.code === 11000) {
      const duplicateField = Object.keys(error.keyValue || {})[0];
      const message = duplicateField === "email"
          ? "Email is already registered"
          : duplicateField === "slug"
          ? "Shop name is already taken. Choose another."
          : "Duplicate field value. Please use a different value.";
      return res.status(409).json({ success: false, message });
    }
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

` + code.substring(endIndex);

  fs.writeFileSync(filePath, newCode);
  console.log("Successfully updated routes/auth.js");
} else {
  console.log("Markers not found");
}
