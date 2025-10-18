import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqCategories = [
    {
      category: 'Orders & Payments',
      questions: [
        {
          question: 'How do I place an order?',
          answer: 'Simply browse our products, select the item you want, customize it using our design editor, add it to your cart, and proceed to checkout. You can pay using UPI, credit/debit cards, net banking, or cash on delivery.',
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major payment methods including credit/debit cards (Visa, Mastercard, American Express), UPI, net banking, and cash on delivery (COD) for eligible orders.',
        },
        {
          question: 'Is it safe to use my credit card on your site?',
          answer: 'Yes, absolutely! We use Razorpay, a secure payment gateway that encrypts all transactions. We never store your card details on our servers.',
        },
        {
          question: 'Can I modify or cancel my order?',
          answer: 'You can modify or cancel your order within 2 hours of placing it. After that, the order goes into production and cannot be changed. Please contact our support team immediately if you need to make changes.',
        },
      ],
    },
    {
      category: 'Shipping & Delivery',
      questions: [
        {
          question: 'How long does shipping take?',
          answer: 'Standard shipping takes 5-7 business days. Express shipping (available in select cities) takes 2-3 business days. International shipping takes 10-15 business days.',
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Yes, we ship to most countries worldwide. International shipping charges and delivery times vary by location. You can check shipping costs at checkout.',
        },
        {
          question: 'How can I track my order?',
          answer: 'Once your order is shipped, you\'ll receive a tracking number via email and SMS. You can also track your order from the "My Orders" section in your account.',
        },
        {
          question: 'What if my order is damaged during shipping?',
          answer: 'We take great care in packaging, but if your order arrives damaged, please contact us within 48 hours with photos. We\'ll send a replacement at no additional cost.',
        },
      ],
    },
    {
      category: 'Products & Customization',
      questions: [
        {
          question: 'What products can I customize?',
          answer: 'You can customize a wide range of products including T-shirts, hoodies, mugs, phone cases, posters, tote bags, cushions, and more. New products are added regularly!',
        },
        {
          question: 'What file formats do you accept for custom designs?',
          answer: 'We accept PNG, JPG, SVG, and PDF files. For best results, use high-resolution images (at least 300 DPI). Our design editor also has built-in tools to create designs from scratch.',
        },
        {
          question: 'Can I see a preview before ordering?',
          answer: 'Yes! Our design editor shows you a real-time preview of how your design will look on the product. You can view it from different angles before placing your order.',
        },
        {
          question: 'What is the quality of the printing?',
          answer: 'We use premium DTG (Direct-to-Garment) and sublimation printing techniques to ensure vibrant colors and long-lasting prints that won\'t fade or crack.',
        },
      ],
    },
    {
      category: 'Returns & Refunds',
      questions: [
        {
          question: 'What is your return policy?',
          answer: 'We accept returns within 7 days of delivery for manufacturing defects or wrong items. Custom-designed products cannot be returned unless there\'s a quality issue.',
        },
        {
          question: 'How do I request a refund?',
          answer: 'Contact our support team with your order number and reason for refund. If approved, refunds are processed within 5-7 business days to your original payment method.',
        },
        {
          question: 'What if I receive the wrong item?',
          answer: 'If you receive the wrong item, please contact us immediately with photos. We\'ll arrange for a replacement to be sent to you at no extra cost and arrange pickup of the wrong item.',
        },
      ],
    },
    {
      category: 'Account & Support',
      questions: [
        {
          question: 'Do I need an account to place an order?',
          answer: 'Yes, you need to create an account to place orders. This allows you to track orders, save designs, and manage your addresses easily.',
        },
        {
          question: 'How do I reset my password?',
          answer: 'Click on "Forgot Password" on the login page, enter your email address, and you\'ll receive a password reset link within minutes.',
        },
        {
          question: 'How can I contact customer support?',
          answer: 'You can reach us via email at support@teenprintweb.com, call us at +91 98765 43210, or use the contact form on our Contact Us page. We typically respond within 24 hours.',
        },
        {
          question: 'Do you offer bulk order discounts?',
          answer: 'Yes! We offer special discounts for bulk orders (50+ items). Please contact our sales team at orders@teenprintweb.com for a custom quote.',
        },
      ],
    },
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl">Find answers to common questions about our products and services</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {faqCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.category}</h2>
            <div className="space-y-4">
              {category.questions.map((faq, questionIndex) => {
                const index = `${categoryIndex}-${questionIndex}`;
                const isOpen = openIndex === index;
                return (
                  <div
                    key={questionIndex}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <button
                      onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Contact Support */}
        <div className="mt-16 bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h3>
          <p className="text-gray-700 mb-6">
            Can't find the answer you're looking for? Our support team is here to help!
          </p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
