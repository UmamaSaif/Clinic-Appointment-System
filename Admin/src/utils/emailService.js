import nodemailer from 'nodemailer';
import schedule from 'node-schedule';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

export const scheduleReminder = (date, emailData) => {
  schedule.scheduleJob(date, async () => {
    await sendEmail(emailData.to, emailData.subject, emailData.text);
  });
};