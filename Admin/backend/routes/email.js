const express = require('express');
const router = express.Router();
const { sendAppointmentReminder, sendWelcomeEmail } = require('../services/emailService');

// Test route
router.post('/test-email', async (req, res) => {
  try {
    await sendWelcomeEmail({
      email: 'test@example.com',
      name: 'Test User'
    });
    res.json({ message: 'Test email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send test email' });
  }
});

module.exports = router; 