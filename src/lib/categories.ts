import { Category } from './types';

export const categories: Category[] = [
  {
    slug: 'getting-started',
    title: 'Getting Started',
    description: 'Learn the basics of setting up and using the product.',
    icon: '🚀',
  },
  {
    slug: 'account-and-billing',
    title: 'Account & Billing',
    description: 'Manage your account, subscription, and payment details.',
    icon: '💳',
  },
  {
    slug: 'features',
    title: 'Features',
    description: 'Explore product features and how to use them.',
    icon: '⚡',
  },
  {
    slug: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Solutions for common issues and error messages.',
    icon: '🔧',
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
