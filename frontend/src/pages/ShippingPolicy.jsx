import { Truck } from 'lucide-react';

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Truck className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4">Shipping Policy</h1>
          <p className="text-xl">Last updated: October 18, 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Overview</h2>
            <p className="text-gray-700 leading-relaxed">
              At TeenPrintWeb, we strive to deliver your custom products as quickly and efficiently as possible.
              This Shipping Policy outlines our shipping methods, timeframes, costs, and terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Processing Time</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All orders go through the following stages:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Order Verification:</strong> 1-2 hours</li>
              <li><strong>Design Review:</strong> 2-4 hours (for custom designs)</li>
              <li><strong>Production:</strong> 2-3 business days</li>
              <li><strong>Quality Check:</strong> 1 business day</li>
              <li><strong>Packaging & Dispatch:</strong> 1 business day</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Total processing time: <strong>4-5 business days</strong> before shipment
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Shipping Methods & Timeframes</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Standard Shipping</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Delivery Time: 5-7 business days</li>
                  <li>Cost: ₹50 (Free for orders above ₹999)</li>
                  <li>Available: All India</li>
                  <li>Tracking: Provided</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-600 pl-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Express Shipping</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Delivery Time: 2-3 business days</li>
                  <li>Cost: ₹150</li>
                  <li>Available: Major cities only</li>
                  <li>Tracking: Real-time tracking</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-600 pl-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">International Shipping</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Delivery Time: 10-15 business days</li>
                  <li>Cost: Calculated at checkout based on destination</li>
                  <li>Available: Select countries</li>
                  <li>Customs: Customer responsible for customs duties</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Shipping Charges</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Standard</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Express</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-gray-700">Below ₹999</td>
                    <td className="px-6 py-4 text-gray-700">₹50</td>
                    <td className="px-6 py-4 text-gray-700">₹150</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-700">₹999 and above</td>
                    <td className="px-6 py-4 text-green-600 font-semibold">FREE</td>
                    <td className="px-6 py-4 text-gray-700">₹100</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-700">₹2,999 and above</td>
                    <td className="px-6 py-4 text-green-600 font-semibold">FREE</td>
                    <td className="px-6 py-4 text-green-600 font-semibold">FREE</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Order Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Track your order easily:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>You will receive a tracking number via email and SMS once your order is shipped</li>
              <li>Track your order anytime from the "My Orders" section in your account</li>
              <li>Real-time updates on order status (Processing, Shipped, Out for Delivery, Delivered)</li>
              <li>Email notifications at each stage of delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Delivery Areas</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Serviceable Areas</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We currently deliver to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li>All major cities and towns across India</li>
              <li>Select Tier 2 and Tier 3 cities</li>
              <li>Remote areas (with extended delivery time)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Non-Serviceable Areas</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Unfortunately, we cannot deliver to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>P.O. Box addresses</li>
              <li>Military addresses (APO/FPO)</li>
              <li>Some remote hill stations and islands</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              You can check if your area is serviceable by entering your pincode at checkout.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Delivery Issues</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Failed Delivery Attempts</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              If delivery cannot be completed:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li>Our courier partner will make 3 delivery attempts</li>
              <li>You will be notified via SMS/email before each attempt</li>
              <li>If all attempts fail, the order will be returned to us</li>
              <li>You can reschedule delivery by contacting the courier</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Lost or Damaged Packages</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              If your package is lost or damaged:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Contact us immediately at support@teenprintweb.com</li>
              <li>Provide your order number and details</li>
              <li>We will investigate with the courier partner</li>
              <li>A replacement or refund will be issued if confirmed</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Bulk Orders</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For bulk orders (50+ items):
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Extended processing time may apply (7-10 business days)</li>
              <li>Special shipping rates available</li>
              <li>Dedicated account manager assigned</li>
              <li>White-glove delivery service for very large orders</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Contact our bulk orders team at orders@teenprintweb.com for assistance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Shipping</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For international orders:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Delivery time: 10-15 business days (varies by country)</li>
              <li>Customs duties and taxes are the customer's responsibility</li>
              <li>Delays may occur due to customs clearance</li>
              <li>Some countries may have restrictions on certain products</li>
              <li>Shipping costs calculated based on weight and destination</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Address Changes</h2>
            <p className="text-gray-700 leading-relaxed">
              To change your shipping address:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-4">
              <li>Contact us within 2 hours of placing the order</li>
              <li>Once the order is dispatched, address cannot be changed</li>
              <li>Ensure your shipping address is complete and accurate</li>
              <li>Include apartment/building number, landmark, and pincode</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Holidays and Peak Seasons</h2>
            <p className="text-gray-700 leading-relaxed">
              During holidays, festivals, and peak seasons (Diwali, Christmas, etc.), delivery may take longer than
              usual. We recommend placing orders well in advance during these periods. You will be notified of any
              potential delays.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For shipping-related queries:
            </p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">Email: shipping@teenprintweb.com</p>
              <p className="text-gray-700">Phone: +91 98765 43210</p>
              <p className="text-gray-700">Hours: Monday-Friday, 9:00 AM - 6:00 PM IST</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
