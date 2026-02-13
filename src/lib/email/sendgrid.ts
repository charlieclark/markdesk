import type { EmailSender, EmailPayload } from './types';

export function createSendGridSender(): EmailSender {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) throw new Error('SENDGRID_API_KEY is not set');

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(apiKey);

  return {
    async send(payload: EmailPayload) {
      await sgMail.send({
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
