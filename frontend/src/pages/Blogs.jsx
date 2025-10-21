import { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, Search, Tag } from 'lucide-react';

const Blogs = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample blog data - in a real app, this would come from an API
  const blogPosts = [
    {
      id: 1,
      title: "10 Creative T-Shirt Design Ideas That Will Make You Stand Out",
      excerpt: "Discover unique and creative t-shirt design concepts that will help you create memorable custom apparel. From minimalist designs to bold graphics.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      author: "Sarah Johnson",
      date: "2025-10-15",
      category: "Design Tips",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop",
      tags: ["Design", "T-shirts", "Creativity"]
    },
    {
      id: 2,
      title: "The Ultimate Guide to Custom Mug Printing: Materials and Techniques",
      excerpt: "Learn about different mug materials, printing techniques, and design considerations for creating the perfect custom mug.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      author: "Mike Chen",
      date: "2025-10-12",
      category: "Printing Guide",
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=400&fit=crop",
      tags: ["Mugs", "Printing", "Guide"]
    },
    {
      id: 3,
      title: "Brand Merchandise: Building Your Business Identity Through Custom Products",
      excerpt: "Explore how custom merchandise can strengthen your brand identity and create lasting connections with your customers.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      author: "Emily Davis",
      date: "2025-10-10",
      category: "Business",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      tags: ["Branding", "Business", "Marketing"]
    },
    {
      id: 4,
      title: "Sustainable Printing: Eco-Friendly Options for Custom Products",
      excerpt: "Discover sustainable printing practices and eco-friendly materials that reduce environmental impact while maintaining quality.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      author: "Alex Rodriguez",
      date: "2025-10-08",
      category: "Sustainability",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop",
      tags: ["Sustainability", "Eco-friendly", "Environment"]
    },
    {
      id: 5,
      title: "Color Psychology in Custom Design: Choosing the Right Palette",
      excerpt: "Understanding how colors affect emotions and purchasing decisions can help you create more effective custom designs.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      author: "Lisa Thompson",
      date: "2025-10-05",
      category: "Design Tips",
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&h=400&fit=crop",
      tags: ["Color", "Psychology", "Design"]
    },
    {
      id: 6,
      title: "Custom Phone Cases: Protection Meets Personalization",
      excerpt: "Learn about different phone case materials, protection levels, and design possibilities for creating the perfect custom case.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      author: "David Kim",
      date: "2025-10-02",
      category: "Product Guide",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
      tags: ["Phone Cases", "Protection", "Personalization"]
    }
  ];

  const categories = ['All', 'Design Tips', 'Printing Guide', 'Business', 'Sustainability', 'Product Guide'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Our Blog
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Stay updated with the latest design trends, printing tips, and industry insights. 
            Discover how to make the most of your custom printing projects.
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.date)}
                      </div>
                    </div>
                    
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3">
                      {post.category}
                    </span>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <button className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-xl mb-8">
            Subscribe to our newsletter for the latest design tips, printing guides, and special offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
            <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blogs;
