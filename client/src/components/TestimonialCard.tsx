interface Testimonial {
  id: number;
  rating: number;
  text: string;
  author: {
    initial: string;
    name: string;
    status: string;
  };
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
      <div className="flex text-warning mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <i 
            key={i} 
            className={`bi ${i < testimonial.rating ? 'bi-star-fill' : 'bi-star'}`}
          ></i>
        ))}
      </div>
      <p className="text-gray-700 mb-4">{testimonial.text}</p>
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-primary font-bold">
          {testimonial.author.initial}
        </div>
        <div className="ml-3">
          <p className="font-medium">{testimonial.author.name}</p>
          <p className="text-sm text-gray-500">{testimonial.author.status}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
