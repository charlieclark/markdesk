import type { EmailSender, EmailPayload } from './types';

export function createNodemailerSender(): EmailSender {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return {
    async send(payload: EmailPayload) {
      await transporter.sendMail({
        to: payload.to,
        from: payload.from,
        replyTo: payload.replyTo,
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
      });
    },
  };
}
