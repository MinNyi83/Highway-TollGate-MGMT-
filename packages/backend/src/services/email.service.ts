import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!process.env.SMTP_USER) {
      console.log('Email skipped (no SMTP configured):', options.subject);
      return false;
    }
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'TollGate <noreply@tollgate.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
}

export async function sendViolationEmail(email: string, violation: any): Promise<void> {
  await sendEmail({
    to: email,
    subject: `Violation Notice - ${violation.violationType}`,
    html: `
      <h2>Violation Notice</h2>
      <p>A violation has been recorded for your vehicle.</p>
      <p><strong>Type:</strong> ${violation.violationType}</p>
      <p><strong>Fine Amount:</strong> $${violation.fineAmount}</p>
      <p><strong>Date:</strong> ${new Date(violation.createdAt).toLocaleDateString()}</p>
      <p>Please log in to your account to view details and make payment.</p>
    `,
  });
}

export async function sendLowBalanceEmail(email: string, balance: number): Promise<void> {
  await sendEmail({
    to: email,
    subject: 'Low Balance Alert - TollGate',
    html: `
      <h2>Low Balance Alert</h2>
      <p>Your account balance is running low.</p>
      <p><strong>Current Balance:</strong> $${balance}</p>
      <p>Please top up to avoid any issues with toll payments.</p>
    `,
  });
}

export async function sendTopUpConfirmationEmail(email: string, amount: number, method: string): Promise<void> {
  await sendEmail({
    to: email,
    subject: 'Top-Up Confirmation - TollGate',
    html: `
      <h2>Top-Up Successful</h2>
      <p>Your account has been topped up successfully.</p>
      <p><strong>Amount:</strong> $${amount}</p>
      <p><strong>Method:</strong> ${method}</p>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  await sendEmail({
    to: email,
    subject: 'Password Reset - TollGate',
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 1 hour.</p>
    `,
  });
}
