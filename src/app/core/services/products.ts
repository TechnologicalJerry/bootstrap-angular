import { Injectable, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Api } from './api';
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
} from '../../shared/models/product.model';
import { productData } from './database/productData';
import { getStorageItem, setStorageItem } from '../utils/storage.util';

@Injectable({
  providedIn: 'root',
})
export class Products {
  private readonly api = inject(Api);
  private readonly _products = signal<Product[]>(this.loadProducts());

  /**
   * Get all products
   */
  getProducts(): Observable<Product[]> {
    // Simulate API call - In production, use: return this.api.get<Product[]>('/products');
    return of(this._products()).pipe(delay(500));
  }

  /**
   * Get product by ID
   */
  getProductById(id: string): Observable<Product | null> {
    // Simulate API call - In production, use: return this.api.get<Product>(`/products/${id}`);
    const product = this._products().find((p) => p.id === id);
    return of(product || null).pipe(delay(300));
  }

  /**
   * Create new product
   */
  createProduct(productData: CreateProductRequest): Observable<Product> {
    // Simulate API call - In production, use: return this.api.post<Product>('/products', productData);
    const newProduct: Product = {
      id: Date.now().toString(),
      ...productData,
      rating: 0,
    };

    const products = [...this._products(), newProduct];
    this._products.set(products);
    this.saveProducts(products);

    return of(newProduct).pipe(delay(500));
  }

  /**
   * Update product
   */
  updateProduct(id: string, productData: UpdateProductRequest): Observable<Product> {
    // Simulate API call - In production, use: return this.api.put<Product>(`/products/${id}`, productData);
    const products = this._products();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new Error('Product not found');
    }

    const updatedProduct: Product = {
      ...products[index],
      ...productData,
    };

    products[index] = updatedProduct;
    this._products.set([...products]);
    this.saveProducts(products);

    return of(updatedProduct).pipe(delay(500));
  }

  /**
   * Delete product
   */
  deleteProduct(id: string): Observable<boolean> {
    // Simulate API call - In production, use: return this.api.delete<boolean>(`/products/${id}`);
    const products = this._products().filter((p) => p.id !== id);
    this._products.set(products);
    this.saveProducts(products);

    return of(true).pipe(delay(500));
  }

  /**
   * Search products
   */
  searchProducts(query: string): Observable<Product[]> {
    const lowerQuery = query.toLowerCase();
    const filtered = this._products().filter(
      (product) =>
        product.title.toLowerCase().includes(lowerQuery) ||
        product.description?.toLowerCase().includes(lowerQuery) ||
        product.category?.toLowerCase().includes(lowerQuery)
    );
    return of(filtered).pipe(delay(300));
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category: string): Observable<Product[]> {
    const filtered = this._products().filter((product) => product.category === category);
    return of(filtered).pipe(delay(300));
  }

  /**
   * Load products from localStorage or default data
   */
  private loadProducts(): Product[] {
    try {
      const stored = getStorageItem('products_data');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fall through to default data
    }

    return productData.map((p) => ({ ...p })) as Product[];
  }

  /**
   * Save products to localStorage
   */
  private saveProducts(products: Product[]): void {
    try {
      setStorageItem('products_data', JSON.stringify(products));
    } catch (error) {
      console.error('Failed to save products:', error);
    }
  }
}
