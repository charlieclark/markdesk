import type { EmailSender, EmailPayload } from './types';

export function createResendSender(): EmailSender {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not set');

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Resend } = require('resend');
  const resend = new Resend(apiKey);

  return {
    async send(payload: EmailPayload) {
      await resend.emails.send({
        to: payload.to,
        from: payload.from,
        reply_to: payload.replyTo,
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
      });
    },
  };
}
