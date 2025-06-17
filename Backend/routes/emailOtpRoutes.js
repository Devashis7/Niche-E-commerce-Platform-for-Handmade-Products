const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

const otpStore = new Map(); // temp storage

// Nodemailer transporter (using Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,     // your gmail
    pass: process.env.MAIL_PASS      // your app password (not your login)
  }
});

// Send OTP via email
router.post('/send-email-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const mailOptions = {
  from: process.env.MAIL_USER,
  to: email,
  subject: '🛡️ OTP Verification - Desi-Etsy',
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
      <h2 style="color: #cc5200;">Desi-Etsy OTP Verification</h2>
      <p>Dear User,</p>
      <p>Thank you for registering with <strong>Desi-Etsy</strong> — your go-to marketplace for handmade treasures.</p>
      <p><strong style="font-size: 18px;">🔐 Your One-Time Password (OTP): <span style="color: #cc5200;">${otp}</span></strong></p>
      <p>This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone for security reasons.</p>
      <p>If you did not initiate this request, you can safely ignore this message.</p>
      <hr style="margin: 20px 0;">
      <p style="color: #888;">Best regards,<br>Desi-Etsy Team</p>
    </div>
  `
};


  try {
    await transporter.sendMail(mailOptions);
    otpStore.set(email, otp);
    setTimeout(() => otpStore.delete(email), 5 * 60 * 1000); // 5 min
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/verify-email-otp', (req, res) => {
  const { email, otp } = req.body;
  const stored = otpStore.get(email);

  if (stored === otp) {
    otpStore.delete(email);
    res.json({ verified: true });
  } else {
    res.status(400).json({ verified: false, message: 'Invalid or expired OTP' });
  }
});

module.exports = router;
