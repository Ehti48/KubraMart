import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Column */}
          <div>
            <h3 className="text-xl font-poppins font-bold mb-4">About Kubra Mart</h3>
            <p className="text-gray-400 mb-4">
              Kubra Mart is your one-stop shop for authentic Islamic fashion, home goods, and more. 
              We offer quality products that respect tradition while embracing modern styles.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-poppins font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/category/all" className="text-gray-400 hover:text-white transition-colors">Shop All</Link></li>
              <li><Link href="/category/featured" className="text-gray-400 hover:text-white transition-colors">Featured Products</Link></li>
              <li><Link href="/category/new-arrivals" className="text-gray-400 hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link href="/category/sale" className="text-gray-400 hover:text-white transition-colors">Sale</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-xl font-poppins font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/category/thaibah-enterprises" className="text-gray-400 hover:text-white transition-colors">THAIBAH ENTERPRISES</Link></li>
              <li><Link href="/category/minha-zainab-enterprises" className="text-gray-400 hover:text-white transition-colors">MINHA ZAINAB ENTERPRISES</Link></li>
              <li><Link href="/category/haya-boutique" className="text-gray-400 hover:text-white transition-colors">HAYA BOUTIQUE</Link></li>
              <li><Link href="/category/ayisha-silk-house" className="text-gray-400 hover:text-white transition-colors">AYISHA SILK HOUSE</Link></li>
              <li><Link href="/category/todlerry" className="text-gray-400 hover:text-white transition-colors">TODLERRY</Link></li>
              <li><Link href="/category/crescent-fashion" className="text-gray-400 hover:text-white transition-colors">CRESCENT FASHION</Link></li>
              <li><Link href="/category/al-aiman-creation" className="text-gray-400 hover:text-white transition-colors">AL-AIMAN CREATION</Link></li>
              <li><Link href="/category/girls-and-boys" className="text-gray-400 hover:text-white transition-colors">GIRL'S & BOY'S</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-poppins font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="bi bi-geo-alt text-primary mr-3 mt-1"></i>
                <span className="text-gray-400">123 Islamic Center Street, Dubai, UAE</span>
              </li>
              <li className="flex items-center">
                <i className="bi bi-telephone text-primary mr-3"></i>
                <span className="text-gray-400">+971 123 456 7890</span>
              </li>
              <li className="flex items-center">
                <i className="bi bi-envelope text-primary mr-3"></i>
                <span className="text-gray-400">info@kubramart.com</span>
              </li>
              <li className="flex items-center">
                <i className="bi bi-clock text-primary mr-3"></i>
                <span className="text-gray-400">Mon-Sat: 9AM - 9PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="border-gray-700 mb-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">&copy; 2023 Kubra Mart. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Shipping Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
