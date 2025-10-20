import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Palette, Shirt, Coffee, Gift, ArrowRight, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { fetchFeaturedProducts } from '../features/products/productSlice';
import { fetchCategories } from '../features/categories/categorySlice';
import ProductCard from '../components/products/ProductCard';

const Home = () => {
  const dispatch = useDispatch();
  const { featuredProducts, loading: productsLoading } = useSelector((state) => state.products);
  const { categories, loading: categoriesLoading } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Customer reviews data
  const customerReviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      review: "Absolutely love my custom t-shirt! The design tool was so easy to use and the quality is amazing. Fast shipping too!",
      avatar: "SJ"
    },
    {
      id: 2,
      name: "Mike Chen",
      rating: 5,
      review: "Great experience from start to finish. The mug I designed for my wife came out perfect. Will definitely order again!",
      avatar: "MC"
    },
    {
      id: 3,
      name: "Emily Davis",
      rating: 5,
      review: "The phone case I customized looks even better in person. The colors are vibrant and the print quality is top-notch.",
      avatar: "ED"
    },
    {
      id: 4,
      name: "Alex Rodriguez",
      rating: 5,
      review: "Super impressed with the design editor. It's intuitive and has all the features I need. My hoodie turned out fantastic!",
      avatar: "AR"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      rating: 5,
      review: "Customer service is excellent and the products are high quality. My tote bag design exceeded my expectations!",
      avatar: "LT"
    },
    {
      id: 6,
      name: "David Kim",
      rating: 5,
      review: "Love how easy it is to create personalized gifts. The pillow I made for my mom was a hit. Highly recommend!",
      avatar: "DK"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Design Your Dream Products
              </h1>
              <p className="text-lg sm:text-xl text-blue-100">
                Create personalized t-shirts, mugs, photo gifts, and more. Our easy-to-use design
                tool brings your imagination to life!
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
                >
                  Start Designing
                  <Palette className="w-5 h-5" />
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-transparent border-2 border-white hover:bg-white/10 px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Browse Products
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Right Content - Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Palette className="w-10 h-10 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Easy Design</h3>
                <p className="text-sm text-blue-100">
                  User-friendly design editor with templates
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Star className="w-10 h-10 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Quality Print</h3>
                <p className="text-sm text-blue-100">High-quality printing on premium materials</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Gift className="w-10 h-10 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
                <p className="text-sm text-blue-100">Quick processing and reliable shipping</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Coffee className="w-10 h-10 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Great Prices</h3>
                <p className="text-sm text-blue-100">Affordable pricing with no hidden costs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600">
              Choose from our wide range of customizable products
            </p>
          </div>

          {categoriesLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/products?category=${category._id}`}
                  className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
                >
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                    {category.icon || <Shirt />}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-gray-600">
                Popular items customized by our community
              </p>
            </div>
            <Link
              to="/products?featured=true"
              className="hidden md:inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {productsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 8).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="mt-8 text-center md:hidden">
                <Link
                  to="/products?featured=true"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  View All Featured Products
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Create your custom product in 3 easy steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Choose Product</h3>
              <p className="text-gray-600">
                Select from t-shirts, mugs, phone cases, and more
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Design It</h3>
              <p className="text-gray-600">
                Use our editor to add text, images, and graphics
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Order & Receive</h3>
              <p className="text-gray-600">
                Place your order and we'll deliver to your doorstep
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of satisfied customers who love creating with us
            </p>
          </div>

          <div className="relative">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              centeredSlides={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  centeredSlides: false,
                },
                1024: {
                  slidesPerView: 3,
                  centeredSlides: false,
                },
              }}
              className="pb-12"
            >
              {customerReviews.map((review) => (
                <SwiperSlide key={review.id}>
                  <div className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-lg mr-4">
                        {review.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.name}</h4>
                        <div className="flex items-center">
                          {Array.from({ length: review.rating }, (_, i) => (
                            <Star key={`${review.id}-star-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">"{review.review}"</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Create Something Amazing?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of happy customers who have designed their perfect products
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
          >
            Start Designing Now
            <Palette className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
