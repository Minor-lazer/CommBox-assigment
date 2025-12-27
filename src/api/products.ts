const BASE_URL = 'https://dummyjson.com';

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: ProductDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: ProductReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: ProductMeta;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export type SortOption = 'newest' | 'oldest' | 'price-low-high' | 'price-high-low';

interface GetProductsParams {
  limit?: number;
  skip?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export async function getProducts(params: GetProductsParams = {}): Promise<ProductsResponse> {
  const { limit = 30, skip = 0, search, category, sortBy, order } = params;
  
  let url: string;
  
  if (search) {
    url = `${BASE_URL}/products/search?q=${encodeURIComponent(search)}`;
  } else if (category) {
    url = `${BASE_URL}/products/category/${encodeURIComponent(category)}`;
  } else {
    url = `${BASE_URL}/products`;
  }
  
  const queryParams = new URLSearchParams();
  queryParams.set('limit', String(limit));
  queryParams.set('skip', String(skip));
  
  if (sortBy) {
    queryParams.set('sortBy', sortBy);
  }
  if (order) {
    queryParams.set('order', order);
  }
  
  const separator = url.includes('?') ? '&' : '?';
  url = `${url}${separator}${queryParams.toString()}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  
  return response.json();
}

export async function getProduct(id: number): Promise<Product> {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }
  
  return response.json();
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${BASE_URL}/products/categories`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }
  
  return response.json();
}

export function getSortParams(sortOption: SortOption): { sortBy?: string; order?: 'asc' | 'desc' } {
  switch (sortOption) {
    case 'newest':
      return { sortBy: 'meta.createdAt', order: 'desc' };
    case 'oldest':
      return { sortBy: 'meta.createdAt', order: 'asc' };
    case 'price-low-high':
      return { sortBy: 'price', order: 'asc' };
    case 'price-high-low':
      return { sortBy: 'price', order: 'desc' };
    default:
      return {};
  }
}

