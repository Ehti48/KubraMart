import { db } from './db';
import { categories, products, users } from '../shared/schema';
import { hash } from 'bcrypt';

async function seed() {
  console.log('Seeding database...');

  // Clear existing data
  try {
    await db.delete(products);
    await db.delete(categories);
    await db.delete(users);
    console.log('Cleared existing data');
  } catch (error) {
    console.error('Error clearing data:', error);
  }

  // Add admin user
  const hashedPassword = await hash('password123', 10);
  const [adminUser] = await db.insert(users).values({
    username: 'admin',
    email: 'admin@kubramart.com',
    password: hashedPassword,
    firstName: 'Admin',
    lastName: 'User',
  }).returning();
  
  console.log('Added admin user:', adminUser.id);

  // Add categories
  const categoriesData = [
    {
      name: "Abayas",
      slug: "abayas",
      description: "Elegant and modern abayas for every occasion",
      image: "https://images.unsplash.com/photo-1532453288336-3a6e21280d5c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=450"
    },
    {
      name: "Jewelry",
      slug: "jewelry",
      description: "Beautiful handcrafted jewelry pieces",
      image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=450"
    },
    {
      name: "Kids Clothing",
      slug: "kids-clothing",
      description: "Comfortable and stylish clothing for children",
      image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=450"
    },
    {
      name: "Kitchen Utensils",
      slug: "kitchen-utensils",
      description: "High-quality kitchen tools and utensils",
      image: "https://images.unsplash.com/photo-1590794056486-75e67dada8af?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=450"
    },
    {
      name: "Party Supplies",
      slug: "party-supplies",
      description: "Everything you need for your special celebrations",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=450"
    }
  ];

  const insertedCategories = await db.insert(categories).values(categoriesData).returning();
  console.log(`Added ${insertedCategories.length} categories`);

  // Create a map of category names to IDs
  const categoryMap = insertedCategories.reduce((acc, cat) => {
    acc[cat.name] = cat.id;
    return acc;
  }, {} as Record<string, number>);

  // Add products
  const productsData = [
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
      categoryId: categoryMap["Abayas"]
    },
    {
      name: "Butterfly Abaya",
      slug: "butterfly-abaya",
      description: "Modern butterfly style abaya with wide sleeves and premium fabric",
      price: 149.99,
      salePrice: 129.99,
      image: "https://images.unsplash.com/photo-1619625236248-30530cab5394?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900",
      images: ["https://images.unsplash.com/photo-1619625236248-30530cab5394?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900"],
      featured: false,
      newArrival: true,
      rating: 4.8,
      numReviews: 12,
      stock: 35,
      categoryId: categoryMap["Abayas"]
    },
    {
      name: "Elegant Pearl Necklace",
      slug: "elegant-pearl-necklace",
      description: "Handcrafted pearl necklace with 18k gold plating",
      price: 79.99,
      salePrice: null,
      image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900",
      images: ["https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900"],
      featured: true,
      newArrival: false,
      rating: 4.7,
      numReviews: 32,
      stock: 25,
      categoryId: categoryMap["Jewelry"]
    },
    {
      name: "Silver Filigree Earrings",
      slug: "silver-filigree-earrings",
      description: "Delicate silver filigree earrings with traditional patterns",
      price: 59.99,
      salePrice: 49.99,
      image: "https://images.unsplash.com/photo-1635767798638-3665e36e531b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900",
      images: ["https://images.unsplash.com/photo-1635767798638-3665e36e531b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900"],
      featured: false,
      newArrival: true,
      rating: 4.6,
      numReviews: 18,
      stock: 40,
      categoryId: categoryMap["Jewelry"]
    },
    {
      name: "Kids Summer Dress",
      slug: "kids-summer-dress",
      description: "Colorful and comfortable summer dress for girls",
      price: 39.99,
      salePrice: 29.99,
      image: "https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900",
      images: ["https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900"],
      featured: true,
      newArrival: true,
      rating: 4.4,
      numReviews: 15,
      stock: 30,
      categoryId: categoryMap["Kids Clothing"]
    },
    {
      name: "Boys Casual Set",
      slug: "boys-casual-set",
      description: "Comfortable 2-piece casual set for boys",
      price: 44.99,
      salePrice: null,
      image: "https://images.unsplash.com/photo-1519238359922-239b0144250f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900",
      images: ["https://images.unsplash.com/photo-1519238359922-239b0144250f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900"],
      featured: false,
      newArrival: false,
      rating: 4.3,
      numReviews: 10,
      stock: 25,
      categoryId: categoryMap["Kids Clothing"]
    },
    {
      name: "Premium Knife Set",
      slug: "premium-knife-set",
      description: "Professional grade 5-piece knife set with wooden block",
      price: 189.99,
      salePrice: 159.99,
      image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900",
      images: ["https://images.unsplash.com/photo-1593618998160-e34014e67546?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900"],
      featured: true,
      newArrival: false,
      rating: 4.9,
      numReviews: 45,
      stock: 15,
      categoryId: categoryMap["Kitchen Utensils"]
    },
    {
      name: "Silicone Cooking Utensils",
      slug: "silicone-cooking-utensils",
      description: "Heat-resistant silicone cooking utensils set of 10 pieces",
      price: 49.99,
      salePrice: 39.99,
      image: "https://images.unsplash.com/photo-1631984564919-1d99181dd901?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900",
      images: ["https://images.unsplash.com/photo-1631984564919-1d99181dd901?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900"],
      featured: false,
      newArrival: true,
      rating: 4.5,
      numReviews: 28,
      stock: 35,
      categoryId: categoryMap["Kitchen Utensils"]
    },
    {
      name: "Birthday Decoration Kit",
      slug: "birthday-decoration-kit",
      description: "Complete birthday decoration kit with balloons, banners, and party poppers",
      price: 34.99,
      salePrice: 29.99,
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900",
      images: ["https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900"],
      featured: true,
      newArrival: false,
      rating: 4.6,
      numReviews: 22,
      stock: 50,
      categoryId: categoryMap["Party Supplies"]
    },
    {
      name: "Paper Plates and Cups Set",
      slug: "paper-plates-cups-set",
      description: "Eco-friendly paper plates and cups set for 20 people",
      price: 24.99,
      salePrice: null,
      image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900",
      images: ["https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=900"],
      featured: false,
      newArrival: true,
      rating: 4.2,
      numReviews: 14,
      stock: 40,
      categoryId: categoryMap["Party Supplies"]
    }
  ];

  const insertedProducts = await db.insert(products).values(productsData).returning();
  console.log(`Added ${insertedProducts.length} products`);

  console.log('Database seeding completed successfully');
}

seed().catch(error => {
  console.error('Error seeding database:', error);
  process.exit(1);
}).then(() => {
  process.exit(0);
});