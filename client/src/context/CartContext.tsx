import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Define cart item interface
export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product?: Product;
}

// Define cart context interface
interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
  isInitialized: boolean;
  cartTotal: number;
}

// Create the cart context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Provider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();
  
  // Default user ID (in a real app, this would come from authentication)
  const userId = 1;

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => {
    const price = item.product?.salePrice || item.product?.price || 0;
    return total + price * item.quantity;
  }, 0);

  // Fetch cart items on component mount
  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/cart/${userId}`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setCart(data);
        } else {
          console.error("Failed to fetch cart items");
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    fetchCart();
  }, [userId]);

  // Add item to cart
  const addToCart = async (item: CartItem) => {
    setIsLoading(true);
    try {
      // Check if the item already exists in cart
      const existingItem = cart.find(cartItem => cartItem.productId === item.productId);
      
      if (existingItem) {
        // Update quantity if item exists
        await updateQuantity(existingItem.id, existingItem.quantity + item.quantity);
      } else {
        // Add new item if it doesn't exist
        const response = await apiRequest('POST', '/api/cart', {
          userId: userId,
          productId: item.productId,
          quantity: item.quantity
        });
        
        if (response.ok) {
          const newItem = await response.json();
          setCart(prevCart => [...prevCart, { ...newItem, product: item.product }]);
        } else {
          throw new Error("Failed to add item to cart");
        }
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await apiRequest('DELETE', `/api/cart/${id}`, undefined);
      
      if (response.ok) {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
      } else {
        throw new Error("Failed to remove item from cart");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await apiRequest('PUT', `/api/cart/${id}`, { quantity });
      
      if (response.ok) {
        const updatedItem = await response.json();
        setCart(prevCart => prevCart.map(item => 
          item.id === id ? { ...item, quantity: updatedItem.quantity } : item
        ));
      } else {
        throw new Error("Failed to update item quantity");
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update item quantity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('DELETE', `/api/cart/user/${userId}`, undefined);
      
      if (response.ok) {
        setCart([]);
      } else {
        throw new Error("Failed to clear cart");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isLoading,
        isInitialized,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
