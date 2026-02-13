import { NextRequest, NextResponse } from 'next/server';
import { getConfig } from '@/lib/config';
import { getEmailSender } from '@/lib/email';

function isAllowedOrigin(origin: string): boolean {
  const { allowedOrigins, siteUrl } = getConfig();
  const allowed = [siteUrl, ...allowedOrigins].filter(Boolean);
  if (allowed.includes(origin)) return true;
  if (process.env.NODE_ENV === 'development' && origin.startsWith('http://localhost:')) return true;
  return false;
}

function corsHeaders(origin: string | null) {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (origin && isAllowedOrigin(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const headers = corsHeaders(origin);
  const config = getConfig();

  try {
    const { email, subject, message, userId } = await request.json();

    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: 'Email, subject, and message are required.' },
        { status: 400, headers }
      );
    }

    let sender;
    try {
      sender = getEmailSender();
    } catch {
      console.error('Email sender not configured');
      return NextResponse.json(
        { error: 'Email service not configured.' },
        { status: 500, headers }
      );
    }

    const userIdLine = userId ? `<p><strong>User ID:</strong> ${userId}</p>` : '';

    await sender.send({
      to: config.supportEmail,
      from: config.fromEmail,
      replyTo: email,
      subject: `[Help Center] ${subject}`,
      text: `From: ${email}${userId ? `\nUser ID: ${userId}` : ''}\n\nSubject: ${subject}\n\n${message}`,
      html: `<p><strong>From:</strong> ${email}</p>${userIdLine}<p><strong>Subject:</strong> ${subject}</p><hr/><p>${message.replace(/\n/g, '<br/>')}</p>`,
    });

    return NextResponse.json({ success: true }, { headers });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message.' },
      { status: 500, headers }
    );
  }
}
