import { User } from "../model/authSchema.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import validator from "validator";

/* -------- GET ALL DOCTORS -------- */
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select(
      "_id name email role"
    );

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
      tagType: "Doctor", // For RTK Query cache invalidation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
      error: error.message,
    });
  }
};

/* -------- GET SINGLE DOCTOR BY ID -------- */
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID format",
      });
    }

    const doctor = await User.findById(id).select("_id name email role");

    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
      tagType: "Doctor",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctor",
      error: error.message,
    });
  }
};

/* -------- ADD NEW DOCTOR -------- */
export const addDoctor = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation - Check required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All required fields (name, email, password, role) must be filled",
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validate password strength
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
      });
    }

    // Validate role
    const validRoles = ["admin", "doctor", "receptionist", "patient"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${validRoles.join(", ")}`,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with role
    const newDoctor = await User.create({
      name: name.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      subscriptionPlan: "free",
    });

    // Return created doctor without password
    const doctorResponse = newDoctor.toObject();
    delete doctorResponse.password;

    res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      data: doctorResponse,
      tagType: "Doctor",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add doctor",
      error: error.message,
    });
  }
};

/* -------- UPDATE DOCTOR -------- */
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID format",
      });
    }

    // Find doctor first to ensure it exists and is a doctor
    const doctor = await User.findById(id);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Prepare update object
    const updateData = {};

    // Validate and update name if provided
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length < 3) {
        return res.status(400).json({
          success: false,
          message: "Name must be at least 3 characters long",
        });
      }
      updateData.name = name.toLowerCase();
    }

    // Validate and update email if provided
    if (email !== undefined) {
      if (!validator.isEmail(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      // Check if new email is already in use by another user
      const emailExists = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: id },
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
      updateData.email = email.toLowerCase();
    }

    // Validate and update role if provided
    if (role !== undefined) {
      const validRoles = ["admin", "doctor", "receptionist", "patient"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: `Invalid role. Must be one of: ${validRoles.join(", ")}`,
        });
      }
      updateData.role = role;
    }

    // If no valid fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided to update",
      });
    }

    // Update doctor
    const updatedDoctor = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("_id name email role");

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: updatedDoctor,
      tagType: "Doctor",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update doctor",
      error: error.message,
    });
  }
};
