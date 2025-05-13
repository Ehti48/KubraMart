import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useCart } from "../context/CartContext";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const [, setLocation] = useLocation();
  const { cart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-primary text-white text-center py-2 text-sm">
        <p>Free shipping on orders over $50 | Use code WELCOME10 for 10% off your first order</p>
      </div>
      
      {/* Main Navbar */}
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-poppins font-bold text-primary">
            Kubra<span className="text-secondary">Mart</span>
          </Link>
          
          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 mx-10">
            <form onSubmit={handleSearch} className="relative w-full">
              <input 
                type="text" 
                placeholder="Search products, categories..." 
                className="w-full py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-2.5">
                <i className="bi bi-search text-gray-500"></i>
              </button>
            </form>
          </div>
          
          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-5">
            <a href="#" className="flex items-center gap-1 hover:text-primary transition-colors">
              <i className="bi bi-person"></i>
              <span>Account</span>
            </a>
            <a href="#" className="flex items-center gap-1 hover:text-primary transition-colors">
              <i className="bi bi-heart"></i>
              <span>Wishlist</span>
            </a>
            <Link href="/cart" className="flex items-center gap-1 text-primary relative">
                <i className="bi bi-cart3"></i>
                <span>Cart</span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartItemsCount}
                  </span>
                )}
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden text-secondary text-2xl p-1">
                <i className="bi bi-list"></i>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="py-4 flex flex-col gap-4">
                <Link href="/">
                  <a className="text-xl font-poppins font-bold text-primary mb-6">
                    Kubra<span className="text-secondary">Mart</span>
                  </a>
                </Link>
                <Link href="/">
                  <a className="flex items-center gap-2 py-2 hover:text-primary transition-colors">
                    <i className="bi bi-house"></i> Home
                  </a>
                </Link>
                <Link href="/category/all">
                  <a className="flex items-center gap-2 py-2 hover:text-primary transition-colors">
                    <i className="bi bi-grid"></i> All Products
                  </a>
                </Link>
                <div className="py-2">
                  <div className="font-medium mb-2 flex items-center gap-2">
                    <i className="bi bi-list"></i> Categories
                  </div>
                  <div className="pl-8 flex flex-col gap-2">
                    <Link href="/category/thaibah-enterprises">
                      <a className="hover:text-primary transition-colors">THAIBAH ENTERPRISES</a>
                    </Link>
                    <Link href="/category/minha-zainab-enterprises">
                      <a className="hover:text-primary transition-colors">MINHA ZAINAB ENTERPRISES</a>
                    </Link>
                    <Link href="/category/haya-boutique">
                      <a className="hover:text-primary transition-colors">HAYA BOUTIQUE</a>
                    </Link>
                    <Link href="/category/ayisha-silk-house">
                      <a className="hover:text-primary transition-colors">AYISHA SILK HOUSE</a>
                    </Link>
                    <Link href="/category/todlerry">
                      <a className="hover:text-primary transition-colors">TODLERRY</a>
                    </Link>
                    <Link href="/category/crescent-fashion">
                      <a className="hover:text-primary transition-colors">CRESCENT FASHION</a>
                    </Link>
                    <Link href="/category/al-aiman-creation">
                      <a className="hover:text-primary transition-colors">AL-AIMAN CREATION</a>
                    </Link>
                    <Link href="/category/girls-and-boys">
                      <a className="hover:text-primary transition-colors">GIRL'S & BOY'S</a>
                    </Link>
                    <Link href="/category/general-shop">
                      <a className="hover:text-primary transition-colors">General Shop</a>
                    </Link>
                  </div>
                </div>
                <Link href="/cart">
                  <a className="flex items-center gap-2 py-2 hover:text-primary transition-colors">
                    <i className="bi bi-cart3"></i> Cart ({cartItemsCount})
                  </a>
                </Link>
                <a href="#" className="flex items-center gap-2 py-2 hover:text-primary transition-colors">
                  <i className="bi bi-person"></i> Account
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Search Bar - Mobile */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearch} className="relative w-full">
            <input 
              type="text" 
              placeholder="Search products, categories..." 
              className="w-full py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-2.5">
              <i className="bi bi-search text-gray-500"></i>
            </button>
          </form>
        </div>
      </nav>
      
      {/* Category Navigation */}
      <div className="bg-gray-100 py-2 border-t border-gray-200 hidden md:block">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-center space-x-6 text-sm font-medium">
            <li><Link href="/"><a className="hover:text-primary transition-colors">Home</a></Link></li>
            <li><Link href="/category/all"><a className="hover:text-primary transition-colors">All Products</a></Link></li>
            <li className="group relative">
              <a href="#" className="flex items-center gap-1 hover:text-primary transition-colors">
                Categories <i className="bi bi-chevron-down text-xs"></i>
              </a>
              <div className="absolute left-0 top-full bg-white shadow-lg rounded-b-lg p-4 w-64 hidden group-hover:block z-10">
                <ul className="space-y-2 text-sm">
                  <li><Link href="/category/thaibah-enterprises"><a className="block hover:text-primary transition-colors">THAIBAH ENTERPRISES</a></Link></li>
                  <li><Link href="/category/minha-zainab-enterprises"><a className="block hover:text-primary transition-colors">MINHA ZAINAB ENTERPRISES</a></Link></li>
                  <li><Link href="/category/haya-boutique"><a className="block hover:text-primary transition-colors">HAYA BOUTIQUE</a></Link></li>
                  <li><Link href="/category/ayisha-silk-house"><a className="block hover:text-primary transition-colors">AYISHA SILK HOUSE</a></Link></li>
                  <li><Link href="/category/todlerry"><a className="block hover:text-primary transition-colors">TODLERRY</a></Link></li>
                  <li><Link href="/category/crescent-fashion"><a className="block hover:text-primary transition-colors">CRESCENT FASHION</a></Link></li>
                  <li><Link href="/category/al-aiman-creation"><a className="block hover:text-primary transition-colors">AL-AIMAN CREATION</a></Link></li>
                  <li><Link href="/category/girls-and-boys"><a className="block hover:text-primary transition-colors">GIRL'S & BOY'S</a></Link></li>
                  <li><Link href="/category/general-shop"><a className="block hover:text-primary transition-colors">General Shop</a></Link></li>
                </ul>
              </div>
            </li>
            <li><Link href="/category/new-arrivals"><a className="hover:text-primary transition-colors">New Arrivals</a></Link></li>
            <li><Link href="/category/sale"><a className="hover:text-primary transition-colors">Sale</a></Link></li>
            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
