import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../models/authModel.js";

// Login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user in both tables
    const result = await findUserByEmail(email);

    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const { user, userType } = result;

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.pass);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        userType: userType,
        ...(userType === "admin" && { companyName: user.company_name }),
        ...(userType === "sales_manager" && { 
          employeeCode: user.employee_code,
          adminId: user.admin_id 
        }),
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Prepare user data (exclude password)
    const userData = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      profileImage: user.profile_image,
      region: user.region,
      city: user.city,
      street: user.street,
      isActive: user.is_active,
      userType: userType,
      ...(userType === "admin" && {
        companyName: user.company_name,
        adminName: user.admin_name,
      }),
      ...(userType === "sales_manager" && {
        employeeCode: user.employee_code,
        fullName: user.full_name,
        designation: user.designation,
        adminId: user.admin_id,
        notes: user.notes,
      }),
    };

    // Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
