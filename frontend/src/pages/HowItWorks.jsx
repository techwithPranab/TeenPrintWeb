import { CheckCircle, Upload, Palette, Truck, Star, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      step: 1,
      title: "Choose Your Product",
      description: "Browse our wide selection of customizable products including t-shirts, mugs, phone cases, hoodies, and more. Find the perfect item for your design.",
      icon: <Star className="w-8 h-8" />,
      features: ["Wide product selection", "High-quality materials", "Various sizes available"]
    },
    {
      step: 2,
      title: "Upload & Design",
      description: "Use our intuitive design editor to upload your images, add text, apply effects, and create your perfect design. No design experience needed!",
      icon: <Palette className="w-8 h-8" />,
      features: ["Easy-to-use editor", "Text and image tools", "Live preview"]
    },
    {
      step: 3,
      title: "Review & Order",
      description: "Preview your design, select quantity and size, then place your order. We'll handle the printing and quality checks for you.",
      icon: <CheckCircle className="w-8 h-8" />,
      features: ["Real-time preview", "Quality guarantee", "Secure checkout"]
    },
    {
      step: 4,
      title: "Fast Delivery",
      description: "Your custom products are printed with care and delivered to your doorstep. Track your order every step of the way.",
      icon: <Truck className="w-8 h-8" />,
      features: ["Order tracking", "Fast shipping", "Secure packaging"]
    }
  ];

  const features = [
    {
      title: "Professional Quality",
      description: "We use state-of-the-art printing technology and premium materials to ensure your designs look amazing.",
      icon: <Star className="w-6 h-6" />
    },
    {
      title: "Easy Design Tools",
      description: "Our user-friendly design editor makes it simple to create professional-looking products in minutes.",
      icon: <Palette className="w-6 h-6" />
    },
    {
      title: "Quick Turnaround",
      description: "Most orders are processed within 24-48 hours and shipped with reliable delivery partners.",
      icon: <Truck className="w-6 h-6" />
    },
    {
      title: "Customer Support",
      description: "Our dedicated support team is here to help you every step of the way, from design to delivery.",
      icon: <CheckCircle className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            How It Works
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Creating your custom products has never been easier. Follow our simple 4-step process 
            to bring your ideas to life in just minutes.
          </p>
          <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors">
            Start Creating Now
          </button>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple Steps to Your Perfect Product
            </h2>
            <p className="text-lg text-gray-600">
              From concept to delivery in four easy steps
            </p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={step.step} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full mr-4">
                      <span className="text-xl font-bold">{step.step}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 text-lg mb-6">{step.description}</p>
                  <ul className="space-y-2">
                    {step.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1">
                  <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 text-blue-600 rounded-full mb-6">
                      {step.icon}
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Step {step.step}</h4>
                    <div className="text-gray-600">
                      Visual representation of {step.title.toLowerCase()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose TeenPrintWeb?
            </h2>
            <p className="text-lg text-gray-600">
              We're committed to providing the best custom printing experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Create Your Custom Product?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of satisfied customers and start designing today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors">
              Browse Products
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white hover:bg-white/10 px-8 py-3 rounded-lg font-semibold transition-colors">
              View Gallery
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
