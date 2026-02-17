/** @jsxImportSource preact */
import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

interface BeaconContactProps {
  helpCenterUrl: string;
  userEmail?: string;
  prefillSubject?: string;
  prefillMessage?: string;
  onPrefillConsumed?: () => void;
}

export default function BeaconContact({ helpCenterUrl, userEmail, prefillSubject, prefillMessage, onPrefillConsumed }: BeaconContactProps) {
  const [email, setEmail] = useState(userEmail || '');
  const [subject, setSubject] = useState(prefillSubject || '');
  const [message, setMessage] = useState(prefillMessage || '');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    if (prefillSubject !== undefined || prefillMessage !== undefined) {
      if (prefillSubject !== undefined) setSubject(prefillSubject);
      if (prefillMessage !== undefined) setMessage(prefillMessage);
      onPrefillConsumed?.();
    }
  }, [prefillSubject, prefillMessage]);

  function handleSubmit(e: Event) {
    e.preventDefault();
    setStatus('sending');

    fetch(`${helpCenterUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, subject, message }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setStatus('sent');
        setSubject('');
        setMessage('');
      })
      .catch(() => setStatus('error'));
  }

  if (status === 'sent') {
    return (
      <div class="mdb-form-success">
        <div style={{ fontSize: '24px', marginBottom: '8px', display: 'block' }}>✓</div>
        <div style={{ fontWeight: '500', display: 'block' }}>Message sent!</div>
        <div style={{ color: '#727272', marginTop: '4px', display: 'block' }}>
          We'll get back to you as soon as possible.
        </div>
        <button
          onClick={() => setStatus('idle')}
          style={{
            display: 'block',
            marginTop: '12px',
            background: 'none',
            border: 'none',
            color: '#000',
            cursor: 'pointer',
            fontSize: '12px',
            fontFamily: 'inherit',
            margin: '12px auto 0',
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div class="mdb-form-group">
        <label class="mdb-label">Email</label>
        <input
          type="email"
          class="mdb-input"
          required
          placeholder="your@email.com"
          value={email}
          onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
        />
      </div>
      <div class="mdb-form-group">
        <label class="mdb-label">Subject</label>
        <input
          type="text"
          class="mdb-input"
          required
          placeholder="What do you need help with?"
          value={subject}
          onInput={(e) => setSubject((e.target as HTMLInputElement).value)}
        />
      </div>
      <div class="mdb-form-group">
        <label class="mdb-label">Message</label>
        <textarea
          class="mdb-textarea"
          required
          placeholder="Describe your issue..."
          value={message}
          onInput={(e) => setMessage((e.target as HTMLTextAreaElement).value)}
        />
      </div>
      {status === 'error' && (
        <div class="mdb-form-error">
          Something went wrong. Please try again.
        </div>
      )}
      <button type="submit" class="mdb-submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
