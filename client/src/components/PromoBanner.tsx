import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface PromoBannerProps {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
}

const PromoBanner = ({
  title,
  subtitle,
  description,
  buttonText,
  buttonLink,
  backgroundImage
}: PromoBannerProps) => {
  return (
    <section className="py-16 relative">
      <div 
        className="bg-cover bg-center h-96" 
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        <div className="absolute inset-0 bg-primary bg-opacity-70"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center md:items-end relative">
          <div className="text-center md:text-right md:max-w-lg p-6 bg-white bg-opacity-95 rounded-lg shadow-lg">
            <span className="text-primary font-medium">{subtitle}</span>
            <h2 className="text-3xl font-poppins font-bold mt-2 mb-4">{title}</h2>
            <p className="text-gray-600 mb-6">{description}</p>
            <Link href={buttonLink}>
              <Button className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors">
                {buttonText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
