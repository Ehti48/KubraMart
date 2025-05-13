import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../components/ProductCard";
import { Product, Category } from "@shared/schema";

const CategoryProducts = () => {
  const [match, params] = useRoute("/category/:slug");
  const [, setLocation] = useLocation();
  const [sortBy, setSortBy] = useState("featured");
  
  const { data: category, isLoading: categoryLoading } = useQuery<Category>({
    queryKey: [`/api/categories/${params?.slug}`],
    enabled: !!params?.slug && params?.slug !== "all" && params?.slug !== "featured" && params?.slug !== "new-arrivals"
  });
  
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', { category: params?.slug === "all" ? null : params?.slug }],
    enabled: !!params?.slug
  });

  // Special query for featured products
  const { data: featuredProducts, isLoading: featuredLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', { featured: true }],
    enabled: params?.slug === "featured"
  });

  // Special query for new arrivals
  const { data: newArrivals, isLoading: newArrivalsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', { new: true }],
    enabled: params?.slug === "new-arrivals"
  });

  const isLoading = productsLoading || 
                    (params?.slug === "featured" && featuredLoading) || 
                    (params?.slug === "new-arrivals" && newArrivalsLoading) ||
                    (params?.slug !== "all" && params?.slug !== "featured" && params?.slug !== "new-arrivals" && categoryLoading);

  // Determine which products to display based on the category slug
  let displayProducts: Product[] = [];
  let categoryName = "All Products";

  if (params?.slug === "featured" && featuredProducts) {
    displayProducts = featuredProducts;
    categoryName = "Featured Products";
  } else if (params?.slug === "new-arrivals" && newArrivals) {
    displayProducts = newArrivals;
    categoryName = "New Arrivals";
  } else if (products) {
    displayProducts = products;
    if (category) {
      categoryName = category.name;
    }
  }

  // Sort products based on the selected option
  const sortedProducts = [...displayProducts];
  switch (sortBy) {
    case "price-low":
      sortedProducts.sort((a, b) => {
        const aPrice = a.salePrice || a.price;
        const bPrice = b.salePrice || b.price;
        return aPrice - bPrice;
      });
      break;
    case "price-high":
      sortedProducts.sort((a, b) => {
        const aPrice = a.salePrice || a.price;
        const bPrice = b.salePrice || b.price;
        return bPrice - aPrice;
      });
      break;
    case "rating":
      sortedProducts.sort((a, b) => b.rating - a.rating);
      break;
    case "name-asc":
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default: // "featured" or any other case
      // Keep the original order which we assume is the featured order
      break;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-primary transition-colors">Home</a> / {categoryName}
      </div>
      
      {/* Category header */}
      <div className="mb-8">
        <h1 className="text-3xl font-poppins font-bold mb-2">{categoryName}</h1>
        {category && <p className="text-gray-600">{category.description}</p>}
      </div>
      
      {/* Filter and sort section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="font-medium">{displayProducts.length} Products</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="sort-by" className="text-sm font-medium">Sort by:</label>
              <select 
                id="sort-by" 
                className="border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Products grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-lg h-80 animate-pulse"></div>
          ))}
        </div>
      ) : sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">
            <i className="bi bi-search"></i>
          </div>
          <h2 className="text-2xl font-poppins font-medium mb-2">No Products Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find any products matching your selection.</p>
          <button 
            onClick={() => setLocation("/")}
            className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
