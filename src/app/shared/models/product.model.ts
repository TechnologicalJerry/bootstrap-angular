// models/product.model.ts
export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  category?: string;
  image?: string;
  stock?: number;
  rating?: number;
}

export interface CreateProductRequest {
  title: string;
  description?: string;
  price: number;
  category?: string;
  image?: string;
  stock?: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}
