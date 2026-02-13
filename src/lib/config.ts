export interface MarkdeskConfig {
  name: string;
  siteUrl: string;
  productUrl: string;
  supportEmail: string;
  fromEmail: string;
  colors: { primary: string };
  emailSender: 'sendgrid' | 'resend' | 'nodemailer';
  footer: { termsUrl: string; privacyUrl: string };
  allowedOrigins: string[];
  beacon: { title: string; autoShowModal?: boolean; modalDelay?: number; modalMaxAgeDays?: number };
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const imported = require('../../markdesk.config');
const config: MarkdeskConfig = imported.default || imported;

export function getConfig(): MarkdeskConfig {
  return config;
}
