import React from "react";

const FeatureSection = () => {
  const features = [
    {
      icon: "bi-truck",
      title: "Free Shipping",
      description: "On all orders over $50"
    },
    {
      icon: "bi-shield-check",
      title: "Secure Payment",
      description: "100% secure payment"
    },
    {
      icon: "bi-arrow-return-left",
      title: "Easy Returns",
      description: "14 day return policy"
    }
  ];

  return (
    <section className="bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-3xl text-primary mb-3">
                <i className={`bi ${feature.icon}`}></i>
              </div>
              <h3 className="font-poppins font-medium text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
