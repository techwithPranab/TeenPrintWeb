import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, Loader2 } from 'lucide-react';

const OrderTracking = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Navigate to order detail page
      // In a real app, you would fetch the order by orderId and get the MongoDB _id
      // For now, we'll use the orderId as the route parameter
      navigate(`/orders/${orderId}`);
    } catch (err) {
      setError('Order not found. Please check your order ID and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Package className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4">Track Your Order</h1>
          <p className="text-xl">Enter your order ID to see real-time tracking information</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <form onSubmit={handleTrackOrder} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order ID *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => {
                    setOrderId(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g., TP-20251018-ABCD1234"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full btn-primary py-3 text-lg flex items-center justify-center gap-2"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Track Order
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Where can I find my Order ID?</strong>
            </p>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• In your order confirmation email</li>
              <li>• In the "My Orders" section of your account</li>
              <li>• In your SMS notifications</li>
            </ul>
          </div>
        </div>

        {/* Help Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
            <p className="text-gray-600 text-sm mb-4">
              If you're having trouble tracking your order or have questions about delivery, our support team is here
              to help.
            </p>
            <a
              href="/contact"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Contact Support →
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Have an Account?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Sign in to view all your orders and track them easily from your account dashboard.
            </p>
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Sign In →
            </a>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Information</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-medium mb-1">Standard Shipping</p>
              <p className="text-gray-600">5-7 business days</p>
            </div>
            <div>
              <p className="font-medium mb-1">Express Shipping</p>
              <p className="text-gray-600">2-3 business days</p>
            </div>
            <div>
              <p className="font-medium mb-1">Processing Time</p>
              <p className="text-gray-600">4-5 business days</p>
            </div>
            <div>
              <p className="font-medium mb-1">International</p>
              <p className="text-gray-600">10-15 business days</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-4">
            * Delivery times are estimates and may vary during peak seasons or holidays
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
