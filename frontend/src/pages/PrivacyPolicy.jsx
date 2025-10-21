import { Shield, Eye, Lock, Database, Cookie, Mail, Phone } from 'lucide-react';

const PrivacyPolicy = () => {
  const dataTypes = [
    {
      title: "Personal Information",
      description: "Name, email address, phone number, billing and shipping addresses",
      icon: <Eye className="w-6 h-6" />
    },
    {
      title: "Account Information",
      description: "Username, password (encrypted), profile preferences, and order history",
      icon: <Lock className="w-6 h-6" />
    },
    {
      title: "Payment Data",
      description: "Payment method details processed securely through encrypted channels",
      icon: <Shield className="w-6 h-6" />
    },
    {
      title: "Usage Information",
      description: "Website interactions, design preferences, and product browsing behavior",
      icon: <Database className="w-6 h-6" />
    },
    {
      title: "Device Information",
      description: "IP address, browser type, device type, and operating system",
      icon: <Cookie className="w-6 h-6" />
    }
  ];

  const dataUse = [
    "Processing and fulfilling your custom product orders",
    "Communicating about your orders, account, and customer service",
    "Improving our products, services, and website functionality",
    "Personalizing your shopping experience and recommendations",
    "Sending promotional emails and marketing communications (with your consent)",
    "Preventing fraud and ensuring platform security",
    "Complying with legal obligations and regulatory requirements"
  ];

  const userRights = [
    {
      title: "Access Your Data",
      description: "Request a copy of all personal information we have about you"
    },
    {
      title: "Correct Information",
      description: "Update or correct any inaccurate personal information"
    },
    {
      title: "Delete Your Data",
      description: "Request deletion of your personal information (subject to legal requirements)"
    },
    {
      title: "Data Portability",
      description: "Receive your data in a structured, machine-readable format"
    },
    {
      title: "Withdraw Consent",
      description: "Opt-out of marketing communications and data processing where consent-based"
    },
    {
      title: "Object to Processing",
      description: "Object to certain types of data processing for legitimate interests"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, 
            and protect your personal information when you use TeenPrintWeb.
          </p>
          <p className="mt-4 text-blue-200">
            Last updated: October 20, 2025
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Privacy Commitment</h2>
            <p className="text-lg text-gray-600">
              At TeenPrintWeb, we are committed to protecting your privacy and ensuring the security 
              of your personal information. This Privacy Policy outlines our practices regarding the 
              collection, use, and disclosure of information when you use our service.
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
            <div className="flex items-start">
              <Shield className="w-6 h-6 text-blue-600 mt-1 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Your Trust Matters</h3>
                <p className="text-gray-700">
                  We only collect information necessary to provide you with the best custom printing 
                  experience. We never sell your personal information to third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Information We Collect */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            <p className="text-lg text-gray-600">
              We collect various types of information to provide and improve our services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dataTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-4">
                    {type.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{type.title}</h3>
                </div>
                <p className="text-gray-600">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Use Information */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <p className="text-lg text-gray-600">
              We use your information for the following purposes
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <ul className="space-y-4">
              {dataUse.map((use, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <span className="text-gray-700">{use}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Data Security */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-lg text-gray-600">
              We implement industry-standard security measures to protect your information
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Lock className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Encryption</h3>
              </div>
              <p className="text-gray-600">
                All sensitive data is encrypted using industry-standard SSL/TLS encryption 
                during transmission and secure encryption at rest.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Access Control</h3>
              </div>
              <p className="text-gray-600">
                Access to your personal information is restricted to authorized personnel 
                who need it to provide our services.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Database className="w-8 h-8 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Secure Storage</h3>
              </div>
              <p className="text-gray-600">
                Your data is stored on secure servers with regular backups and monitoring 
                for unauthorized access attempts.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Eye className="w-8 h-8 text-orange-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Regular Audits</h3>
              </div>
              <p className="text-gray-600">
                We conduct regular security audits and vulnerability assessments to ensure 
                our security measures remain effective.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>
            <p className="text-lg text-gray-600">
              You have the following rights regarding your personal information
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {userRights.map((right, index) => (
              <div key={index} className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{right.title}</h3>
                <p className="text-gray-600">{right.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Note:</strong> To exercise any of these rights, please contact our privacy team 
                  using the contact information provided below. We will respond to your request within 30 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cookies and Tracking */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-6">
              <Cookie className="w-8 h-8 text-orange-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">How We Use Cookies</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Essential Cookies</h4>
                <p className="text-gray-600">
                  These cookies are necessary for the website to function properly, including login 
                  sessions, shopping cart functionality, and security features.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h4>
                <p className="text-gray-600">
                  We use analytics cookies to understand how visitors interact with our website, 
                  helping us improve our services and user experience.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Marketing Cookies</h4>
                <p className="text-gray-600">
                  With your consent, we use marketing cookies to show you relevant advertisements 
                  and measure the effectiveness of our marketing campaigns.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-700">
                You can manage your cookie preferences through your browser settings or by using 
                our cookie consent tool when you first visit our website.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Third Party Services */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
            <p className="text-lg text-gray-600">
              We work with trusted third-party service providers to deliver our services
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Processing</h3>
              <p className="text-gray-600">
                We use secure payment processors like Razorpay to handle payment transactions. 
                Your payment information is processed directly by these services and is not 
                stored on our servers.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Shipping Partners</h3>
              <p className="text-gray-600">
                We share necessary delivery information with our shipping partners to ensure 
                your orders reach you safely and on time.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Email Services</h3>
              <p className="text-gray-600">
                We use email service providers to send you order confirmations, shipping 
                notifications, and marketing communications (with your consent).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Privacy Questions?</h2>
          <p className="text-xl mb-8">
            If you have any questions about this Privacy Policy or how we handle your data, 
            please don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6" />
              <span>privacy@teenprintweb.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-6 h-6" />
              <span>+91 9876543210</span>
            </div>
          </div>
          <p className="mt-6 text-blue-200">
            Privacy Officer available: Monday - Friday, 9:00 AM - 6:00 PM IST
          </p>
        </div>
      </section>

      {/* Updates to Policy */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-100 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Policy Updates</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our 
              practices or for other operational, legal, or regulatory reasons.
            </p>
            <p className="text-gray-700">
              When we make significant changes, we will notify you by email (if you have an account) 
              and/or by posting a notice on our website. We encourage you to review this policy 
              periodically to stay informed about how we protect your information.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
