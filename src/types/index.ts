export type Category = 'modest-wear' | 'accessories' | 'sneakers' | 'watches' | 'mixed-fashion';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'INR' | 'USD';
  category: Category;
  images: string[];
  stock: number;
  isTrending?: boolean;
  isPreorder?: boolean;
  discount?: number;
  sizes?: string[];
  colors?: string[];
  ratings: number;
  reviewsCount: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}
