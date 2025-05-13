import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import HeroCarousel from "../components/HeroCarousel";
import FeatureSection from "../components/FeatureSection";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import PromoBanner from "../components/PromoBanner";
import TestimonialCard from "../components/TestimonialCard";
import Newsletter from "../components/Newsletter";
import { Button } from "@/components/ui/button";
import { Category, Product } from "@shared/schema";

const Home = () => {
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: featuredProducts, isLoading: featuredLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', { featured: true }],
  });

  const { data: newArrivals, isLoading: newArrivalsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', { new: true }],
  });
  
  // Sample testimonials data (this would typically come from an API)
  const testimonials = [
    {
      id: 1,
      rating: 5,
      text: "The quality of the abayas from THAIBAH ENTERPRISES is exceptional! The material is comfortable and the designs are elegant. I've received so many compliments!",
      author: {
        initial: "S",
        name: "Sarah A.",
        status: "Loyal Customer"
      }
    },
    {
      id: 2,
      rating: 5,
      text: "I purchased the tea set from MINHA ZAINAB ENTERPRISES as a gift for my mother. The quality is outstanding and the packaging was perfect. Will definitely shop again!",
      author: {
        initial: "F",
        name: "Fatima K.",
        status: "New Customer"
      }
    },
    {
      id: 3,
      rating: 4.5,
      text: "The kids' clothing from TODLERRY is adorable and practical. The materials are durable and comfortable for active children. Very happy with my purchase!",
      author: {
        initial: "H",
        name: "Hana M.",
        status: "Regular Customer"
      }
    }
  ];

  return (
    <>
      <HeroCarousel />
      
      <FeatureSection />
      
      {/* Shop Categories */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-poppins font-bold text-center mb-3">Our Specialty Shops</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Browse through our specialized boutiques offering authentic Islamic fashion, home goods, and more
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesLoading ? (
              // Display skeleton loaders while loading
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="rounded-lg overflow-hidden shadow-md h-64 bg-gray-200 animate-pulse"></div>
              ))
            ) : (
              // Display categories
              categories?.slice(0, 6).map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))
            )}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/category/all">
              <Button className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors">
                View All Shops
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-poppins font-bold text-center mb-3">Featured Products</h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Discover our handpicked selection of premium products
          </p>
          
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-100 rounded-full p-1">
              <button className="px-4 py-2 rounded-full bg-primary text-white font-medium">All</button>
              <button className="px-4 py-2 rounded-full text-gray-700 hover:bg-gray-200 transition-colors font-medium">Abayas</button>
              <button className="px-4 py-2 rounded-full text-gray-700 hover:bg-gray-200 transition-colors font-medium">Home</button>
              <button className="px-4 py-2 rounded-full text-gray-700 hover:bg-gray-200 transition-colors font-medium">Kids</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLoading ? (
              // Display skeleton loaders while loading
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-lg overflow-hidden shadow-md bg-gray-100 animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : (
              // Display featured products
              featuredProducts?.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
          
          <div className="text-center mt-10">
            <Link href="/category/featured">
              <Button className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Promo Banner */}
      <PromoBanner 
        title="25% OFF on Home Decor"
        subtitle="Limited Time Offer"
        description="Elevate your home with our exclusive collection of Islamic home decor. Sale ends this Friday."
        buttonText="Shop The Collection"
        buttonLink="/category/crescent-fashion"
        backgroundImage="https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&h=800"
      />
      
      {/* New Arrivals */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-poppins font-bold text-center mb-3">New Arrivals</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            The latest additions to our collection
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivalsLoading ? (
              // Display skeleton loaders while loading
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-lg overflow-hidden shadow-md bg-gray-100 animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : (
              // Display new arrivals
              newArrivals?.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-poppins font-bold text-center mb-3">What Our Customers Say</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Read testimonials from our satisfied customers
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>
      
      <Newsletter />
    </>
  );
};

export default Home;
