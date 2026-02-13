export interface EmailPayload {
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
}

export interface EmailSender {
  send(payload: EmailPayload): Promise<void>;
}
