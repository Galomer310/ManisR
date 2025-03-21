// backend/src/controllers/authController.ts

import { Request, Response } from "express";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import pool from "../config/database";
// Import our centralized types
import { User, UserRow } from "../types";

// Use the RECAPTCHA secret from environment variables
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET || "";
const saltRounds = 10;

/**
 * registerUser
 *  - Checks for honeypot and reCAPTCHA response.
 *  - Validates input fields and formats.
 *  - Verifies the phone is not already registered.
 *  - Hashes the password and inserts the new user.
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      username,
      phone,
      password,
      honeypotField,  // hidden field for bots
      captchaToken,   // reCAPTCHA token
      formLoadedTime, // client timestamp for time-limit check
    } = req.body;

    // Honeypot check
    if (honeypotField && honeypotField.trim() !== "") {
      return res.status(200).json({ message: "Registration successful" });
    }

    // reCAPTCHA validation
    const recapRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${captchaToken}`,
      { method: "POST" }
    );
    const recapData = await recapRes.json();
    if (!recapData.success) {
      return res.status(400).json({ error: "Captcha verification failed" });
    }

    // Time-limit check (at least 3000ms)
    const now = Date.now();
    if (formLoadedTime && Number(formLoadedTime) && now - formLoadedTime < 3000) {
      return res.status(400).json({ error: "Form submitted too quickly" });
    }

    // Validate required fields
    if (!username || !phone || !password) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    // Validate phone format (must start with '05' and be 10 digits)
    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: "Invalid phone number format" });
    }

    // Validate password: minimum 8 characters, at least one letter and one number
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passRegex.test(password)) {
      return res.status(400).json({
        error: "Password must be at least 8 characters with letters and numbers"
      });
    }

    // Check if user already exists using the phone number
    const [existingRows] = await pool
      .promise()
      .query<UserRow[]>("SELECT * FROM users WHERE phone = ?", [phone]);
    if (existingRows && existingRows.length > 0) {
      return res.status(400).json({ error: "User with this phone already exists." });
    }

    // Hash the password and insert the new user record
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await pool
      .promise()
      .query(
        "INSERT INTO users (username, phone, password) VALUES (?, ?, ?)",
        [username, phone, hashedPassword]
      );

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ error: "Server error during registration" });
  }
};

/**
 * loginUser
 *  - Validates login fields, reCAPTCHA, and honeypot.
 *  - Looks up the user by phone and compares the password.
 *  - Returns user data on success.
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const {
      phone,
      password,
      honeypotField,
      captchaToken,
      formLoadedTime,
    } = req.body;

    if (honeypotField && honeypotField.trim() !== "") {
      return res.status(200).json({ message: "Login successful" });
    }

    // reCAPTCHA validation
    const recapRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${captchaToken}`,
      { method: "POST" }
    );
    const recapData = await recapRes.json();
    if (!recapData.success) {
      return res.status(400).json({ error: "Captcha verification failed" });
    }

    // Time-limit check (at least 2000ms)
    const now = Date.now();
    if (formLoadedTime && Number(formLoadedTime) && now - formLoadedTime < 2000) {
      return res.status(400).json({ error: "Form submitted too quickly" });
    }

    if (!phone || !password) {
      return res.status(400).json({ error: "Please provide phone and password" });
    }

    // Query user by phone number
    const [rows] = await pool
      .promise()
      .query<UserRow[]>("SELECT * FROM users WHERE phone = ?", [phone]);
    if (!rows || rows.length === 0) {
      return res.status(400).json({ error: "Invalid phone or password" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid phone or password" });
    }

    // Return user data on successful login
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error during login" });
  }
};

/**
 * registerDetails
 *  - Saves final registration details after phone verification.
 *  - Uses honeypot and reCAPTCHA validations along with a time-limit check.
 *  - Validates required fields and correct formats, then inserts the new user record.
 */
export const registerDetails = async (req: Request, res: Response) => {
  try {
    const {
      name,
      username,
      email,
      gender,
      password,
      phone,
      honeypotField,
      captchaToken,
      formLoadedTime,
    } = req.body;

    // Honeypot check
    if (honeypotField && honeypotField.trim() !== "") {
      return res.status(200).json({ message: "Registration details saved successfully" });
    }

    // reCAPTCHA check
    const recapRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${captchaToken}`,
      { method: "POST" }
    );
    const recapData = await recapRes.json();
    console.log("reCAPTCHA response in registerDetails:", recapData);
    if (!recapData.success) {
      return res.status(400).json({ error: "Captcha verification failed" });
    }

    // Time-limit check (at least 3000ms)
    const now = Date.now();
    if (formLoadedTime && Number(formLoadedTime) && now - formLoadedTime < 3000) {
      return res.status(400).json({ error: "Form submitted too quickly" });
    }

    // Validate required fields
    if (!name || !username || !email || !gender || !password || !phone) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Validate password (minimum 8 chars, at least one letter and one digit)
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passRegex.test(password)) {
      return res.status(400).json({
        error: "Password must be at least 8 characters with letters and numbers.",
      });
    }

    // Validate phone format
    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: "Invalid phone number format" });
    }

    // Check if user already exists (by phone)
    const [existingRows] = await pool
      .promise()
      .query<UserRow[]>("SELECT * FROM users WHERE phone = ?", [phone]);
    if (existingRows && existingRows.length > 0) {
      return res.status(400).json({ error: "User with this phone already exists." });
    }

    // Hash password and insert user details
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await pool
      .promise()
      .query(
        "INSERT INTO users (name, username, email, gender, phone, password) VALUES (?, ?, ?, ?, ?, ?)",
        [name, username, email, gender, phone, hashedPassword]
      );

    return res.status(201).json({ message: "Registration details saved successfully" });
  } catch (err) {
    console.error("Registration details error:", err);
    return res.status(500).json({ error: "Server error during registration details" });
  }
};
