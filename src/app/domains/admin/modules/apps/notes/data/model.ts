export type Note = {
  id: string;
  title: string;
  content: string;
  tasks:
    | {
        id: string;
        content: string;
        completed: boolean;
      }[]
    | null;
  image: string | null;
  reminder: string | null;
  labels: string[];
  archived: boolean;
  createdAt: string;
  updatedAt: string | null;
};
