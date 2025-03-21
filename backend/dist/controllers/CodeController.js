"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCode = exports.sendCode = void 0;
const crypto_1 = require("crypto");
const database_1 = __importDefault(require("../config/database"));
const codeStore = {};
const sendCode = (req, res) => {
    const { phone } = req.body;
    if (!phone) {
        return res.status(400).json({ error: "Phone number is required" });
    }
    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: "Invalid phone number format" });
    }
    const code = String((0, crypto_1.randomInt)(1000, 10000));
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes expiry
    codeStore[phone] = { code, expires };
    console.log(`Sending code ${code} to phone ${phone}`);
    return res.status(200).json({ message: "Verification code sent successfully" });
};
exports.sendCode = sendCode;
const verifyCode = async (req, res) => {
    const { phone, code } = req.body;
    if (!phone || !code) {
        return res.status(400).json({ error: "Phone number and code are required" });
    }
    console.log("Verifying code for phone:", phone, "with code:", code);
    const record = codeStore[phone];
    if (!record) {
        console.error("No code record found for phone:", phone);
        return res.status(400).json({ error: "No code has been sent to this phone" });
    }
    if (Date.now() > record.expires) {
        console.error("Code expired for phone:", phone);
        delete codeStore[phone];
        return res.status(400).json({ error: "The code has expired" });
    }
    if (record.code !== code) {
        console.error("Invalid code for phone:", phone, "expected:", record.code, "got:", code);
        return res.status(400).json({ error: "The code is incorrect" });
    }
    delete codeStore[phone];
    // Query the user from the database by phone.
    try {
        const [rows] = await database_1.default
            .promise()
            .query("SELECT * FROM users WHERE phone = ?", [phone]);
        if (rows.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }
        const user = rows[0];
        return res.status(200).json({
            message: "Phone number verified successfully",
            user: {
                id: user.id,
                username: user.username,
                phone: user.phone,
            },
        });
    }
    catch (err) {
        console.error("Error retrieving user:", err);
        return res.status(500).json({ error: "Server error retrieving user data" });
    }
};
exports.verifyCode = verifyCode;
