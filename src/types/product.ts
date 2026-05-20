export interface Product {
  id: string;
  name: string;
  originalPrice?: number;
  price: number;
  description: string;
  category: 'zippers' | 'onesies';
  sizes: string[];
  image: string;
  images: string[];
  inStock: boolean;
  similarProducts?: string[];
  sleeve?: 'sleeveless' | 'short' | 'long';
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
