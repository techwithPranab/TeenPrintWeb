import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
  applyCoupon,
  removeCoupon,
  clearSuccessMessage,
  clearError,
} from '../features/cart/cartSlice';
import { Trash2, Plus, Minus, Tag, X, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading, error, successMessage } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    dispatch(fetchCart());
  }, [isAuthenticated, navigate, dispatch]);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 3000);
    }
  }, [successMessage, dispatch]);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await dispatch(updateCartItem({ itemId, quantity: newQuantity })).unwrap();
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('Remove this item from cart?')) {
      try {
        await dispatch(removeFromCart(itemId)).unwrap();
      } catch (err) {
        console.error('Failed to remove item:', err);
      }
    }
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    
    setApplyingCoupon(true);
    try {
      await dispatch(applyCoupon(couponCode)).unwrap();
      setCouponCode('');
    } catch (err) {
      console.error('Failed to apply coupon:', err);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await dispatch(removeCoupon()).unwrap();
    } catch (err) {
      console.error('Failed to remove coupon:', err);
    }
  };

  if (loading && !cart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {isEmpty ? 'Your cart is empty' : `${cart.items.length} items in your cart`}
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{successMessage}</span>
            <button onClick={() => dispatch(clearSuccessMessage())}>
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
            <button onClick={() => dispatch(clearError())}>
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {isEmpty ? (
          /* Empty Cart */
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start adding products to your cart!</p>
            <Link
              to="/products"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-md p-6 flex gap-6"
                >
                  {/* Product Image */}
                  <Link
                    to={`/products/${item.product.slug}`}
                    className="flex-shrink-0"
                  >
                    <img
                      src={item.product.mockups?.front?.url || '/placeholder-product.jpg'}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <Link
                      to={`/products/${item.product.slug}`}
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                    >
                      {item.product.name}
                    </Link>

                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      {item.size && <p>Size: {item.size}</p>}
                      {item.color && (
                        <div className="flex items-center gap-2">
                          <span>Color:</span>
                          <div
                            className="w-5 h-5 rounded border border-gray-300"
                            style={{ backgroundColor: item.color }}
                          />
                        </div>
                      )}
                      {item.design && (
                        <Link
                          to={`/designs/${item.design._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          Custom Design
                        </Link>
                      )}
                    </div>

                    {/* Price */}
                    <p className="mt-3 text-xl font-bold text-gray-900">
                      ₹{item.price * item.quantity}
                      <span className="text-sm text-gray-500 font-normal ml-2">
                        (₹{item.price} × {item.quantity})
                      </span>
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-4">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors"
                        disabled={loading}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                        disabled={loading}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                {/* Coupon */}
                <div className="mb-6">
                  {cart.coupon ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Tag className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-900">
                            Coupon Applied: {cart.coupon.code}
                          </p>
                          <p className="text-xs text-green-700">
                            {cart.coupon.discountType === 'percentage'
                              ? `${cart.coupon.discountValue}% off`
                              : `₹${cart.coupon.discountValue} off`}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Coupon Code"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        disabled={applyingCoupon || !couponCode.trim()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {applyingCoupon ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Apply'}
                      </button>
                    </form>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>₹{cart.itemsTotal.toFixed(2)}</span>
                  </div>
                  {cart.discount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Discount</span>
                      <span>-₹{cart.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-700">
                    <span>Tax</span>
                    <span>₹{cart.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span>{cart.shippingCharges === 0 ? 'FREE' : `₹${cart.shippingCharges.toFixed(2)}`}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                  <span>Total</span>
                  <span>₹{cart.total.toFixed(2)}</span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/products"
                  className="block text-center text-blue-600 hover:text-blue-700 font-medium mt-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
