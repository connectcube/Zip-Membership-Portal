import React from 'react';
import { cn } from '@/lib/utils';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 py-8 w-full text-white">
      <div className="mx-auto px-4 container">
        <div className="gap-8 grid grid-cols-1 md:grid-cols-4">
          {/* About Section */}
          <div>
            <h3 className="mb-4 font-bold text-xl">Zambia Institute of Planners</h3>
            <p className="mb-4 text-slate-300">
              Promoting excellence in planning practice and sustainable development across Zambia.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-blue-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-blue-400 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-bold text-xl">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/membership"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Membership
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-slate-300 hover:text-white transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-slate-300 hover:text-white transition-colors">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="mb-4 font-bold text-xl">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-slate-400" />
                <span className="text-slate-300">+260 773 992358</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-slate-400" />
                <a href="mailto:info@zambiainstituteofplanners.org.zm" className="text-slate-300">
                  {' '}
                  info@zambiainstituteofplanners.org.zm
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 text-slate-400" />
                <span className="text-slate-300">Plot 123, Great East Road, Lusaka, Zambia</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 font-bold text-xl">Newsletter</h3>
            <p className="mb-4 text-slate-300">
              Subscribe to our newsletter for updates on events and announcements.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-l-md focus:outline-none w-full text-slate-900"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-slate-700 border-t text-center">
          <p className="text-slate-400">
            © {currentYear} Zambia Institute of Planners. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
