import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would typically send the email to your backend
    console.log("Newsletter subscription for:", email);
    
    // Show success message
    toast({
      title: "Subscription successful!",
      description: "Thank you for subscribing to our newsletter.",
    });
    
    // Reset form
    setEmail("");
  };

  return (
    <section className="py-12 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-poppins font-bold text-white mb-3">Join Our Newsletter</h2>
          <p className="text-white text-opacity-90 mb-6">
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto" onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-grow px-4 py-3 rounded-l-lg focus:outline-none" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button 
              type="submit" 
              className="bg-white text-primary px-6 py-3 rounded-r-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </Button>
          </form>
          
          <p className="text-white text-opacity-70 text-sm mt-4">
            By subscribing you agree to receive marketing emails from Kubra Mart.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
