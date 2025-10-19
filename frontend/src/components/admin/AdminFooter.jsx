import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, Github, Twitter, Linkedin, Heart } from 'lucide-react';

const AdminFooter = () => {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">TeenPrint Admin</h3>
                <p className="text-sm text-gray-400">Management Portal</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4 max-w-md">
              Comprehensive administration panel for managing your custom printing business.
              Monitor sales, manage products, handle orders, and analyze performance.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/techwithPranab"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/techwithPranab"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/techwithPranab"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/admin" className="text-gray-400 hover:text-white transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/products" className="text-gray-400 hover:text-white transition">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/admin/orders" className="text-gray-400 hover:text-white transition">
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/admin/users" className="text-gray-400 hover:text-white transition">
                  Users
                </Link>
              </li>
              <li>
                <Link to="/admin/coupons" className="text-gray-400 hover:text-white transition">
                  Coupons
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <a
                  href="mailto:admin@teenprint.com"
                  className="text-gray-400 hover:text-white transition"
                >
                  admin@teenprint.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">
                  Main Website
                </Link>
              </li>
              <li>
                <a
                  href="/api-docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                >
                  API Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} TeenPrint Admin. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center gap-1 mt-2 sm:mt-0">
            Made with <Heart className="w-4 h-4 text-red-500" /> for administrators
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
