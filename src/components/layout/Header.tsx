import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Menu, X } from 'lucide-react';

// Define interface for AuthModal props to ensure type safety
interface AuthModalProps {
  activeTab?: 'login' | 'register';
  onClose?: () => void;
}

// Create a placeholder AuthModal component until the real one is implemented
const AuthModal: React.FC<AuthModalProps> = ({ activeTab = 'login', onClose = () => {} }) => {
  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="mb-4 font-bold text-xl">{activeTab === 'login' ? 'Login' : 'Register'}</h2>
      <div className="flex justify-end">
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="top-0 z-50 sticky bg-gradient-to-r from-blue-300 to-blue-800 shadow-lg border-b border-blue-900 w-full">
      <div className="flex justify-between items-center mx-auto px-4 h-20 container">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="ZIP Logo" className="rounded-full size-16" />
          <span className="font-bold text-white text-xl">Zambia Institute of Planners</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-white">
          <Link to="/" className="font-medium hover:text-primary text-lg">
            Home
          </Link>
          <Link to="https://zambiainstituteofplanners.org.zm/about" className="font-medium hover:text-primary text-lg">
            About
          </Link>
          <Link to="https://zambiainstituteofplanners.org.zm/membership" className="font-medium hover:text-primary text-lg">
            Membership
          </Link>
          <Link to="https://zambiainstituteofplanners.org.zm/contact" className="font-medium hover:text-primary text-lg">
            Contact
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="outline"
            className="hover:bg-primary border-primary text-primary hover:text-white"
            onClick={() => setIsAuthModalOpen(true)}
          >
            Login
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={() => setIsAuthModalOpen(true)}
          >
            Register
          </Button>
        </div>

        {/* Auth Modal */}
        <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
          <DialogContent>
            <AuthModal activeTab="login" onClose={() => setIsAuthModalOpen(false)} />
          </DialogContent>
        </Dialog>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden hover:bg-gray-100 p-2 rounded-md"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden absolute bg-white shadow-md border-gray-200 border-b w-full transition-all duration-300 ease-in-out',
          isMenuOpen ? 'max-h-screen py-4' : 'max-h-0 overflow-hidden py-0'
        )}
      >
        <div className="space-y-4 mx-auto px-4 container">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="font-medium hover:text-primary text-sm">
              Home
            </Link>
            <Link to="/about" className="font-medium hover:text-primary text-sm">
              About
            </Link>
            <Link to="/membership" className="font-medium hover:text-primary text-sm">
              Membership
            </Link>
            <Link to="/events" className="font-medium hover:text-primary text-sm">
              Events
            </Link>
            <Link to="/resources" className="font-medium hover:text-primary text-sm">
              Resources
            </Link>
            <Link to="/contact" className="font-medium hover:text-primary text-sm">
              Contact
            </Link>
          </nav>

          <div className="flex flex-col space-y-3 pt-4 border-gray-100 border-t">
            <Button
              variant="outline"
              className="hover:bg-primary border-primary w-full text-primary hover:text-white"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Login
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 w-full text-white"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
