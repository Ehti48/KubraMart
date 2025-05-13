import {
  type User,
  type InsertUser,
  type Product,
  type InsertProduct,
  type Category,
  type InsertCategory,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Review,
  type InsertReview,
  type CartItem,
  type InsertCartItem
} from "@shared/schema";

export interface IStorage {
  // User CRUD
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // Category CRUD
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<Category>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Product CRUD
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getNewArrivals(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Order CRUD
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getUserOrders(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<Order>): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<boolean>;
  
  // OrderItem CRUD
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Review CRUD
  getReviews(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Cart CRUD
  getCartItems(userId: number): Promise<CartItem[]>;
  getCartItem(id: number): Promise<CartItem | undefined>;
  getCartItemByUserAndProduct(userId: number, productId: number): Promise<CartItem | undefined>;
  createCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, cartItem: Partial<CartItem>): Promise<CartItem | undefined>;
  deleteCartItem(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private reviews: Map<number, Review>;
  private cartItems: Map<number, CartItem>;
  
  private userIdCounter = 1;
  private categoryIdCounter = 1;
  private productIdCounter = 1;
  private orderIdCounter = 1;
  private orderItemIdCounter = 1;
  private reviewIdCounter = 1;
  private cartItemIdCounter = 1;
  
  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.reviews = new Map();
    this.cartItems = new Map();
    
    // Initialize with some demo categories
    this.initializeCategories();
    this.initializeProducts();
  }
  
  private initializeCategories() {
    const categories: InsertCategory[] = [
      {
        name: "THAIBAH ENTERPRISES",
        slug: "thaibah-enterprises",
        description: "Crockery, Hajj-Umrah Kit, Dubai Abayas",
        image: "https://images.unsplash.com/photo-1543353071-10c8ba85a904?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      },
      {
        name: "MINHA ZAINAB ENTERPRISES",
        slug: "minha-zainab-enterprises",
        description: "Home Utilities",
        image: "https://pixabay.com/get/g8c51bf153cf4847b9c410c8c6d6f767c38f4f299db452b5daf6786c5b677d27a9190da3d2820bf0c3b98e4eb3373bd018fc9781b1d07d65bdce1d4a40d46bcd6_1280.jpg"
      },
      {
        name: "HAYA BOUTIQUE",
        slug: "haya-boutique",
        description: "Bhurqa, Hijab, Slippers",
        image: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      },
      {
        name: "AYISHA SILK HOUSE",
        slug: "ayisha-silk-house",
        description: "Clothing, Fashion Outlet, Boutique, Apparel",
        image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      },
      {
        name: "TODLERRY",
        slug: "todlerry",
        description: "Kids Fashion, Accessories, Baby Care",
        image: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      },
      {
        name: "CRESCENT FASHION",
        slug: "crescent-fashion",
        description: "Home Decor, Cosmetics, Imported Laces, Clothing",
        image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      },
      {
        name: "AL-AIMAN CREATION",
        slug: "al-aiman-creation",
        description: "Packing Materials, Traditional Food",
        image: "https://images.unsplash.com/photo-1589533610925-1cffc309ebaa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900"
      },
      {
        name: "GIRL'S & BOY'S",
        slug: "girls-and-boys",
        description: "Boutique for Girls' and Boys' Apparel",
        image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900"
      },
      {
        name: "General Shop",
        slug: "general-shop",
        description: "All combined category products",
        image: "https://images.unsplash.com/photo-1613395079985-21fb32cf24c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900"
      }
    ];
    
    for (const category of categories) {
      this.createCategory(category);
    }
  }
  
  private initializeProducts() {
    const products: InsertProduct[] = [
      {
        name: "Classic Dubai Abaya",
        slug: "classic-dubai-abaya",
        description: "Elegant and comfortable black abaya with beautiful embroidery details",
        price: 119.99,
        salePrice: 89.99,
        image: "https://images.unsplash.com/photo-1639475377520-b256a5d204b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900",
        images: ["https://images.unsplash.com/photo-1639475377520-b256a5d204b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900"],
        featured: true,
        newArrival: false,
        rating: 4.5,
        numReviews: 24,
        stock: 50,
        categoryId: 1
      },
      {
        name: "Luxury Tea Set",
        slug: "luxury-tea-set",
        description: "Exquisite traditional tea set with gold accents, perfect for entertaining guests",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900",
        images: ["https://images.unsplash.com/photo-1526406915894-7bcd65f60845?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900"],
        featured: true,
        newArrival: false,
        rating: 4.0,
        numReviews: 18,
        stock: 30,
        categoryId: 2
      },
      {
        name: "Premium Silk Hijab",
        slug: "premium-silk-hijab",
        description: "Luxuriously soft silk hijab in a range of beautiful colors",
        price: 32.99,
        image: "https://pixabay.com/get/g247c64fea2fd8e8e33ff0a188ed17521291727322f7c78997718f6b8d0e38832cb5e902b0d72395951c411a4f501ac5636dfee7db02438cc966411be1a8aaf23_1280.jpg",
        images: ["https://pixabay.com/get/g247c64fea2fd8e8e33ff0a188ed17521291727322f7c78997718f6b8d0e38832cb5e902b0d72395951c411a4f501ac5636dfee7db02438cc966411be1a8aaf23_1280.jpg"],
        featured: true,
        newArrival: true,
        rating: 5.0,
        numReviews: 36,
        stock: 100,
        categoryId: 3
      },
      {
        name: "Kids Festive Outfit",
        slug: "kids-festive-outfit",
        description: "Beautiful traditional outfit for kids, perfect for Eid and other celebrations",
        price: 45.99,
        image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900",
        images: ["https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900"],
        featured: true,
        newArrival: false,
        rating: 4.0,
        numReviews: 12,
        stock: 25,
        categoryId: 5
      },
      {
        name: "Islamic Wall Art",
        slug: "islamic-wall-art",
        description: "Elegant Islamic calligraphy wall art, perfect for adding a spiritual touch to your home",
        price: 65.99,
        image: "https://images.unsplash.com/photo-1613395079985-21fb32cf24c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900",
        images: ["https://images.unsplash.com/photo-1613395079985-21fb32cf24c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900"],
        featured: false,
        newArrival: true,
        rating: 4.5,
        numReviews: 8,
        stock: 15,
        categoryId: 6
      },
      {
        name: "Traditional Sweets Box",
        slug: "traditional-sweets-box",
        description: "Assortment of traditional sweets in elegant gift packaging",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1589533610925-1cffc309ebaa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900",
        images: ["https://images.unsplash.com/photo-1589533610925-1cffc309ebaa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900"],
        featured: false,
        newArrival: true,
        rating: 4.0,
        numReviews: 5,
        stock: 50,
        categoryId: 7
      }
    ];
    
    for (const product of products) {
      this.createProduct(product);
    }
  }

  // User CRUD operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  // Category CRUD operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(category => category.slug === slug);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async updateCategory(id: number, categoryData: Partial<Category>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...categoryData };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Product CRUD operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(product => product.slug === slug);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.categoryId === categoryId);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.featured);
  }

  async getNewArrivals(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.newArrival);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const newProduct: Product = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Order CRUD operations
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderIdCounter++;
    const newOrder: Order = { ...order, id };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrder(id: number, orderData: Partial<Order>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, ...orderData };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async deleteOrder(id: number): Promise<boolean> {
    return this.orders.delete(id);
  }

  // OrderItem CRUD operations
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemIdCounter++;
    const newOrderItem: OrderItem = { ...orderItem, id };
    this.orderItems.set(id, newOrderItem);
    return newOrderItem;
  }

  // Review CRUD operations
  async getReviews(productId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.productId === productId);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const newReview: Review = { ...review, id };
    this.reviews.set(id, newReview);
    return newReview;
  }

  // Cart CRUD operations
  async getCartItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.userId === userId);
  }

  async getCartItem(id: number): Promise<CartItem | undefined> {
    return this.cartItems.get(id);
  }

  async getCartItemByUserAndProduct(userId: number, productId: number): Promise<CartItem | undefined> {
    return Array.from(this.cartItems.values()).find(
      item => item.userId === userId && item.productId === productId
    );
  }

  async createCartItem(cartItem: InsertCartItem): Promise<CartItem> {
    const id = this.cartItemIdCounter++;
    const newCartItem: CartItem = { ...cartItem, id };
    this.cartItems.set(id, newCartItem);
    return newCartItem;
  }

  async updateCartItem(id: number, cartItemData: Partial<CartItem>): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;
    
    const updatedCartItem = { ...cartItem, ...cartItemData };
    this.cartItems.set(id, updatedCartItem);
    return updatedCartItem;
  }

  async deleteCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: number): Promise<boolean> {
    const userCartItems = await this.getCartItems(userId);
    for (const item of userCartItems) {
      this.cartItems.delete(item.id);
    }
    return true;
  }
}

export const storage = new MemStorage();
