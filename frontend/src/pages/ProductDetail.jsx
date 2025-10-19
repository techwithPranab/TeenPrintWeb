import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchProductBySlug, clearCurrentProduct } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import { ShoppingCart, Heart, Share2, Star, Check, Loader2, Palette } from 'lucide-react';
import ReviewsSection from '../components/reviews/ReviewsSection';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProduct: product, loading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('front');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    dispatch(fetchProductBySlug(slug));
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [slug, dispatch]);

  useEffect(() => {
    if (product) {
      // Set default selections
      if (product.specifications?.sizes?.length > 0) {
        setSelectedSize(product.specifications.sizes[0]);
      }
      if (product.specifications?.colors?.length > 0) {
        setSelectedColor(product.specifications.colors[0]);
      }
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/products/${slug}` } });
      return;
    }

    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }

    setAddingToCart(true);
    try {
      await dispatch(
        addToCart({
          productId: product._id,
          quantity,
          selectedSize,
          selectedColor,
        })
      ).unwrap();
      alert('Product added to cart!');
    } catch (error) {
      alert(error.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleCustomize = () => {
    if (!user) {
      navigate('/login', { state: { from: `/products/${slug}` } });
      return;
    }
    navigate(`/editor/${product._id}`, {
      state: { product, selectedSize, selectedColor },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-base text-red-600 mb-3">Product not found</p>
          <Link
            to="/products"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const displayPrice = product.salePrice || product.basePrice;
  const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
  const discountPercentage = hasDiscount
    ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 text-xs text-gray-500">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Product Images */}
          <div className="space-y-3">
            {/* Main Image */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={product.mockups?.[selectedImage]?.url || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {hasDiscount && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    {discountPercentage}% OFF
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2">
              {['front', 'back', 'side'].map((position) => {
                if (product.mockups?.[position]?.url) {
                  return (
                    <button
                      key={position}
                      onClick={() => setSelectedImage(position)}
                      className={`flex-1 bg-white rounded border-2 transition-all ${
                        selectedImage === position
                          ? 'border-blue-500 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="aspect-square">
                        <img
                          src={product.mockups[position].url}
                          alt={`${position} view`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs font-medium text-center py-1 capitalize text-gray-600">
                        {position}
                      </p>
                    </button>
                  );
                }
                return null;
              })}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                {product.name}
              </h1>
              {product.isFeatured && (
                <div className="flex items-center gap-1.5 text-amber-600 mb-3">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">Featured Product</span>
                </div>
              )}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl font-bold text-gray-900">₹{displayPrice}</span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      ₹{product.basePrice}
                    </span>
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded">
                      Save ₹{product.basePrice - product.salePrice}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 text-sm font-medium">In Stock</span>
                </>
              ) : (
                <span className="text-red-600 text-sm font-medium">Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Description</h3>
              <p className="text-gray-700 leading-relaxed text-sm">{product.description}</p>
            </div>

            {/* Size Selection */}
            {product.specifications?.sizes && product.specifications.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                  Size: <span className="text-blue-600 font-medium">{selectedSize}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.specifications.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.specifications?.colors && product.specifications.colors.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.specifications.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-md border-2 transition-all ${
                        selectedColor === color
                          ? 'border-blue-500 shadow-sm scale-110'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 bg-white border border-gray-200 rounded text-sm font-bold hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="text-base font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 bg-white border border-gray-200 rounded text-sm font-bold hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCustomize}
                disabled={!product.inStock}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold text-sm transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Palette className="w-4 h-4" />
                Customize This Product
              </button>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || addingToCart}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </>
                )}
              </button>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-gray-200 hover:border-red-400 text-gray-700 hover:text-red-500 py-2.5 rounded-lg text-sm font-medium transition-all">
                  <Heart className="w-4 h-4" />
                  Wishlist
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-gray-200 hover:border-blue-400 text-gray-700 hover:text-blue-500 py-2.5 rounded-lg text-sm font-medium transition-all">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Specifications */}
            {product.specifications?.material && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Specifications</h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Material:</span>
                    <span className="font-medium text-gray-900">
                      {product.specifications.material}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-gray-100 pt-8 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ReviewsSection productId={product._id} productName={product.name} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
