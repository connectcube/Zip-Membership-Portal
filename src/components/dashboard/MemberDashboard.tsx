import React, { useEffect, useRef, useState } from 'react';
import Sidebar from './Sidebar';
import DashboardOverview from './DashboardOverview';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, CreditCard, FileText, Calendar, Bell, MessageSquare, Settings } from 'lucide-react';
import { useUserStore } from '@/lib/zustand';
import { auth, fireDataBase, fireStorage } from '@/lib/firebase';
import { useNavigate } from 'react-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import ProfileSection from './components/ProfileSection';
import PaymentsSection from './components/PaymentSection';
import MessagesSection from './components/MessageSection';
import SettingsSection from './components/SettingsSection';
import NotificationsSection from './components/NotificationSection';
import EventsSection from './components/EventsSection';
import DocumentsSection from './components/DocumentSection';

interface MemberDashboardProps {
  userName?: string;
  membershipType?: string;
  membershipStatus?: string;
  membershipExpiry?: string;
  activePage?: string;
  userEmail?: string;
  userPhone?: string;
  userAddress?: string;
  userTown?: string;
  userProvince?: string;
  plannerID?: string;
  registrationDate?: string;
  qualification?: string;
  institution?: string;
  currentEmployer?: string;
  jobTitle?: string;
  experience?: string;
  specialization?: string;
  bio?: string;
  onLogout?: () => void;
}

const MemberDashboard = ({
  userName = 'John Doe',
  membershipType = 'Professional Planner',
  membershipStatus = 'Active',
  membershipExpiry = 'December 31, 2023',
  activePage = 'dashboard',
}: MemberDashboardProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(activePage);
  const { user, clearUser, setUser } = useUserStore();
  const onLogout = async () => {
    await signOut(auth);
    clearUser();
    navigate('/');
  };

  const fetchUserData = async uid => {
    try {
      const userRef = doc(fireDataBase, 'users', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUser({ ...user, profile: userSnap.data() });
      } else {
        console.log('No such user!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    // 🔹 Subscribe to auth changes
    const unsubscribe = onAuthStateChanged(auth, authUser => {
      if (authUser) {
        // User signed in or session restored → fetch profile
        fetchUserData(authUser.uid);
      } else {
        // User signed out
        clearUser();
      }
    });

    // Clean up on unmount
    return () => unsubscribe();
  }, [setUser, clearUser]);

  if (!user) {
    return (
      <div className="flex min-h-screen">
        {/* Sidebar Skeleton */}
        <div className="flex flex-col bg-gray-900 p-6 w-64">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gray-700 rounded-full w-20 h-20 animate-pulse"></div>
            <div className="bg-gray-700 mt-4 rounded-md w-24 h-4 animate-pulse"></div>
            <div className="bg-gray-700 mt-2 rounded-md w-16 h-3 animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {Array(7)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="bg-gray-700 rounded-md w-full h-10 animate-pulse"></div>
              ))}
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 bg-gray-50 p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="bg-gray-300 rounded-md w-64 h-6 animate-pulse"></div>
            <div className="bg-gray-200 mt-2 rounded-md w-96 h-4 animate-pulse"></div>
          </div>

          {/* Top Stats Row */}
          <div className="gap-6 grid grid-cols-1 md:grid-cols-3 mb-6">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-4 bg-white shadow p-6 rounded-lg">
                  <div className="bg-gray-300 rounded-md w-32 h-4 animate-pulse"></div>
                  <div className="bg-gray-200 rounded-md w-16 h-6 animate-pulse"></div>
                </div>
              ))}
          </div>

          {/* Bottom Section */}
          <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
            <div className="space-y-4 bg-white shadow p-6 rounded-lg">
              <div className="bg-gray-300 rounded-md w-40 h-4 animate-pulse"></div>
              <div className="bg-gray-200 rounded-md w-full h-20 animate-pulse"></div>
            </div>
            <div className="space-y-4 bg-white shadow p-6 rounded-lg">
              <div className="bg-gray-300 rounded-md w-40 h-4 animate-pulse"></div>
              <div className="bg-gray-200 rounded-md w-full h-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Generate payment history based on membership type and registration date
  const paymentHistory = [];

  // Render the appropriate content based on the current page
  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardOverview userId={user.profile.authRef.id} setCurrentPage={setCurrentPage} />
        );
      case 'profile':
        return <ProfileSection />;
      case 'payments':
        return <PaymentsSection paymentHistory={paymentHistory} />;
      case 'documents':
        return <DocumentsSection />;
      case 'events':
        return <EventsSection userId={user.profile.authRef.id} />;
      case 'notifications':
        return <NotificationsSection userId={user.profile.authRef.id} />;
      case 'messages':
        return <MessagesSection userId={user.profile.authRef.id} />;
      case 'settings':
        return <SettingsSection />;
      default:
        return (
          <DashboardOverview userId={user.profile.authRef.id} setCurrentPage={setCurrentPage} />
        );
    }
  };

  return (
    <div className="flex bg-white h-screen">
      <Sidebar
        activePage={currentPage}
        setCurrentPage={setCurrentPage}
        userName={userName}
        membershipType={membershipType}
        membershipStatus={membershipStatus}
        expiryDate={membershipExpiry}
        onLogout={onLogout}
      />
      <div className="flex-1 overflow-auto">{renderContent()}</div>
    </div>
  );
};

export default MemberDashboard;
