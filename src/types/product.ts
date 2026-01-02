export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'boys' | 'girls' | 'unisex';
  sizes: string[];
  image: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface OrderDetails {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
  items: CartItem[];
}
