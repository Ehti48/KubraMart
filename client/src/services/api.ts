import { apiRequest } from "@/lib/queryClient";
import { 
  Product, 
  Category, 
  InsertUser, 
  User, 
  CartItem, 
  InsertOrder, 
  Order,
  InsertReview
} from "@shared/schema";

// Category API
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch('/api/categories', {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }
  
  return response.json();
};

export const fetchCategoryBySlug = async (slug: string): Promise<Category> => {
  const response = await fetch(`/api/categories/${slug}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch category: ${response.statusText}`);
  }
  
  return response.json();
};

// Product API
export const fetchProducts = async (
  params?: { 
    featured?: boolean; 
    new?: boolean; 
    category?: string;
  }
): Promise<Product[]> => {
  // Build query string from params
  const queryParams = new URLSearchParams();
  if (params?.featured) queryParams.append('featured', 'true');
  if (params?.new) queryParams.append('new', 'true');
  if (params?.category) queryParams.append('category', params.category);
  
  const queryString = queryParams.toString();
  const url = queryString ? `/api/products?${queryString}` : '/api/products';
  
  const response = await fetch(url, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  
  return response.json();
};

export const fetchProductBySlug = async (slug: string): Promise<Product> => {
  const response = await fetch(`/api/products/${slug}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }
  
  return response.json();
};

// User API
export const registerUser = async (userData: InsertUser): Promise<User> => {
  const response = await apiRequest('POST', '/api/users/register', userData);
  return response.json();
};

export const loginUser = async (username: string, password: string): Promise<User> => {
  const response = await apiRequest('POST', '/api/users/login', { username, password });
  return response.json();
};

// Cart API
export const fetchCartItems = async (userId: number): Promise<CartItem[]> => {
  const response = await fetch(`/api/cart/${userId}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch cart items: ${response.statusText}`);
  }
  
  return response.json();
};

export const addToCart = async (userId: number, productId: number, quantity: number): Promise<CartItem> => {
  const response = await apiRequest('POST', '/api/cart', { userId, productId, quantity });
  return response.json();
};

export const updateCartItem = async (id: number, quantity: number): Promise<CartItem> => {
  const response = await apiRequest('PUT', `/api/cart/${id}`, { quantity });
  return response.json();
};

export const removeCartItem = async (id: number): Promise<void> => {
  await apiRequest('DELETE', `/api/cart/${id}`, undefined);
};

export const clearCart = async (userId: number): Promise<void> => {
  await apiRequest('DELETE', `/api/cart/user/${userId}`, undefined);
};

// Order API
export const createOrder = async (orderData: InsertOrder, items: { productId: number; quantity: number; price: number; }[]): Promise<Order> => {
  const response = await apiRequest('POST', '/api/orders', { ...orderData, items });
  return response.json();
};

export const fetchUserOrders = async (userId: number): Promise<Order[]> => {
  const response = await fetch(`/api/orders/user/${userId}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.statusText}`);
  }
  
  return response.json();
};

// Review API
export const fetchProductReviews = async (productId: number): Promise<any[]> => {
  const response = await fetch(`/api/reviews/product/${productId}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch reviews: ${response.statusText}`);
  }
  
  return response.json();
};

export const createReview = async (reviewData: InsertReview): Promise<any> => {
  const response = await apiRequest('POST', '/api/reviews', reviewData);
  return response.json();
};
