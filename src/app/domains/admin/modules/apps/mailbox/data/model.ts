export type MailFolder =
  'inbox' | 'sent' | 'drafts' | 'archive' | 'spam' | 'trash';

export type MailLabel = {
  id: string;
  label: string;
  color: string;
};

export type MailAttachment = {
  name: string;
  size: string;
};

export type MailSender = {
  name: string;
  email: string;
  avatar: string | null;
};

export type MailThreadMessage = {
  from: MailSender;
  date: string;
  body: string[];
};

export type Mail = {
  id: string;
  from: MailSender;
  to: string;
  subject: string;
  body: string[];
  date: string;
  read: boolean;
  starred: boolean;
  folder: MailFolder;
  labels: string[];
  attachments: MailAttachment[];
  thread?: MailThreadMessage[];
};
