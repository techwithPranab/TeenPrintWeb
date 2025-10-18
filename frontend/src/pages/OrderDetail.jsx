import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getOrderById, cancelOrder, downloadInvoice } from '../features/orders/orderSlice';
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  MapPin,
  CreditCard,
  Download,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentOrder, loading } = useSelector((state) => state.orders);
  const showSuccess = searchParams.get('success') === 'true';

  useEffect(() => {
    dispatch(getOrderById(id));
  }, [dispatch, id]);

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await dispatch(cancelOrder(id)).unwrap();
        alert('Order cancelled successfully');
      } catch (error) {
        alert(error.message || 'Failed to cancel order');
      }
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      await dispatch(downloadInvoice(id)).unwrap();
    } catch (error) {
      alert(error.message || 'Failed to download invoice');
    }
  };

  const statusConfig = {
    pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' },
    processing: { icon: Package, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Processing' },
    shipped: { icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Shipped' },
    delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Delivered' },
    cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelled' },
  };

  const trackingSteps = [
    { key: 'pending', label: 'Order Placed', icon: CheckCircle2 },
    { key: 'processing', label: 'Processing', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];

  const getStatusIndex = (status) => {
    const statusMap = { pending: 0, processing: 1, shipped: 2, delivered: 3, cancelled: -1 };
    return statusMap[status] || 0;
  };

  if (loading || !currentOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  const order = currentOrder;
  const statusIndex = getStatusIndex(order.status);
  const canCancel = ['pending', 'processing'].includes(order.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </button>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900 mb-1">Order Placed Successfully!</h3>
              <p className="text-green-700 text-sm">
                Your order has been confirmed. You will receive an email confirmation shortly.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Details</h1>
              <p className="text-gray-600">
                Order ID: <span className="font-semibold text-gray-900">{order.orderId}</span>
              </p>
              <p className="text-sm text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="flex gap-3">
              {order.paymentStatus === 'paid' && (
                <button
                  onClick={handleDownloadInvoice}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Invoice
                </button>
              )}
              {canCancel && (
                <button
                  onClick={handleCancelOrder}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Tracking */}
            {order.status !== 'cancelled' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Tracking</h2>
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                    <div
                      className="h-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${(statusIndex / (trackingSteps.length - 1)) * 100}%` }}
                    />
                  </div>

                  {/* Steps */}
                  <div className="relative flex justify-between">
                    {trackingSteps.map((step, index) => {
                      const Icon = step.icon;
                      const isCompleted = index <= statusIndex;
                      const isCurrent = index === statusIndex;
                      return (
                        <div key={step.key} className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                              isCompleted
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-white border-gray-300 text-gray-400'
                            } ${isCurrent ? 'ring-4 ring-blue-200' : ''}`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <p
                            className={`mt-2 text-sm font-medium text-center ${
                              isCompleted ? 'text-gray-900' : 'text-gray-500'
                            }`}
                          >
                            {step.label}
                          </p>
                          {order.statusHistory?.find((h) => h.status === step.key) && (
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(
                                order.statusHistory.find((h) => h.status === step.key).date
                              ).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Estimated Delivery */}
                {order.estimatedDeliveryDate && order.status !== 'delivered' && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      Estimated Delivery:{' '}
                      <span className="font-semibold text-blue-700">
                        {new Date(order.estimatedDeliveryDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </p>
                  </div>
                )}

                {/* Tracking Number */}
                {order.trackingNumber && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      Tracking Number:{' '}
                      <span className="font-semibold text-gray-900">{order.trackingNumber}</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                    <img
                      src={item.product?.mockups?.front?.url || '/placeholder-product.jpg'}
                      alt={item.product?.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-900">{item.product?.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Size: {item.selectedSize || 'N/A'}
                        {item.selectedColor && ` • Color: ${item.selectedColor}`}
                      </p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      {item.design && (
                        <p className="text-sm text-blue-600 mt-1">Custom Design Applied</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{item.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">per item</p>
                      <p className="font-bold text-gray-900 mt-2">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{order.itemsTotal?.toFixed(2) || '0.00'}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span>
                    <span>-₹{order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>₹{order.taxAmount?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>₹{order.shippingCharges?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
              </div>
              <div className="text-gray-700 space-y-1">
                <p className="font-semibold">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.address}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                  {order.shippingAddress?.pincode}
                </p>
                <p>{order.shippingAddress?.country || 'India'}</p>
                <p className="pt-2">Phone: {order.shippingAddress?.phone}</p>
                <p>Email: {order.shippingAddress?.email}</p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`font-medium ${
                      order.paymentStatus === 'paid'
                        ? 'text-green-600'
                        : order.paymentStatus === 'pending'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </div>
                {order.razorpayPaymentId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment ID</span>
                    <span className="font-mono text-gray-900">{order.razorpayPaymentId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
