import express from "express";
import bcrypt from "bcrypt";
import { User } from "../model/authSchema.js";
import { validateLogin, validateSignup } from "../lib/utils.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const authRouter = express.Router();

authRouter.get("/me", async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        return res.status(200).json({
            success: true,
            userId: decoded.id
        });

    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
});

authRouter.post("/signup", async (req, res) => {
    try {
        // STEP 1: Validation
        validateSignup(req);

        const { name, email, password } = req.body;

        // STEP 2: Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error("User already exists with this email");
        }

        // STEP 3: Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // STEP 4: Create User
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({
            message: "User created successfully",
        });

    } catch (error) {
        res.status(400).json({
            message: "Bad Request",
            error: error.message
        });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        validateLogin(req);

        const { email, password } = req.body;

        // STEP 2: Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("Invalid email or password");
        }

        const isPasswordMatch = await user.validatePassword(password);

        if (!isPasswordMatch) {
            throw new Error("Invalid email or password");
        }

        // Generate JWT Token
        const token = await user.getJwt();

        // Set cookie

        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });

        res.status(200).json({
            message: "User logged in successfully"
            
        });

    } catch (error) {
        res.status(400).json({
            message: "Bad Request",
            error: error.message
        });
    }
});

authRouter.post("/logout", (req, res) => {
    try {
        res.cookie("token", null, {
            httpOnly: true,
            expires: new Date(0),
        });

        res.json({ message: "Logout Successfully!" });

    } catch (error) {
        res.status(400).json({
            message: "Bad Request",
            error: error.message
        });
    }
});

export { authRouter };
