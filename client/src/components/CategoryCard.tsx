import { Link } from "wouter";
import { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link href={`/category/${category.slug}`}>
      <a className="category-card rounded-lg overflow-hidden shadow-md hover-scale relative h-64 cursor-pointer group">
        <img 
          src={category.image} 
          alt={category.name} 
          className="w-full h-full object-cover"
        />
        <div className="category-overlay">
          <h3 className="text-white text-xl font-poppins font-bold mb-2">{category.name}</h3>
          <p className="text-white text-center mb-4">{category.description}</p>
          <div className="bg-white text-primary px-5 py-2 rounded-full text-sm font-medium">
            View Products
          </div>
        </div>
      </a>
    </Link>
  );
};

export default CategoryCard;
