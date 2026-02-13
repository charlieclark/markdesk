'use client';

import { useState } from 'react';

export default function ArticleFeedback() {
  const [submitted, setSubmitted] = useState<'yes' | 'no' | null>(null);

  if (submitted) {
    return (
      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-sm text-text-secondary">
          {submitted === 'yes'
            ? 'Glad this was helpful!'
            : 'Sorry about that. Feel free to contact us for more help.'}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <p className="text-sm text-text-secondary mb-3">Was this article helpful?</p>
      <div className="flex gap-2">
        <button
          onClick={() => setSubmitted('yes')}
          className="px-4 py-2 text-sm rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors"
        >
          Yes
        </button>
        <button
          onClick={() => setSubmitted('no')}
          className="px-4 py-2 text-sm rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors"
        >
          No
        </button>
      </div>
    </div>
  );
}
