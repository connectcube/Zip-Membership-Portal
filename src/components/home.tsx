import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import HeroSection from "./home/HeroSection";
import FeatureHighlights from "./home/FeatureHighlights";
import VerificationTool from "./home/VerificationTool";
import AuthModal from "./auth/AuthModal";
import MemberDashboard from "./dashboard/MemberDashboard";

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">(
    "login",
  );

  // Handle login success
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
  };

  // Handle registration success
  const handleRegistrationSuccess = () => {
    // In a real app, this might show a verification message or directly log the user in
    setAuthModalTab("login");
    setIsAuthModalOpen(true);
  };

  // Handle CTA button clicks
  const handleRegisterClick = () => {
    setAuthModalTab("register");
    setIsAuthModalOpen(true);
  };

  const handleLoginClick = () => {
    setAuthModalTab("login");
    setIsAuthModalOpen(true);
  };

  // Handle verification
  const handleVerification = async (id: string) => {
    // This would be replaced with an actual API call in a real implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        if (id.toUpperCase().startsWith("ZIP")) {
          resolve({
            isValid: true,
            plannerName: "John Mwanza",
            membershipCategory: "Full Member",
            expiryDate: "31 December 2023",
            plannerID: id.toUpperCase(),
          });
        } else {
          resolve({ isValid: false });
        }
      }, 1000);
    });
  };

  // If user is logged in, show the member dashboard
  if (isLoggedIn) {
    return <MemberDashboard />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection
          onCtaClick={handleRegisterClick}
          onSecondaryCtaClick={handleLoginClick}
        />

        {/* Feature Highlights */}
        <FeatureHighlights />

        {/* Verification Tool */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <VerificationTool onVerify={handleVerification} />
          </div>
        </section>
      </main>

      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        defaultTab={authModalTab}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegistrationSuccess}
      />
    </div>
  );
};

export default Home;
