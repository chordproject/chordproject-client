export type Tag = {
  id: string;
  title: string;
};

export type Country = {
  id: string;
  iso: string;
  name: string;
  code: string;
  flagImagePos: string;
};

export type Contact = {
  id: string;
  photo: string | null;
  background: string | null;
  name: string;
  emails: {
    email: string;
    label: string;
  }[];
  phoneNumbers: {
    country: string;
    phoneNumber: string;
    label: string;
  }[];
  title: string | null;
  company: string | null;
  birthday: string | null;
  address: string | null;
  notes: string | null;
  tags: string[];
};
