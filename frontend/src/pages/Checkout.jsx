import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createOrder, verifyPayment } from '../features/orders/orderSlice';
import { fetchCart } from '../features/cart/cartSlice';
import { MapPin, CreditCard, Wallet, Loader2, CheckCircle } from 'lucide-react';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { loading } = useSelector((state) => state.orders);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    if (!cart || cart.items.length === 0) {
      navigate('/cart');
      return;
    }
    dispatch(fetchCart());
  }, [isAuthenticated, cart, navigate, dispatch]);

  const validationSchema = Yup.object({
    fullName: Yup.string().required('Full name is required'),
    phone: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    pincode: Yup.string()
      .matches(/^\d{6}$/, 'Pincode must be 6 digits')
      .required('Pincode is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const orderData = {
        shippingAddress: values,
        paymentMethod,
      };

      const result = await dispatch(createOrder(orderData)).unwrap();

      if (paymentMethod === 'razorpay') {
        // Initialize Razorpay
        const options = {
          key: result.razorpayKey,
          amount: cart.total * 100, // Amount in paise
          currency: 'INR',
          name: 'TeenPrintWeb',
          description: 'Order Payment',
          order_id: result.razorpayOrderId,
          handler: async (response) => {
            try {
              await dispatch(
                verifyPayment({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                })
              ).unwrap();
              navigate(`/orders/${result.order._id}?success=true`);
            } catch (err) {
              alert('Payment verification failed. Please contact support.');
            }
          },
          prefill: {
            name: values.fullName,
            email: values.email,
            contact: values.phone,
          },
          theme: {
            color: '#2563eb',
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        // COD - Navigate directly to order page
        navigate(`/orders/${result.order._id}?success=true`);
      }
    } catch (error) {
      alert(error.message || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  const defaultAddress = user?.addresses?.[0] || {};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <Formik
              initialValues={{
                fullName: defaultAddress.fullName || `${user?.firstName} ${user?.lastName}`,
                phone: defaultAddress.phone || user?.phone || '',
                email: defaultAddress.email || user?.email || '',
                address: defaultAddress.address || '',
                city: defaultAddress.city || '',
                state: defaultAddress.state || '',
                pincode: defaultAddress.pincode || '',
                country: 'India',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  {/* Shipping Address */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <MapPin className="w-6 h-6 text-blue-600" />
                      <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <Field
                          name="fullName"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <ErrorMessage
                          name="fullName"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone *
                        </label>
                        <Field
                          name="phone"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <Field
                          name="email"
                          type="email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <Field
                          name="address"
                          as="textarea"
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <ErrorMessage
                          name="address"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <Field
                          name="city"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <ErrorMessage
                          name="city"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <Field
                          name="state"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <ErrorMessage
                          name="state"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pincode *
                        </label>
                        <Field
                          name="pincode"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <ErrorMessage
                          name="pincode"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <Field
                          name="country"
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                      <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="razorpay"
                          checked={paymentMethod === 'razorpay'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mt-1"
                        />
                        <div className="flex-grow">
                          <div className="flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold">Online Payment (Razorpay)</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Pay securely using Credit/Debit Card, UPI, Net Banking
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mt-1"
                        />
                        <div className="flex-grow">
                          <div className="flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-green-600" />
                            <span className="font-semibold">Cash on Delivery</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Pay when you receive your order
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting || loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Place Order
                      </>
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <img
                      src={item.product.mockups?.front?.url || '/placeholder-product.jpg'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {item.selectedSize} • Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pb-6 border-t border-b border-gray-200 py-6">
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
                  <span>
                    {cart.shippingCharges === 0 ? 'FREE' : `₹${cart.shippingCharges.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between text-2xl font-bold text-gray-900 mt-6">
                <span>Total</span>
                <span>₹{cart.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
