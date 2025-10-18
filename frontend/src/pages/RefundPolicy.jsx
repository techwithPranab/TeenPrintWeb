import { RotateCcw } from 'lucide-react';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RotateCcw className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4">Refund Policy</h1>
          <p className="text-xl">Last updated: October 18, 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. General Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              At TeenPrintWeb, we strive for 100% customer satisfaction. Due to the custom nature of our products,
              we have specific guidelines for returns and refunds. Please read this policy carefully before placing
              an order.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility for Refunds</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may be eligible for a refund in the following cases:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>The product received is defective or damaged</li>
              <li>The wrong item was sent</li>
              <li>The print quality does not meet our standards</li>
              <li>The product significantly differs from what was shown in the preview</li>
              <li>The product was not delivered within the promised timeframe (after reasonable delay)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Non-Refundable Items</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The following items are not eligible for refunds:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Products with custom designs (unless defective)</li>
              <li>Items damaged due to misuse or improper care</li>
              <li>Products where the design was approved by the customer</li>
              <li>Sale or clearance items (unless defective)</li>
              <li>Gift cards or promotional products</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Timeframe for Returns</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To be eligible for a return and refund:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>You must report any issues within <strong>7 days of delivery</strong></li>
              <li>Products must be unused, unworn, and in the original packaging</li>
              <li>You must provide photographic evidence of defects or damage</li>
              <li>You must include the original order number</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. How to Request a Refund</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To request a refund, please follow these steps:
            </p>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
              <li>Contact our customer support at support@teenprintweb.com</li>
              <li>Provide your order number and details of the issue</li>
              <li>Include clear photos showing the defect or problem</li>
              <li>Wait for approval from our support team</li>
              <li>If approved, follow the return shipping instructions provided</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Refund Processing</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Once we receive and inspect your returned item:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>We will send you an email notification of receipt and inspection status</li>
              <li>If approved, your refund will be processed within <strong>5-7 business days</strong></li>
              <li>Refunds will be issued to your original payment method</li>
              <li>You will receive a confirmation email when the refund is processed</li>
              <li>It may take an additional 3-5 business days for the refund to appear in your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Partial Refunds</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              In certain situations, only partial refunds may be granted:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Items with minor defects that don't affect functionality</li>
              <li>Items returned after the 7-day return window</li>
              <li>Items not in their original condition or damaged by the customer</li>
              <li>Items missing parts not due to our error</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Exchanges</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We offer exchanges for:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Defective or damaged products</li>
              <li>Wrong size (if available)</li>
              <li>Wrong product sent</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exchange an item, follow the same process as requesting a refund and indicate that you would prefer
              an exchange.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Return Shipping Costs</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Return shipping costs are handled as follows:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Our Error:</strong> We cover all return shipping costs</li>
              <li><strong>Defective Product:</strong> We cover all return shipping costs</li>
              <li><strong>Change of Mind:</strong> Customer is responsible for return shipping</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Order Cancellation</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You can cancel your order and receive a full refund if:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>The order has not yet been processed (within 2 hours of placement)</li>
              <li>The order has not been sent to production</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Once production has started, orders cannot be cancelled. Contact us immediately if you need to cancel.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Quality Guarantee</h2>
            <p className="text-gray-700 leading-relaxed">
              We stand behind the quality of our products. If you're not satisfied with the print quality or product
              condition, we will work with you to make it right through a replacement or refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For questions about our refund policy or to initiate a return:
            </p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">Email: support@teenprintweb.com</p>
              <p className="text-gray-700">Phone: +91 98765 43210</p>
              <p className="text-gray-700">Hours: Monday-Friday, 9:00 AM - 6:00 PM IST</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
