import { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "../context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { createOrder } from "../services/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define form schema
const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zip: z.string().min(5, "ZIP code must be at least 5 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  paymentMethod: z.enum(["credit", "debit", "paypal"])
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const [, setLocation] = useLocation();
  const { cart, clearCart, cartTotal } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
  
  // Default form values
  const defaultValues: CheckoutFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    paymentMethod: "credit"
  };
  
  // Initialize form
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues
  });
  
  // Handle continuing to payment step
  const handleContinueToPayment = async () => {
    // Validate shipping fields
    const result = await form.trigger([
      "firstName", 
      "lastName", 
      "email", 
      "phone", 
      "address", 
      "city", 
      "state", 
      "zip", 
      "country"
    ]);
    
    if (result) {
      setStep(2);
    }
  };
  
  // Handle back to shipping step
  const handleBackToShipping = () => {
    setStep(1);
  };
  
  // Handle form submission
  const onSubmit = async (data: CheckoutFormValues) => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Please add products before checking out.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create order items
      const orderItems = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product?.salePrice || item.product?.price || 0
      }));
      
      // Calculate shipping cost
      const shippingCost = cartTotal > 50 ? 0 : 5;
      
      // Create order
      await createOrder(
        {
          userId: 1, // Default user ID
          total: cartTotal + shippingCost,
          status: "pending",
          createdAt: new Date().toISOString(),
          shippingAddress: data.address,
          shippingCity: data.city,
          shippingState: data.state,
          shippingZip: data.zip,
          shippingCountry: data.country
        },
        orderItems
      );
      
      // Clear cart
      await clearCart();
      
      // Show success message
      toast({
        title: "Order Placed Successfully",
        description: "Thank you for your purchase! Your order has been placed successfully."
      });
      
      // Redirect to confirmation page (or home for now)
      setLocation("/");
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Shipping cost and total calculations
  const shippingCost = cartTotal > 50 ? 0 : 5;
  const orderTotal = cartTotal + shippingCost;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-poppins font-bold mb-6">Checkout</h1>
      
      {cart.length === 0 ? (
        <Card className="bg-white">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4 text-gray-300">
              <i className="bi bi-cart-x"></i>
            </div>
            <h2 className="text-2xl font-poppins font-medium mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">You need to add products to your cart before checking out.</p>
            <Button 
              onClick={() => setLocation("/")}
              className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Checkout form */}
              <div className="lg:w-2/3">
                <Card className="bg-white overflow-hidden mb-6">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-poppins font-medium">Checkout Steps</h2>
                  </div>
                  
                  {/* Steps indicator */}
                  <div className="flex p-4 border-b">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                        1
                      </div>
                      <div className="ml-2 font-medium">Shipping</div>
                    </div>
                    <div className="flex-1 flex items-center mx-4">
                      <div className={`h-1 w-full ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                        2
                      </div>
                      <div className="ml-2 font-medium">Payment</div>
                    </div>
                  </div>
                </Card>
                
                {/* Shipping Information (Step 1) */}
                {step === 1 && (
                  <Card className="bg-white overflow-hidden mb-6">
                    <div className="p-6 border-b">
                      <h2 className="text-xl font-poppins font-medium">Shipping Information</h2>
                    </div>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="First Name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Last Name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Email Address" type="email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Phone Number" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="md:col-span-2">
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Street Address" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="City" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State/Province</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="State/Province" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="zip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP/Postal Code</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="ZIP/Postal Code" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Country" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="mt-8 flex justify-end">
                        <Button 
                          type="button"
                          onClick={handleContinueToPayment}
                          className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
                        >
                          Continue to Payment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Payment Information (Step 2) */}
                {step === 2 && (
                  <Card className="bg-white overflow-hidden mb-6">
                    <div className="p-6 border-b">
                      <h2 className="text-xl font-poppins font-medium">Payment Information</h2>
                    </div>
                    <CardContent className="p-6">
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Method</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="credit">Credit Card</SelectItem>
                                <SelectItem value="debit">Debit Card</SelectItem>
                                <SelectItem value="paypal">PayPal</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {form.watch("paymentMethod") === "credit" || form.watch("paymentMethod") === "debit" ? (
                        <div className="mt-6 space-y-6">
                          <div className="space-y-4">
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input 
                              id="cardNumber" 
                              placeholder="1234 5678 9012 3456" 
                              className="w-full" 
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <Label htmlFor="expiryDate">Expiry Date</Label>
                              <Input 
                                id="expiryDate" 
                                placeholder="MM/YY" 
                                className="w-full" 
                              />
                            </div>
                            
                            <div className="space-y-4">
                              <Label htmlFor="cvc">CVC</Label>
                              <Input 
                                id="cvc" 
                                placeholder="123" 
                                className="w-full" 
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <Label htmlFor="nameOnCard">Name on Card</Label>
                            <Input 
                              id="nameOnCard" 
                              placeholder="Name on Card" 
                              className="w-full" 
                            />
                          </div>
                        </div>
                      ) : form.watch("paymentMethod") === "paypal" ? (
                        <div className="mt-6 p-6 border border-gray-200 rounded-lg text-center">
                          <div className="text-4xl text-blue-600 mb-4">
                            <i className="bi bi-paypal"></i>
                          </div>
                          <p className="mb-4">You will be redirected to PayPal to complete your payment.</p>
                        </div>
                      ) : null}
                      
                      <div className="mt-8 flex justify-between">
                        <Button 
                          type="button"
                          onClick={handleBackToShipping}
                          variant="outline"
                          className="px-6 py-3 rounded-full font-medium"
                        >
                          Back to Shipping
                        </Button>
                        
                        <Button 
                          type="submit"
                          className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center">
                              <i className="bi bi-arrow-repeat animate-spin mr-2"></i> Processing...
                            </span>
                          ) : (
                            <span>Place Order</span>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Order Summary */}
              <div className="lg:w-1/3">
                <Card className="bg-white overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-poppins font-medium">Order Summary</h2>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Cart items */}
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <div className="flex items-start">
                              <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0 mr-3">
                                <img 
                                  src={item.product?.image} 
                                  alt={item.product?.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium">{item.product?.name}</div>
                                <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                              </div>
                            </div>
                            <div className="font-medium">
                              ${((item.product?.salePrice || item.product?.price || 0) * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <Separator />
                      
                      {/* Totals */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-medium text-lg">
                          <span>Total</span>
                          <span className="text-primary">${orderTotal.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      {/* Promo code */}
                      <div className="pt-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="font-medium mb-2">Have a promo code?</div>
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
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default Checkout;
