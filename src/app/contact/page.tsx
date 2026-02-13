import ContactForm from '@/components/ContactForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with our support team.',
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-text mb-2">Contact Us</h1>
      <p className="text-text-secondary mb-8">
        Can&apos;t find what you&apos;re looking for? Send us a message and we&apos;ll get back to you.
      </p>
      <ContactForm />
    </div>
  );
}
