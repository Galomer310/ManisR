import { Request, Response } from "express";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import pool from "../config/database";
import { RowDataPacket } from "mysql2/promise";

// Extend RowDataPacket so that our UserRow type is acceptable by mysql2.
interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  phone: string;
  password: string;
}

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET || "";
const saltRounds = 10;

/**
 * Register a new user (initial step) – similar to an "instant" registration.
 * (This might be used for immediate registration with phone verification.)
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      username,
      phone,
      password,
      honeypotField,   // hidden field for bots
      captchaToken,    // reCAPTCHA token
      formLoadedTime,  // timestamp for time-limit check
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

    // Time-limit check (must wait at least 3000ms)
    const now = Date.now();
    if (formLoadedTime && Number(formLoadedTime) && now - formLoadedTime < 3000) {
      return res.status(400).json({ error: "Form submitted too quickly" });
    }

    // Validate fields
    if (!username || !phone || !password) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: "Invalid phone number format" });
    }

    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passRegex.test(password)) {
      return res.status(400).json({
        error: "Password must be at least 8 characters with letters and numbers"
      });
    }

    // Check if the phone is already registered
    const [existingRows] = await pool.promise().query<UserRow[]>(
      "SELECT * FROM users WHERE phone = ?",
      [phone]
    );
    if (existingRows && existingRows.length > 0) {
      return res.status(400).json({ error: "User with this phone already exists." });
    }

    // Hash password and insert the user
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await pool.promise().query(
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
 * Login user using phone and password.
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

    const recapRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${captchaToken}`,
      { method: "POST" }
    );
    const recapData = await recapRes.json();
    if (!recapData.success) {
      return res.status(400).json({ error: "Captcha verification failed" });
    }

    const now = Date.now();
    if (formLoadedTime && Number(formLoadedTime) && now - formLoadedTime < 2000) {
      return res.status(400).json({ error: "Form submitted too quickly" });
    }

    if (!phone || !password) {
      return res.status(400).json({ error: "Please provide phone and password" });
    }

    const [rows] = await pool.promise().query<UserRow[]>(
      "SELECT * FROM users WHERE phone = ?",
      [phone]
    );
    if (!rows || rows.length === 0) {
      return res.status(400).json({ error: "Invalid phone or password" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid phone or password" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error during login" });
  }
};

/**
 * Save final registration details after phone verification.
 * This endpoint collects additional fields: name, username, email, gender, and password.
 * It includes honeypot, reCAPTCHA, and time-limit checks.
 */
// backend/src/controllers/authController.ts (registerDetails function)
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

    // Time-limit check
    const now = Date.now();
    if (formLoadedTime && Number(formLoadedTime) && now - formLoadedTime < 3000) {
      return res.status(400).json({ error: "Form submitted too quickly" });
    }

    // Validate required fields
    if (!name || !username || !email || !gender || !password || !phone) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Validate password
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

    // Check if user already exists
    const [existingRows] = await pool.promise().query<UserRow[]>(
      "SELECT * FROM users WHERE phone = ?",
      [phone]
    );
    if (existingRows && existingRows.length > 0) {
      return res.status(400).json({ error: "User with this phone already exists." });
    }

    // Hash password and insert user details
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await pool.promise().query(
      "INSERT INTO users (name, username, email, gender, phone, password) VALUES (?, ?, ?, ?, ?, ?)",
      [name, username, email, gender, phone, hashedPassword]
    );

    return res.status(201).json({ message: "Registration details saved successfully" });
  } catch (err) {
    console.error("Registration details error:", err);
    return res.status(500).json({ error: "Server error during registration details" });
  }
};
