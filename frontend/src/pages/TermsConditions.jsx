import { Scale, Shield, User, CreditCard, Package, AlertTriangle, Mail, Phone } from 'lucide-react';

const TermsConditions = () => {
  const sections = [
    {
      title: "Account Terms",
      icon: <User className="w-6 h-6" />,
      content: [
        "You must be at least 18 years old to create an account and place orders",
        "You are responsible for maintaining the security of your account credentials",
        "You must provide accurate and complete information when registering",
        "You may not use our service for any illegal or unauthorized purpose",
        "We reserve the right to suspend or terminate accounts that violate these terms"
      ]
    },
    {
      title: "Orders & Payment",
      icon: <CreditCard className="w-6 h-6" />,
      content: [
        "All orders are subject to acceptance and availability",
        "Prices are subject to change without notice until order confirmation",
        "Payment must be completed at the time of order placement",
        "We accept major credit cards, debit cards, and digital payment methods",
        "Orders cannot be modified or cancelled once production has begun"
      ]
    },
    {
      title: "Product & Design",
      icon: <Package className="w-6 h-6" />,
      content: [
        "You retain ownership of your original designs and uploaded content",
        "You grant us permission to use your designs solely for order fulfillment",
        "You are responsible for ensuring your designs don't infringe on third-party rights",
        "We reserve the right to refuse orders containing inappropriate content",
        "Product colors may vary slightly from what appears on your screen"
      ]
    },
    {
      title: "Shipping & Delivery",
      icon: <Package className="w-6 h-6" />,
      content: [
        "Delivery timeframes are estimates and not guarantees",
        "Risk of loss transfers to you upon delivery to the shipping address",
        "You must inspect items upon delivery and report issues within 7 days",
        "Additional charges may apply for expedited shipping or remote locations",
        "We are not responsible for delays caused by customs or shipping carriers"
      ]
    }
  ];

  const restrictions = [
    "Copyrighted material without proper authorization",
    "Trademarked content without permission from the trademark owner",
    "Offensive, discriminatory, or hate speech content",
    "Violent, graphic, or disturbing imagery",
    "Content that violates any applicable laws or regulations",
    "Personal information of others without their consent",
    "Content that promotes illegal activities or substances"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Scale className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Terms & Conditions
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            These terms govern your use of TeenPrintWeb services. By using our platform, 
            you agree to be bound by these terms and conditions.
          </p>
          <p className="mt-4 text-blue-200">
            Effective Date: October 20, 2025
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Agreement Overview</h2>
            <p className="text-lg text-gray-600">
              Welcome to TeenPrintWeb! These Terms and Conditions ("Terms") constitute a legally 
              binding agreement between you and TeenPrintWeb regarding your use of our custom 
              printing services and website.
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-blue-600 mt-1 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Important Notice</h3>
                <p className="text-gray-700">
                  By accessing or using our services, you agree to comply with and be bound by these Terms. 
                  If you do not agree with any part of these terms, you must not use our services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Terms Sections */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h2>
            <p className="text-lg text-gray-600">
              Please read these terms carefully before using our services
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-4">
                    {section.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Restrictions */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Content Restrictions</h2>
            <p className="text-lg text-gray-600">
              The following types of content are strictly prohibited on our platform
            </p>
          </div>

          <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-1 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Prohibited Content</h3>
                <p className="text-gray-700 mb-4">
                  We reserve the right to refuse, cancel, or remove any content that violates these restrictions:
                </p>
                <ul className="space-y-2">
                  {restrictions.map((restriction, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{restriction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Content Review Process</h3>
            <p className="text-gray-700">
              All uploaded designs undergo automated and manual review processes. Orders containing 
              prohibited content will be cancelled, and refunds will be processed according to our 
              refund policy. Repeated violations may result in account suspension.
            </p>
          </div>
        </div>
      </section>

      {/* Intellectual Property */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Intellectual Property Rights</h2>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Rights</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <Shield className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  You retain full ownership of your original designs and creative content
                </li>
                <li className="flex items-start">
                  <Shield className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  You grant us a limited license to reproduce your designs for order fulfillment only
                </li>
                <li className="flex items-start">
                  <Shield className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  We will not use your designs for any purpose other than completing your order
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Responsibilities</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-1 mr-3 flex-shrink-0" />
                  You must own or have proper authorization for all content you upload
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-1 mr-3 flex-shrink-0" />
                  You are liable for any intellectual property infringement claims
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-1 mr-3 flex-shrink-0" />
                  You must indemnify TeenPrintWeb against any claims arising from your content
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Questions About Our Terms?</h2>
          <p className="text-xl mb-8">
            If you have any questions about these Terms & Conditions, please contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6" />
              <span>legal@teenprintweb.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-6 h-6" />
              <span>+91 9876543210</span>
            </div>
          </div>
          <p className="mt-6 text-blue-200">
            Legal Department: Monday - Friday, 9:00 AM - 6:00 PM IST
          </p>
        </div>
      </section>
    </div>
  );
};

export default TermsConditions;
