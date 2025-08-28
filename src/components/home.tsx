import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import HeroSection from "./home/HeroSection";
import FeatureHighlights from "./home/FeatureHighlights";
import VerificationTool from "./home/VerificationTool";
import AuthModal from "./auth/AuthModal";
import MemberDashboard from "./dashboard/MemberDashboard";

interface UserData {
  personalInfo: {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    town: string;
    province: string;
    dateJoined: string;
  };
  professionalInfo: {
    qualification: string;
    institution: string;
    graduationYear: string;
    currentEmployer?: string;
    jobTitle?: string;
    experience: string;
    specialization: string;
  };
  membershipInfo: {
    membershipType: string;
    specialization: string;
    bio: string;
  };
}

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">(
    "login",
  );
  const [userData, setUserData] = useState<UserData | null>(null);

  // Check for existing user session on component mount
  useEffect(() => {
    const savedUserData = localStorage.getItem("zipUserData");
    const isUserLoggedIn = localStorage.getItem("zipIsLoggedIn");

    if (savedUserData && isUserLoggedIn === "true") {
      setUserData(JSON.parse(savedUserData));
      setIsLoggedIn(true);
    }
  }, []);

  // Handle login success
  const handleLoginSuccess = (loginData?: any) => {
    // For login, we'll use mock data or fetch from server
    // In a real app, this would come from the authentication response
    const mockUserData: UserData = {
      personalInfo: {
        firstName: loginData?.firstName || "John",
        lastName: loginData?.lastName || "Doe",
        email: loginData?.email || "john.doe@example.com",
        phone: "+260 97 1234567",
        address: "123 Planning Avenue",
        town: "Lusaka",
        province: "Lusaka",
        dateJoined: "2020-01-15",
      },
      professionalInfo: {
        qualification: "Bachelor of Urban Planning",
        institution: "University of Zambia",
        graduationYear: "2018",
        currentEmployer: "Ministry of Planning",
        jobTitle: "Urban Planner",
        experience: "5",
        specialization: "Urban Design",
      },
      membershipInfo: {
        membershipType: "Full Member",
        specialization: "Spatial Planning",
        bio: "Experienced urban planner with expertise in sustainable development and community planning.",
      },
    };

    setUserData(mockUserData);
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);

    // Save to localStorage
    localStorage.setItem("zipUserData", JSON.stringify(mockUserData));
    localStorage.setItem("zipIsLoggedIn", "true");
  };

  // Handle registration success
  const handleRegistrationSuccess = (registrationData?: any) => {
    if (registrationData) {
      // Store the registration data and automatically log the user in
      const newUserData: UserData = {
        personalInfo: registrationData.personalInfo,
        professionalInfo: registrationData.professionalInfo,
        membershipInfo: registrationData.membershipInfo,
      };

      setUserData(newUserData);
      setIsLoggedIn(true);
      setIsAuthModalOpen(false);

      // Save to localStorage
      localStorage.setItem("zipUserData", JSON.stringify(newUserData));
      localStorage.setItem("zipIsLoggedIn", "true");
    } else {
      // Fallback to showing login modal
      setAuthModalTab("login");
      setIsAuthModalOpen(true);
    }
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

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    localStorage.removeItem("zipUserData");
    localStorage.removeItem("zipIsLoggedIn");
  };

  // If user is logged in, show the member dashboard
  if (isLoggedIn && userData) {
    const fullName = `${userData.personalInfo.firstName} ${userData.personalInfo.middleName ? userData.personalInfo.middleName + " " : ""}${userData.personalInfo.lastName}`;

    return (
      <MemberDashboard
        userName={fullName}
        membershipType={userData.membershipInfo.membershipType}
        membershipStatus="Active"
        membershipExpiry="December 31, 2024"
        userEmail={userData.personalInfo.email}
        userPhone={userData.personalInfo.phone}
        userAddress={userData.personalInfo.address}
        userTown={userData.personalInfo.town}
        userProvince={userData.personalInfo.province}
        plannerID={`ZIP-${new Date(userData.personalInfo.dateJoined).getFullYear()}-${Math.floor(
          Math.random() * 9999,
        )
          .toString()
          .padStart(4, "0")}`}
        registrationDate={new Date(
          userData.personalInfo.dateJoined,
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        qualification={userData.professionalInfo.qualification}
        institution={userData.professionalInfo.institution}
        currentEmployer={userData.professionalInfo.currentEmployer}
        jobTitle={userData.professionalInfo.jobTitle}
        experience={userData.professionalInfo.experience}
        specialization={userData.professionalInfo.specialization}
        bio={userData.membershipInfo.bio}
        onLogout={handleLogout}
      />
    );
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
