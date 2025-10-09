import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import HeroSection from './home/HeroSection';
import FeatureHighlights from './home/FeatureHighlights';
import VerificationTool, { VerificationResult } from './home/VerificationTool';
import AuthModal from './auth/AuthModal';
import MemberDashboard from './dashboard/MemberDashboard';
import { useUserStore } from '@/lib/zustand';
import HomeSEO from './seo/HomeSEO';

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
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const { user } = useUserStore();
  useEffect(() => {
    console.log(user);
  }, [user]);
  // Handle login success
  const handleLoginSuccess = (loginData?: any) => {
    // For login, we'll use mock data or fetch from server
    // In a real app, this would come from the authentication response
    const mockUserData: UserData = {
      personalInfo: {
        firstName: loginData?.firstName || 'John',
        lastName: loginData?.lastName || 'Doe',
        email: loginData?.email || 'john.doe@example.com',
        phone: '+260 97 1234567',
        address: '123 Planning Avenue',
        town: 'Lusaka',
        province: 'Lusaka',
        dateJoined: '2020-01-15',
      },
      professionalInfo: {
        qualification: 'Bachelor of Urban Planning',
        institution: 'University of Zambia',
        graduationYear: '2018',
        currentEmployer: 'Ministry of Planning',
        jobTitle: 'Urban Planner',
        experience: '5',
        specialization: 'Urban Design',
      },
      membershipInfo: {
        membershipType: 'Full Member',
        specialization: 'Spatial Planning',
        bio: 'Experienced urban planner with expertise in sustainable development and community planning.',
      },
    };

    setIsLoggedIn(true);
    setIsAuthModalOpen(false);

    // Save to localStorage
    localStorage.setItem('zipUserData', JSON.stringify(mockUserData));
    localStorage.setItem('zipIsLoggedIn', 'true');
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
      setIsLoggedIn(true);
      setIsAuthModalOpen(false);

      // Save to localStorage
      localStorage.setItem('zipUserData', JSON.stringify(newUserData));
      localStorage.setItem('zipIsLoggedIn', 'true');
    } else {
      // Fallback to showing login modal
      setAuthModalTab('login');
      setIsAuthModalOpen(true);
    }
  };

  const handleRegisterClick = () => {
    setAuthModalTab('register');
    setIsAuthModalOpen(true);
  };

  const handleLoginClick = () => {
    setAuthModalTab('login');
    setIsAuthModalOpen(true);
  };

  const handleVerification = async (id: string): Promise<VerificationResult> => {
    if (id.toUpperCase().startsWith('ZIP')) {
      return {
        isValid: true,
        plannerName: 'John Mwanza',
        membershipCategory: 'Full Member',
        specialization: 'Spatial Planning',
        expiryDate: '31 December 2023',
        plannerID: id.toUpperCase(),
        registrationDate: '15 January 2020',
        town: 'Lusaka',
        province: 'Lusaka',
      };
    } else {
      return { isValid: false };
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // If user is logged in, show the member dashboard
  if (user) {
    return <MemberDashboard onLogout={handleLogout} />;
  }

  return (
    <>
      <HomeSEO />
      <div className="flex flex-col bg-white min-h-screen">
        <Header />
      <main className="flex-grow">
        <HeroSection onCtaClick={handleRegisterClick} onSecondaryCtaClick={handleLoginClick} />
        <FeatureHighlights />
        <section className="bg-white px-4 py-16">
          <div className="mx-auto container">
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
    </>
  );
};

export default Home;
