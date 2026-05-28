export type OrderStatus =
  'pending' | 'processing' | 'shipped' | 'delivered' | 'refunded';

export type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar: string | null;
  };
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  paymentMethod: string;
  shippingAddress: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
};
