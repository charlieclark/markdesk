import type { MarkdeskConfig } from './src/lib/config';

const config: MarkdeskConfig = {
  name: 'My Product',
  siteUrl: 'https://help.example.com',
  productUrl: 'https://example.com',
  supportEmail: 'support@example.com',
  fromEmail: 'help@example.com',
  colors: { primary: '#4b68af' },
  emailSender: 'resend',
  footer: { termsUrl: '', privacyUrl: '' },
  allowedOrigins: [],
  beacon: {
    title: 'Help',
    autoShowModal: true,
    modalDelay: 5000,
    modalMaxAgeDays: 180,
  },
};

export default config;
