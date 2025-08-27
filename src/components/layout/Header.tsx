import React, { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Menu, X } from "lucide-react";

// Define interface for AuthModal props to ensure type safety
interface AuthModalProps {
  activeTab?: "login" | "register";
  onClose?: () => void;
}

// Create a placeholder AuthModal component until the real one is implemented
const AuthModal: React.FC<AuthModalProps> = ({
  activeTab = "login",
  onClose = () => {},
}) => {
  return (
    <div className="p-6 bg-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">
        {activeTab === "login" ? "Login" : "Register"}
      </h2>
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
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container flex items-center justify-between h-20 px-4 mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=120&q=80"
            alt="ZIP Logo"
            className="w-10 h-10 rounded-full"
          />
          <span className="text-xl font-bold text-primary">
            Zambia Institute of Planners
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary">
            About
          </Link>
          <Link
            to="/membership"
            className="text-sm font-medium hover:text-primary"
          >
            Membership
          </Link>
          <Link to="/events" className="text-sm font-medium hover:text-primary">
            Events
          </Link>
          <Link
            to="/resources"
            className="text-sm font-medium hover:text-primary"
          >
            Resources
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium hover:text-primary"
          >
            Contact
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white"
            onClick={() => setIsAuthModalOpen(true)}
          >
            Login
          </Button>
          <Button
            className="bg-primary text-white hover:bg-primary/90"
            onClick={() => setIsAuthModalOpen(true)}
          >
            Register
          </Button>
        </div>

        {/* Auth Modal */}
        <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
          <AuthModal
            activeTab="login"
            onClose={() => setIsAuthModalOpen(false)}
          />
        </Dialog>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden bg-white absolute w-full border-b border-gray-200 shadow-md transition-all duration-300 ease-in-out",
          isMenuOpen ? "max-h-screen py-4" : "max-h-0 overflow-hidden py-0",
        )}
      >
        <div className="container px-4 mx-auto space-y-4">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium hover:text-primary"
            >
              About
            </Link>
            <Link
              to="/membership"
              className="text-sm font-medium hover:text-primary"
            >
              Membership
            </Link>
            <Link
              to="/events"
              className="text-sm font-medium hover:text-primary"
            >
              Events
            </Link>
            <Link
              to="/resources"
              className="text-sm font-medium hover:text-primary"
            >
              Resources
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium hover:text-primary"
            >
              Contact
            </Link>
          </nav>

          <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary hover:text-white"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Login
            </Button>
            <Button
              className="w-full bg-primary text-white hover:bg-primary/90"
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
