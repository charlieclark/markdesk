import { getConfig } from '../config';
import type { EmailSender } from './types';

export type { EmailSender, EmailPayload } from './types';

export function getEmailSender(): EmailSender {
  const { emailSender } = getConfig();

  switch (emailSender) {
    case 'sendgrid': {
      const { createSendGridSender } = require('./sendgrid');
      return createSendGridSender();
    }
    case 'resend': {
      const { createResendSender } = require('./resend');
      return createResendSender();
    }
    case 'nodemailer': {
      const { createNodemailerSender } = require('./nodemailer');
      return createNodemailerSender();
    }
    default:
      throw new Error(`Unknown email sender: ${emailSender}`);
  }
}
