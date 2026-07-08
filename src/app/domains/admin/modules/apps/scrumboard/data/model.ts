export type CardPriority = 'urgent' | 'high' | 'medium' | 'low' | 'none';

export type Lane = {
  id: string;
  label: string;
};

export type Comment = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  message: string;
  createdAt: string;
  replies?: Comment[];
};

export type Card = {
  id: string;
  title: string;
  description?: string;
  lane: string;
  priority: CardPriority;
  labels: string[];
  assignee: {
    name: string;
    avatar: string;
  } | null;
  dueDate: string | null;
  subtasks: {
    total: number;
    completed: number;
  } | null;
  comments: Comment[];
  createdAt: string;
};
