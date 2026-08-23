export type FuseConfirmationConfig = {
  title?: string;
  message?: string;
  icon?: {
    show?: boolean;
    name?: string;
    color?: 'primary' | 'error' | 'neutral';
  };
  actions?: {
    confirm?: {
      show?: boolean;
      label?: string;
      color?: 'primary' | 'error';
    };
    cancel?: {
      show?: boolean;
      label?: string;
    };
  };
  dismissible?: boolean;
};
