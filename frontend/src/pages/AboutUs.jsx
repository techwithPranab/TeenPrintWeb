import { Target, Users, Award, Heart, Zap, Shield } from 'lucide-react';

const AboutUs = () => {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To empower creativity by making custom printing accessible, affordable, and enjoyable for everyone.',
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'We put our customers at the heart of everything we do, ensuring exceptional service and quality.',
    },
    {
      icon: Award,
      title: 'Quality Excellence',
      description: 'We use premium materials and cutting-edge printing technology to deliver products you\'ll love.',
    },
    {
      icon: Heart,
      title: 'Passion Driven',
      description: 'Our team is passionate about helping you bring your creative ideas to life.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We continuously improve our platform and services to provide the best experience.',
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Your data and transactions are protected with industry-leading security measures.',
    },
  ];

  const team = [
    {
      name: 'Priyanka Sharma',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    },
    {
      name: 'Rahul Verma',
      role: 'Chief Technology Officer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    },
    {
      name: 'Anjali Patel',
      role: 'Head of Design',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    },
    {
      name: 'Vikram Singh',
      role: 'Operations Manager',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Happy Customers' },
    { value: '200K+', label: 'Products Delivered' },
    { value: '100+', label: 'Design Templates' },
    { value: '4.8/5', label: 'Average Rating' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">About TeenPrintWeb</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make custom printing simple, affordable, and accessible to everyone.
            From personalized gifts to branded merchandise, we help you bring your ideas to life.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
              <p className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</p>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                TeenPrintWeb was founded in 2020 with a simple vision: to make custom printing accessible
                to everyone. What started as a small operation in a garage has grown into one of India's
                leading online printing platforms.
              </p>
              <p>
                We noticed that traditional printing services were often expensive, time-consuming, and
                complicated. So we set out to create a platform that would change that. Today, we serve
                thousands of customers across India, from individuals creating personalized gifts to
                businesses ordering branded merchandise.
              </p>
              <p>
                Our state-of-the-art printing facility uses the latest technology to ensure every product
                meets our high standards. But what really sets us apart is our commitment to customer
                satisfaction and our passion for helping people express their creativity.
              </p>
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop"
              alt="Our team at work"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="text-center">
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join thousands of happy customers and bring your ideas to life today.</p>
          <a href="/products" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Designing
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
