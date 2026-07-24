export type MessageRole = 'user' | 'assistant';

export type MessagePart = {
  type: 'text' | 'code';
  value: string;
  language?: string;
};

export type Message = {
  id: string;
  role: MessageRole;
  content: MessagePart[];
  createdAt: string;
  streaming?: boolean;
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: string;
  messages: Message[];
};
