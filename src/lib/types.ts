export interface Article {
  slug: string;
  title: string;
  category: string;
  description: string;
  order: number;
  faq?: boolean;
  createdAt: string;
  updatedAt: string;
  content: string;
}

export interface ArticleMeta {
  slug: string;
  title: string;
  category: string;
  description: string;
  order: number;
  faq?: boolean;
}

export interface Category {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export interface ProductUpdate {
  slug: string;
  title: string;
  date: string;
  category: 'new' | 'improvement' | 'fix' | 'announcement' | 'coming-soon';
  showModal?: boolean;
  ctaLabel?: string;
  ctaUrl?: string;
  content: string;
}

export interface ProductUpdateMeta {
  slug: string;
  title: string;
  date: string;
  category: 'new' | 'improvement' | 'fix' | 'announcement' | 'coming-soon';
  showModal?: boolean;
  ctaLabel?: string;
  ctaUrl?: string;
}

export interface SearchEntry {
  slug: string;
  title: string;
  description: string;
  category: string;
  body: string;
  faq?: boolean;
}
