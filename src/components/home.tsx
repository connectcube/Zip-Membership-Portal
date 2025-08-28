import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import HeroSection from "./home/HeroSection";
import FeatureHighlights from "./home/FeatureHighlights";
import VerificationTool, { VerificationResult } from "./home/VerificationTool";
import AuthModal from "./auth/AuthModal";
import MemberDashboard from "./dashboard/MemberDashboard";

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
  };

  const handleRegistrationSuccess = () => {
    setAuthModalTab("login");
    setIsAuthModalOpen(true);
  };

  const handleRegisterClick = () => {
    setAuthModalTab("register");
    setIsAuthModalOpen(true);
  };

  const handleLoginClick = () => {
    setAuthModalTab("login");
    setIsAuthModalOpen(true);
  };

  const handleVerification = async (id: string): Promise<VerificationResult> => {
    if (id.toUpperCase().startsWith("ZIP")) {
      return {
        isValid: true,
        plannerName: "John Mwanza",
        membershipCategory: "Full Member",
        specialization: "Spatial Planning",
        expiryDate: "31 December 2023",
        plannerID: id.toUpperCase(),
        registrationDate: "15 January 2020",
        town: "Lusaka",
        province: "Lusaka",
      };
    } else {
      return { isValid: false };
    }
  };

  if (isLoggedIn) return <MemberDashboard />;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        <HeroSection
          onCtaClick={handleRegisterClick}
          onSecondaryCtaClick={handleLoginClick}
        />
        <FeatureHighlights />
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <VerificationTool onVerify={handleVerification} />
          </div>
        </section>
      </main>
      <Footer />
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