import { useState } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ProductCard from "../components/ProductCard";
import { Product } from "@shared/schema";

const ProductDetail = () => {
  const [match, params] = useRoute("/product/:slug");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  
  // Use try-catch to handle possible missing CartContext
  let addToCart = (item: any) => {
    toast({
      title: "Cart Not Available",
      description: "Could not add to cart. Please try again later.",
      variant: "destructive",
    });
  };
  
  try {
    const cartContext = useCart();
    addToCart = cartContext.addToCart;
  } catch (error) {
    console.log("Cart context not available in ProductDetail");
  }
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${params?.slug}`],
    enabled: !!params?.slug
  });

  const { data: relatedProducts, isLoading: relatedLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    // Only run this query if we have the product data and it has a category ID
    enabled: !!product?.categoryId
  });

  // Filter related products once data is loaded
  const filteredRelatedProducts = relatedProducts?.filter(
    p => p.categoryId === product?.categoryId && p.id !== product?.id
  ).slice(0, 4);

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  // Increment quantity
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  // Decrement quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Add to cart handler
  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: 0, // Will be set by storage
        userId: 1, // Default user ID
        productId: product.id,
        quantity,
        product
      });
      
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} has been added to your cart.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 animate-pulse">
            <div className="bg-gray-200 h-96 w-full rounded-lg"></div>
            <div className="flex mt-4 gap-2">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="w-24 h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-poppins font-bold mb-4">Product Not Found</h2>
        <p className="mb-8">Sorry, the product you're looking for doesn't exist or has been removed.</p>
        <Button 
          onClick={() => setLocation("/")}
          className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>{" "}
          /{" "}
          <Link href={`/category/${product.categoryId}`} className="hover:text-primary transition-colors">Category</Link>{" "}
          / {product.name}
        </div>
        
        {/* Product detail */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product images */}
          <div className="md:w-1/2">
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={(product.images && product.images[selectedImage]) || product.image || ''} 
                alt={product.name || 'Product'} 
                className="w-full h-96 object-contain"
              />
            </div>
            
            {/* Thumbnail images */}
            {product.images && product.images.length > 1 && (
              <div className="flex mt-4 gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button 
                    key={index} 
                    className={`w-24 h-24 rounded border-2 ${selectedImage === index ? 'border-primary' : 'border-transparent'}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} - ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product info */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-poppins font-bold mb-2">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex text-warning">
                {Array.from({ length: 5 }).map((_, i) => {
                  // Full star
                  if (i < Math.floor(product.rating)) {
                    return <i key={i} className="bi bi-star-fill"></i>;
                  }
                  // Half star
                  else if (i === Math.floor(product.rating) && product.rating % 1 >= 0.5) {
                    return <i key={i} className="bi bi-star-half"></i>;
                  }
                  // Empty star
                  else {
                    return <i key={i} className="bi bi-star"></i>;
                  }
                })}
              </div>
              <span className="text-sm text-gray-500 ml-2">{product.numReviews} reviews</span>
            </div>
            
            {/* Price */}
            <div className="mb-6">
              {product.salePrice ? (
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-primary mr-3">${product.salePrice.toFixed(2)}</span>
                  <span className="text-lg text-gray-400 line-through">${product.price.toFixed(2)}</span>
                  {/* Calculate discount percentage */}
                  <span className="ml-3 bg-warning text-white text-sm px-2 py-1 rounded">
                    {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
              )}
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-600">{product.description}</p>
            </div>
            
            {/* Stock status */}
            <div className="mb-6">
              <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>
            
            {/* Quantity selector */}
            <div className="mb-6 flex items-center">
              <span className="mr-3 font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                <button 
                  onClick={decrementQuantity}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                  disabled={quantity <= 1}
                >
                  <i className="bi bi-dash"></i>
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={handleQuantityChange}
                  className="w-12 text-center border-0 focus:ring-0 focus:outline-none"
                />
                <button 
                  onClick={incrementQuantity}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <i className="bi bi-plus"></i>
                </button>
              </div>
            </div>
            
            {/* Add to cart button */}
            <div className="mb-6">
              <Button 
                onClick={handleAddToCart}
                className="bg-primary text-white w-full py-3 rounded-full font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                disabled={product.stock <= 0}
              >
                <i className="bi bi-cart-plus"></i> Add to Cart
              </Button>
            </div>
            
            {/* Wishlist button */}
            <div className="mb-8">
              <Button variant="outline" className="w-full py-3 rounded-full font-medium flex items-center justify-center gap-2">
                <i className="bi bi-heart"></i> Add to Wishlist
              </Button>
            </div>
            
            {/* Additional info */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <i className="bi bi-truck text-primary"></i>
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <i className="bi bi-arrow-return-left text-primary"></i>
                <span>Easy 14 days return policy</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <i className="bi bi-shield-check text-primary"></i>
                <span>Secure payment guaranteed</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related products */}
        {filteredRelatedProducts && filteredRelatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-poppins font-bold mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedLoading ? (
                // Display skeleton loaders while loading
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="bg-gray-100 rounded-lg h-80 animate-pulse"></div>
                ))
              ) : (
                filteredRelatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
