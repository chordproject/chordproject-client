export type Tag = {
  id: string;
  title: string;
};

export type Task = {
  id: string;
  type: 'task' | 'section';
  title: string;
  notes: string;
  completed: boolean;
  dueDate: string | null;
  assignees: string[] | null;
  priority: 0 | 1 | 2;
  tags: string[];
  order: number;
};
