import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const HeroCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      image: "/src/lib/modern-stylish-muslim-woman-hijab-denim-jacket-black-abaya-sitting-city-street-working-laptop.jpg",
      title: "Elegant Abayas Collection",
      description: "Discover our new season of Dubai-inspired abayas for every occasion",
      buttonText: "Shop Now",
      buttonLink: "/category/thaibah-enterprises"
    }
    // ,
    // {
    //   id: 2,
    //   image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&h=800",
    //   title: "Home Decor Collection",
    //   description: "Transform your space with our exclusive Islamic home decor items",
    //   buttonText: "Explore Collection",
    //   buttonLink: "/category/crescent-fashion"
    // },
    // {
    //   id: 3,
    //   image: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&h=800",
    //   title: "Kids Fashion Collection",
    //   description: "Adorable and comfortable clothing for your little ones",
    //   buttonText: "View Collection",
    //   buttonLink: "/category/todlerry"
    // }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative">
      {/* Hero Carousel */}
      <div className="relative w-full overflow-hidden" style={{ height: "500px" }}>
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
              index === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`} 
            style={{ backgroundImage: `url('${slide.image}')`, backgroundPosition: "top" }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute inset-0 flex items-center justify-center md:justify-start">
              <div className="text-center md:text-left md:ml-16 p-6 max-w-lg">
                <h2 className="text-white text-3xl md:text-4xl font-poppins font-bold mb-4">{slide.title}</h2>
                <p className="text-white text-lg mb-6">{slide.description}</p>
                <Link href={slide.buttonLink}>
                  <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-6 rounded-full font-medium transition-colors">
                    {slide.buttonText}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Hero Navigation Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {slides.map((_, index) => (
          <button 
            key={index}
            className={`w-3 h-3 rounded-full bg-white ${
              index === activeSlide ? "bg-opacity-100" : "bg-opacity-50"
            }`}
            onClick={() => setActiveSlide(index)}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
