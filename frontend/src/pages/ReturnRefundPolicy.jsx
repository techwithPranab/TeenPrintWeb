import { RotateCcw, Package, Clock, Phone, Mail, FileText } from 'lucide-react';

const ReturnRefundPolicy = () => {
  const returnReasons = [
    {
      title: "Defective Products",
      description: "Items with printing defects, material flaws, or manufacturing errors",
      timeframe: "30 days"
    },
    {
      title: "Wrong Item Received",
      description: "If you received a different product than what you ordered",
      timeframe: "30 days"
    },
    {
      title: "Damaged During Shipping",
      description: "Products damaged during transit with visible packaging damage",
      timeframe: "7 days"
    },
    {
      title: "Size Issues",
      description: "Significant size discrepancies from our size chart specifications",
      timeframe: "15 days"
    }
  ];

  const returnProcess = [
    {
      step: 1,
      title: "Contact Us",
      description: "Reach out to our customer service team within the eligible timeframe",
      icon: <Phone className="w-6 h-6" />
    },
    {
      step: 2,
      title: "Provide Details",
      description: "Share your order number, photos of the issue, and reason for return",
      icon: <FileText className="w-6 h-6" />
    },
    {
      step: 3,
      title: "Approval & Instructions",
      description: "Receive return authorization and detailed return shipping instructions",
      icon: <Package className="w-6 h-6" />
    },
    {
      step: 4,
      title: "Ship Back",
      description: "Package the item securely and ship using provided return label",
      icon: <RotateCcw className="w-6 h-6" />
    },
    {
      step: 5,
      title: "Processing",
      description: "We'll inspect the item and process your refund or replacement",
      icon: <Clock className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Return & Refund Policy
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            We stand behind the quality of our products. If you're not completely satisfied, 
            we're here to help make it right.
          </p>
        </div>
      </section>

      {/* Policy Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Commitment to You</h2>
            <p className="text-lg text-gray-600">
              At TeenPrintWeb, customer satisfaction is our priority. We offer returns and refunds 
              for eligible items to ensure you're happy with your purchase.
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Important Note:</strong> Due to the custom nature of our products, all items are made-to-order. 
                  Returns are only accepted for defective items, wrong items received, or significant quality issues.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eligible Returns */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Eligible Returns</h2>
            <p className="text-lg text-gray-600">
              We accept returns for the following reasons within the specified timeframes
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {returnReasons.map((reason, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{reason.title}</h3>
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    {reason.timeframe}
                  </span>
                </div>
                <p className="text-gray-600">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Return Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Return Process</h2>
            <p className="text-lg text-gray-600">
              Follow these simple steps to return your item
            </p>
          </div>

          <div className="space-y-8">
            {returnProcess.map((step, index) => (
              <div key={step.step} className="flex items-start gap-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full flex-shrink-0">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Step {step.step}: {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refund Information */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Refund Information</h2>
          
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Processing Time</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Refunds are processed within 5-7 business days after we receive your return</li>
                <li>• You'll receive an email confirmation once your refund is processed</li>
                <li>• The refund will appear in your original payment method within 3-10 business days</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Refund Amount</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Full product price refund for eligible returns</li>
                <li>• Original shipping costs are non-refundable (unless item was defective)</li>
                <li>• Return shipping costs are covered by us for defective or wrong items</li>
                <li>• Customer responsible for return shipping for other eligible returns</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Non-Returnable Items</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Custom products with personalized designs (unless defective)</li>
                <li>• Items returned after the eligible timeframe</li>
                <li>• Products damaged due to misuse or normal wear</li>
                <li>• Items returned without prior authorization</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Need Help with a Return?</h2>
          <p className="text-xl mb-8">
            Our customer service team is here to assist you with any questions about returns or refunds.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6" />
              <span>support@teenprintweb.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-6 h-6" />
              <span>+91 9876543210</span>
            </div>
          </div>
          <p className="mt-6 text-blue-200">
            Customer service hours: Monday - Friday, 9:00 AM - 6:00 PM IST
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-blue-400 bg-blue-50 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Can I return a custom product if I don't like the design?</h3>
              <p className="text-gray-600">
                Since all our products are made-to-order based on your specifications, we cannot accept returns 
                for design preferences. We recommend using our preview feature carefully before placing your order.
              </p>
            </div>

            <div className="border-l-4 border-blue-400 bg-blue-50 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">What if my item arrives damaged?</h3>
              <p className="text-gray-600">
                If your item arrives damaged, please contact us immediately with photos of the damage. 
                We'll arrange for a replacement or full refund at no cost to you.
              </p>
            </div>

            <div className="border-l-4 border-blue-400 bg-blue-50 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">How long do I have to report an issue?</h3>
              <p className="text-gray-600">
                Please report any issues within 30 days of delivery for most problems, or within 7 days 
                for shipping damage. Earlier reporting helps us resolve issues faster.
              </p>
            </div>

            <div className="border-l-4 border-blue-400 bg-blue-50 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer exchanges?</h3>
              <p className="text-gray-600">
                Yes! For eligible items, we can process exchanges for size or product type changes. 
                The same return policy timeframes and conditions apply to exchanges.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReturnRefundPolicy;
