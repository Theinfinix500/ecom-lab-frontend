export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  comparedPrice?: number;
  stock: number;
  categories: any[];
  images: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isVisible: boolean;
}
