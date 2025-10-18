import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
  const discountPercentage = hasDiscount
    ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
    : 0;

  const displayPrice = product.salePrice || product.basePrice;
  const mockupImage = product.mockups?.front?.url || '/placeholder-product.jpg';

  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Image Container */}
      <Link to={`/products/${product.slug}`} className="block relative overflow-hidden">
        <div className="aspect-square relative bg-gray-100">
          <img
            src={mockupImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {hasDiscount && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {discountPercentage}% OFF
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Featured
              </span>
            )}
            {!product.inStock && (
              <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-50"
            aria-label="Add to wishlist"
          >
            <Heart className="w-5 h-5 text-gray-700 hover:text-red-500 transition-colors" />
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/products/${product.slug}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-gray-900">₹{displayPrice}</span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">₹{product.basePrice}</span>
          )}
        </div>

        {/* Sizes/Colors Preview */}
        <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
          {product.specifications?.sizes && (
            <div className="flex items-center gap-1">
              <span className="font-medium">Sizes:</span>
              <span>{product.specifications.sizes.slice(0, 3).join(', ')}</span>
              {product.specifications.sizes.length > 3 && <span>+</span>}
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link
          to={`/products/${product.slug}`}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-colors ${
            product.inStock
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>{product.inStock ? 'Customize Now' : 'Out of Stock'}</span>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
