"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCode = exports.sendCode = void 0;
const crypto_1 = require("crypto");
// In-memory store for phone codes.
// NOTE: In production, use a persistent store (e.g., Redis) and set an expiration.
const codeStore = {};
/**
 * Endpoint to send a verification code to the user's phone.
 * Expects a JSON body with: { phone: string }
 */
const sendCode = (req, res) => {
    const { phone } = req.body;
    if (!phone) {
        return res.status(400).json({ error: "Phone number is required" });
    }
    // Validate phone format (e.g., must start with "05" and be 10 digits)
    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: "Invalid phone number format" });
    }
    // Generate a random 4-digit code (you can adjust the length)
    const code = String((0, crypto_1.randomInt)(1000, 10000)); // generates number between 1000 and 9999
    // Set expiration (e.g., 5 minutes from now)
    const expires = Date.now() + 5 * 60 * 1000;
    codeStore[phone] = { code, expires };
    // Here, you would integrate an SMS API (like Twilio) to actually send the code.
    console.log(`Sending code ${code} to phone ${phone}`);
    return res.status(200).json({ message: "Verification code sent successfully" });
};
exports.sendCode = sendCode;
/**
 * Endpoint to verify the code entered by the client.
 * Expects a JSON body with: { phone: string, code: string }
 */
const verifyCode = (req, res) => {
    const { phone, code } = req.body;
    if (!phone || !code) {
        return res.status(400).json({ error: "Phone number and code are required" });
    }
    const record = codeStore[phone];
    if (!record) {
        return res.status(400).json({ error: "No code has been sent to this phone" });
    }
    if (Date.now() > record.expires) {
        // Code expired, remove it from the store.
        delete codeStore[phone];
        return res.status(400).json({ error: "The code has expired" });
    }
    if (record.code !== code) {
        return res.status(400).json({ error: "The code is incorrect" });
    }
    // Successful verification; remove the stored code.
    delete codeStore[phone];
    return res.status(200).json({ message: "Phone number verified successfully" });
};
exports.verifyCode = verifyCode;
