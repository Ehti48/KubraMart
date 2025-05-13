import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, isLoading, cartTotal } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCart = async () => {
    if (cart.length === 0) return;
    
    setIsClearing(true);
    try {
      await clearCart();
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart."
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: number) => {
    removeFromCart(id);
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart."
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-poppins font-bold mb-6">Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <Card className="bg-white">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4 text-gray-300">
              <i className="bi bi-cart-x"></i>
            </div>
            <h2 className="text-2xl font-poppins font-medium mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Button 
              onClick={() => setLocation("/")}
              className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <Card className="bg-white overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-poppins font-medium">Cart Items ({cart.length})</h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleClearCart}
                    disabled={isLoading || isClearing}
                    className="text-sm"
                  >
                    {isClearing ? (
                      <span className="flex items-center">
                        <i className="bi bi-arrow-repeat animate-spin mr-2"></i> Clearing...
                      </span>
                    ) : (
                      <span>Clear Cart</span>
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Cart items list */}
              <div>
                {cart.map((item) => (
                  <div key={item.id} className="border-b last:border-b-0">
                    <div className="p-4 flex flex-col sm:flex-row gap-4">
                      {/* Product image */}
                      <div className="sm:w-24 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <Link href={`/product/${item.product?.slug}`}>
                          <a>
                            <img 
                              src={item.product?.image} 
                              alt={item.product?.name} 
                              className="w-full h-full object-cover"
                            />
                          </a>
                        </Link>
                      </div>
                      
                      {/* Product details */}
                      <div className="flex-grow flex flex-col sm:flex-row justify-between">
                        <div className="mb-4 sm:mb-0">
                          <Link href={`/product/${item.product?.slug}`}>
                            <a className="text-lg font-medium hover:text-primary transition-colors">
                              {item.product?.name}
                            </a>
                          </Link>
                          <div className="text-sm text-gray-500 mt-1">
                            Product ID: {item.productId}
                          </div>
                          <div className="font-medium text-primary mt-2">
                            ${(item.product?.salePrice || item.product?.price || 0).toFixed(2)}
                          </div>
                          {item.product?.salePrice && (
                            <span className="text-sm text-gray-400 line-through ml-2">
                              ${item.product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-row sm:flex-col justify-between items-end sm:items-end">
                          {/* Quantity controls */}
                          <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                            <button 
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                              disabled={isLoading || item.quantity <= 1}
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <span className="w-10 text-center">
                              {isLoading ? <i className="bi bi-arrow-repeat animate-spin"></i> : item.quantity}
                            </span>
                            <button 
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                              disabled={isLoading}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                          
                          {/* Subtotal and remove button */}
                          <div className="text-right mt-4">
                            <div className="font-medium mb-2">
                              ${((item.product?.salePrice || item.product?.price || 0) * item.quantity).toFixed(2)}
                            </div>
                            <button 
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-sm text-red-500 hover:text-red-700 transition-colors flex items-center"
                              disabled={isLoading}
                            >
                              <i className="bi bi-trash mr-1"></i> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <Card className="bg-white overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-poppins font-medium">Order Summary</h2>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{cartTotal > 50 ? "Free" : "$5.00"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span className="text-primary">${(cartTotal > 50 ? cartTotal : cartTotal + 5).toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      onClick={() => setLocation("/checkout")}
                      className="w-full bg-primary text-white py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
                      disabled={isLoading}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      onClick={() => setLocation("/")}
                      variant="outline"
                      className="w-full py-2 rounded-full font-medium"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Promo code section */}
            <Card className="bg-white mt-4">
              <CardContent className="p-6">
                <h3 className="font-medium mb-3">Promo Code</h3>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter code" 
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <Button className="bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Apply
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
