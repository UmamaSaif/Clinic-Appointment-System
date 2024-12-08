const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Test the connection
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Click Appointment System" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const sendAppointmentReminder = async (appointment) => {
  const { patientEmail, patientName, date, time, doctorName } = appointment;
  
  const html = `
    <h2>Appointment Reminder</h2>
    <p>Dear ${patientName},</p>
    <p>This is a reminder for your upcoming appointment:</p>
    <ul>
      <li>Date: ${new Date(date).toLocaleDateString()}</li>
      <li>Time: ${time}</li>
      <li>Doctor: Dr. ${doctorName}</li>
    </ul>
    <p>Please arrive 10 minutes before your scheduled time.</p>
    <p>Best regards,<br>Click Appointment System</p>
  `;

  return sendEmail({
    to: patientEmail,
    subject: 'Appointment Reminder',
    text: `Reminder: You have an appointment with Dr. ${doctorName} on ${date} at ${time}`,
    html,
  });
};

const sendWelcomeEmail = async (user) => {
  const html = `
    <h2>Welcome to Click Appointment System</h2>
    <p>Dear ${user.name},</p>
    <p>Thank you for registering with Click Appointment System.</p>
    <p>You can now:</p>
    <ul>
      <li>Book appointments</li>
      <li>View your medical history</li>
      <li>Receive appointment reminders</li>
    </ul>
    <p>Best regards,<br>Click Appointment System Team</p>
  `;

  return sendEmail({
    to: user.email,
    subject: 'Welcome to Click Appointment System',
    text: `Welcome to Click Appointment System, ${user.name}!`,
    html,
  });
};

module.exports = {
  sendEmail,
  sendAppointmentReminder,
  sendWelcomeEmail
}; 