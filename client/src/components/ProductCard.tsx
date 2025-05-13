import { useState } from "react";
import { Link } from "wouter";
import { useCart } from "../context/CartContext";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { toast } = useToast();
  
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
    console.log("Cart context not available in ProductCard");
  }
  const [isHovering, setIsHovering] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: 0, // Will be set by storage
      userId: 1, // Default user ID
      productId: product.id,
      quantity: 1,
      product
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Implement quick view functionality
    console.log("Quick view clicked for", product.name);
  };

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-md hover-scale group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link href={`/product/${product.slug}`} className="block">
          <div className="relative">
            <img 
              src={product.image || ''} 
              alt={product.name || 'Product'} 
              className="w-full h-64 object-cover"
            />
            
            {product.salePrice && (
              <div className="absolute top-2 right-2">
                <span className="bg-warning text-white text-xs py-1 px-2 rounded">Sale</span>
              </div>
            )}
            
            {product.newArrival && (
              <div className="absolute top-2 right-2">
                <span className="bg-primary text-white text-xs py-1 px-2 rounded">New</span>
              </div>
            )}
            
            <div className="absolute top-2 left-2">
              <button className="bg-white rounded-full p-2 text-gray-400 hover:text-primary transition-colors">
                <i className="bi bi-heart"></i>
              </button>
            </div>
            
            <div className={`absolute inset-0 bg-black bg-opacity-20 ${isHovering ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 flex items-center justify-center`}>
              <Button 
                onClick={handleQuickView}
                className={`bg-white text-primary px-4 py-2 rounded-full text-sm font-medium transform ${isHovering ? 'translate-y-0' : '-translate-y-4'} transition-transform duration-300`}
              >
                Quick View
              </Button>
            </div>
          </div>
          
          <div className="p-4">
            <div className="text-xs text-gray-500 mb-1">
              {/* Display category name if available */}
            </div>
            <h3 className="font-poppins font-medium mb-1">{product.name}</h3>
            <div className="flex items-center mb-2">
              <div className="flex text-warning">
                {Array.from({ length: 5 }).map((_, i) => {
                  const rating = product.rating || 0;
                  // Full star
                  if (i < Math.floor(rating)) {
                    return <i key={i} className="bi bi-star-fill"></i>;
                  }
                  // Half star
                  else if (i === Math.floor(rating) && rating % 1 >= 0.5) {
                    return <i key={i} className="bi bi-star-half"></i>;
                  }
                  // Empty star
                  else {
                    return <i key={i} className="bi bi-star"></i>;
                  }
                })}
              </div>
              <span className="text-xs text-gray-500 ml-1">({product.numReviews || 0})</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                {product.salePrice ? (
                  <>
                    <span className="text-primary font-bold">${product.salePrice.toFixed(2)}</span>
                    <span className="text-gray-400 text-sm line-through ml-2">${product.price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-primary font-bold">${product.price.toFixed(2)}</span>
                )}
              </div>
              <Button 
                onClick={handleAddToCart}
                className="bg-primary hover:bg-primary/90 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
              >
                <i className="bi bi-cart-plus"></i>
              </Button>
            </div>
          </div>
      </Link>
    </div>
  );
};

export default ProductCard;
