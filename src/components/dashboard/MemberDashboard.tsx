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

  // Generate personalized notifications based on user data
  const notifications = [];

  // Generate relevant events based on user specialization
  const upcomingEvents = [];

  // Generate payment history based on membership type and registration date
  const paymentHistory = [];

  const messages = [];
  // Placeholder components for different sections
  const ProfileSection = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const fileInputRef = useRef(null);

    const [profileData, setProfileData] = useState({
      fullName: `${user.profile.firstName} ${user.profile.middleName} ${user.profile.lastName}`,
      email: user.profile.email,
      phone: user.profile.phone,
      address: `${user.profile.address}, ${user.profile.town}, ${user.profile.province}, Zambia`,
      photoURL: user.profile.photoURL || null,
    });

    const [professionalInfo, setProfessionalInfo] = useState({
      qualification: user.profile.professionalInfo?.qualification || '',
      institution: user.profile.professionalInfo?.institution || '',
      graduationYear: user.profile.professionalInfo?.graduationYear || '',
      specialization: user.profile.professionalInfo?.specialization || '',
      jobTitle: user.profile.professionalInfo?.jobTitle || '',
      currentEmployer: user.profile.professionalInfo?.currentEmployer || '',
      experience: user.profile.professionalInfo?.experience || '',
    });

    const saveProfileChanges = async () => {
      try {
        setLoading(true);
        const userRef = doc(fireDataBase, 'users', user.uid);
        await updateDoc(userRef, {
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
          fullName: profileData.fullName,
          firstName: profileData.fullName.split(' ')[0] || '',
          lastName: profileData.fullName.split(' ').slice(-1)[0] || '',
          professionalInfo: professionalInfo,
        });
        setIsEditing(false);
      } catch (err) {
        console.error('Error updating profile:', err);
      } finally {
        setLoading(false);
      }
    };

    const handlePhotoChange = async e => {
      const file = e.target.files[0];
      if (!file) return;

      const storageRef = ref(fireStorage, `profilePhotos/${user.uid}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setUploading(true);

      uploadTask.on(
        'state_changed',
        snapshot => {
          // Optional: track progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        error => {
          console.error('Upload error:', error);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setProfileData(prev => ({ ...prev, photoURL: downloadURL }));

          // 🔹 Update Firestore immediately
          const userRef = doc(fireDataBase, 'users', user.uid);
          await updateDoc(userRef, { photoURL: downloadURL });
          await saveProfileChanges();
          setUploading(false);
        }
      );
    };
    return (
      <div className="bg-gray-50 p-6 min-h-screen">
        <h1 className="mb-6 font-bold text-gray-900 text-3xl">My Profile</h1>
        <div className="space-y-6">
          {/* Basic Information Card */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 font-semibold text-xl">Basic Information</h2>
              <div className="flex md:flex-row flex-col gap-8">
                <div className="flex flex-col items-center">
                  <div className="flex justify-center items-center bg-slate-200 mb-4 rounded-full w-32 h-32 overflow-hidden">
                    {profileData.photoURL ? (
                      <img
                        src={profileData.photoURL}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={64} className="text-slate-400" />
                    )}
                  </div>
                  <button
                    className="text-blue-600 text-sm hover:underline"
                    onClick={() => fileInputRef.current.click()}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Change Photo'}
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                  />
                </div>

                <div className="flex-1 space-y-6">
                  <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 text-sm">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="p-2 border rounded-md w-full"
                        value={profileData.fullName}
                        onChange={e => setProfileData({ ...profileData, fullName: e.target.value })}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 text-sm">
                        Membership Type
                      </label>
                      <input
                        type="text"
                        className="p-2 border rounded-md w-full"
                        value={user.profile.membershipType || ''}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 text-sm">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="p-2 border rounded-md w-full"
                        value={profileData.email}
                        onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 text-sm">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="p-2 border rounded-md w-full"
                        value={profileData.phone}
                        onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 text-sm">
                        Planner ID
                      </label>
                      <input
                        type="text"
                        className="p-2 border rounded-md w-full"
                        value={user.profile.membershipNumber || ''}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 text-sm">
                        Registration Date
                      </label>
                      <input
                        type="text"
                        className="p-2 border rounded-md w-full"
                        value={user.profile.createdAt.toDate().toLocaleDateString() || ''}
                        readOnly
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      Professional Address
                    </label>
                    <textarea
                      className="p-2 border rounded-md w-full"
                      rows={3}
                      value={profileData.address}
                      onChange={e => setProfileData({ ...profileData, address: e.target.value })}
                      readOnly={!isEditing}
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    {isEditing ? (
                      <>
                        <button
                          className="hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-md transition-colors"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition-colors"
                          disabled={loading}
                          onClick={() => saveProfileChanges()}
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition-colors"
                          onClick={() => setIsEditing(true)}
                        >
                          Edit Profile
                        </button>
                        <button className="hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-md transition-colors">
                          Change Password
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Info Card */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 font-semibold text-xl">Professional Information</h2>
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">
                    Qualification
                  </label>
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full"
                    value={professionalInfo.qualification}
                    onChange={e =>
                      setProfessionalInfo({
                        ...professionalInfo,
                        qualification: e.target.value,
                      })
                    }
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">
                    Institution
                  </label>
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full"
                    value={professionalInfo.institution}
                    onChange={e =>
                      setProfessionalInfo({
                        ...professionalInfo,
                        institution: e.target.value,
                      })
                    }
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    className="p-2 border rounded-md w-full"
                    value={professionalInfo.graduationYear}
                    onChange={e =>
                      setProfessionalInfo({
                        ...professionalInfo,
                        graduationYear: e.target.value,
                      })
                    }
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">
                    Specialization
                  </label>
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full"
                    value={professionalInfo.specialization}
                    onChange={e =>
                      setProfessionalInfo({
                        ...professionalInfo,
                        specialization: e.target.value,
                      })
                    }
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">Job Title</label>
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full"
                    value={professionalInfo.jobTitle}
                    onChange={e =>
                      setProfessionalInfo({
                        ...professionalInfo,
                        jobTitle: e.target.value,
                      })
                    }
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">
                    Current Employer
                  </label>
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full"
                    value={professionalInfo.currentEmployer}
                    onChange={e =>
                      setProfessionalInfo({
                        ...professionalInfo,
                        currentEmployer: e.target.value,
                      })
                    }
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    className="p-2 border rounded-md w-full"
                    value={professionalInfo.experience}
                    onChange={e =>
                      setProfessionalInfo({
                        ...professionalInfo,
                        experience: e.target.value,
                      })
                    }
                    readOnly={!isEditing}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                {isEditing ? (
                  <>
                    <button
                      className="hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-md transition-colors"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition-colors"
                      disabled={loading}
                      onClick={saveProfileChanges}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition-colors"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Professional Info
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const PaymentsSection = () => (
    <div className="bg-gray-50 p-6 min-h-screen">
      <h1 className="mb-6 font-bold text-gray-900 text-3xl">Payments</h1>
      <Tabs defaultValue="history">
        <TabsList className="mb-6">
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="pending">Pending Payments</TabsTrigger>
          <TabsTrigger value="make">Make Payment</TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {paymentHistory.length > 0 ? (
                  paymentHistory.map(payment => (
                    <div
                      key={payment.id}
                      className="flex justify-between items-center p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-lg">
                          <CreditCard className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{payment.description}</h4>
                          <p className="text-gray-500 text-sm">{payment.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{payment.amount}</p>
                        <span className="inline-block bg-green-100 px-2 py-1 rounded-full text-green-800 text-xs">
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-gray-500">No payment history available.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">You have no pending payments at this time.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="make">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 font-medium text-xl">Make a Payment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">
                    Payment Type
                  </label>
                  <select className="p-2 border rounded-md w-full">
                    <option>Annual Membership Fee</option>
                    <option>AGM Registration</option>
                    <option>Workshop Registration</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">Amount</label>
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full"
                    value="K1,500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">
                    Payment Method
                  </label>
                  <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
                    <div className="flex items-center gap-2 hover:bg-gray-50 p-4 border rounded-md cursor-pointer">
                      <input type="radio" name="payment-method" id="mobile-money" />
                      <label htmlFor="mobile-money">Mobile Money</label>
                    </div>
                    <div className="flex items-center gap-2 hover:bg-gray-50 p-4 border rounded-md cursor-pointer">
                      <input type="radio" name="payment-method" id="bank-transfer" />
                      <label htmlFor="bank-transfer">Bank Transfer</label>
                    </div>
                    <div className="flex items-center gap-2 hover:bg-gray-50 p-4 border rounded-md cursor-pointer">
                      <input type="radio" name="payment-method" id="card-payment" />
                      <label htmlFor="card-payment">Card Payment</label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition-colors">
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const DocumentsSection = () => {
    const documentLabels = {
      cvURL: 'CV',
      idCopyURL: 'ID Copy',
      passportPhotoURL: 'Passport Photo',
      professionalReferencesURL: 'Professional References',
      qualificationCertificateURL: 'Qualification Certificate',
    };

    return (
      <div className="bg-gray-50 p-6 min-h-screen">
        <h1 className="mb-6 font-bold text-gray-900 text-3xl">Documents</h1>
        <Tabs defaultValue="my-documents">
          <TabsList className="mb-6">
            <TabsTrigger value="my-documents">My Documents</TabsTrigger>
            <TabsTrigger value="institute-documents">Institute Documents</TabsTrigger>
            <TabsTrigger value="upload">Upload Document</TabsTrigger>
          </TabsList>
          <TabsContent value="my-documents">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {Object.entries(user.profile.documents)
                    .filter(([_, url]) => url) // Only include non-null URLs
                    .map(([key, url], index) => (
                      <div
                        key={key}
                        className="flex justify-between items-center p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-blue-100 p-3 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{documentLabels[key]}</h4>
                            <p className="text-gray-500 text-sm">
                              Uploaded on: {/* You can add a timestamp if available */}
                              {new Date().toISOString().split('T')[0]}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={url as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:bg-gray-50 px-3 py-1 border rounded-md text-sm"
                          >
                            View
                          </a>
                          <a
                            href={url as string}
                            download
                            className="hover:bg-gray-50 px-3 py-1 border rounded-md text-sm"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="institute-documents">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      name: 'ZIP Constitution',
                      date: '2022-05-10',
                      type: 'PDF',
                    },
                    {
                      id: 2,
                      name: 'Code of Ethics',
                      date: '2022-03-15',
                      type: 'PDF',
                    },
                    {
                      id: 3,
                      name: 'Membership Guidelines',
                      date: '2022-01-20',
                      type: 'PDF',
                    },
                  ].map(doc => (
                    <div
                      key={doc.id}
                      className="flex justify-between items-center p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-purple-100 p-3 rounded-lg">
                          <FileText className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          <p className="text-gray-500 text-sm">Published on: {doc.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="hover:bg-gray-50 px-3 py-1 border rounded-md text-sm">
                          View
                        </button>
                        <button className="hover:bg-gray-50 px-3 py-1 border rounded-md text-sm">
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="upload">
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 font-medium text-xl">Upload New Document</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      Document Type
                    </label>
                    <select className="p-2 border rounded-md w-full">
                      <option>Professional Certificate</option>
                      <option>Academic Transcript</option>
                      <option>CV</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      Document Title
                    </label>
                    <input
                      type="text"
                      className="p-2 border rounded-md w-full"
                      placeholder="Enter document title"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      Upload File
                    </label>
                    <div className="p-6 border-2 border-gray-300 border-dashed rounded-md text-center">
                      <FileText className="mx-auto mb-2 w-10 h-10 text-gray-400" />
                      <p className="mb-2 text-gray-500 text-sm">
                        Drag and drop your file here, or click to browse
                      </p>
                      <p className="text-gray-400 text-xs">
                        Supported formats: PDF, DOCX, JPG, PNG (Max 10MB)
                      </p>
                      <input type="file" className="hidden" />
                      <button className="bg-blue-600 hover:bg-blue-700 mt-4 px-4 py-2 rounded-md text-white transition-colors">
                        Browse Files
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition-colors">
                      Upload Document
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  const EventsSection = () => (
    <div className="bg-gray-50 p-6 min-h-screen">
      <h1 className="mb-6 font-bold text-gray-900 text-3xl">Events & CPD</h1>
      <Tabs defaultValue="upcoming">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
          <TabsTrigger value="cpd">CPD Records</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map(event => (
                    <div key={event.id} className="border rounded-lg overflow-hidden">
                      <div className="flex justify-between items-center bg-blue-50 p-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <h3 className="font-medium">{event.title}</h3>
                        </div>
                        <span className="bg-blue-100 px-2 py-1 rounded-full text-blue-800 text-xs">
                          {event.type}
                        </span>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between mb-4">
                          <p className="text-sm">
                            <strong>Date:</strong> {event.date}
                          </p>
                          <p className="text-sm">
                            <strong>Location:</strong> Lusaka, Zambia
                          </p>
                        </div>
                        <p className="mb-4 text-gray-600 text-sm">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                          tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="text-sm">
                            <strong>CPD Points:</strong> 5
                          </p>
                          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition-colors">
                            Register Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-gray-500">No upcoming events found.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="past">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    title: 'Urban Planning Conference',
                    date: '2022-10-15',
                    type: 'Conference',
                    attended: true,
                  },
                  {
                    id: 2,
                    title: 'Sustainable Development Workshop',
                    date: '2022-08-22',
                    type: 'Workshop',
                    attended: true,
                  },
                  {
                    id: 3,
                    title: 'Planning Law Seminar',
                    date: '2022-06-10',
                    type: 'Seminar',
                    attended: false,
                  },
                ].map(event => (
                  <div
                    key={event.id}
                    className="flex justify-between items-center p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-gray-500 text-sm">
                          {event.date} • {event.type}
                        </p>
                      </div>
                    </div>
                    <div>
                      {event.attended ? (
                        <span className="inline-block bg-green-100 px-2 py-1 rounded-full text-green-800 text-xs">
                          Attended
                        </span>
                      ) : (
                        <span className="inline-block bg-red-100 px-2 py-1 rounded-full text-red-800 text-xs">
                          Missed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cpd">
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="mb-2 font-medium text-xl">CPD Points Summary</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-600 text-sm">Current Year (2023)</p>
                      <p className="font-bold text-2xl">15 / 20 Points</p>
                    </div>
                    <div className="flex justify-center items-center border-8 border-blue-500 rounded-full w-24 h-24">
                      <span className="font-bold text-xl">75%</span>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="mb-4 font-medium text-xl">CPD Activities</h3>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    activity: 'Urban Planning Conference',
                    date: '2022-10-15',
                    points: 5,
                  },
                  {
                    id: 2,
                    activity: 'Sustainable Development Workshop',
                    date: '2022-08-22',
                    points: 3,
                  },
                  {
                    id: 3,
                    activity: 'Planning Journal Publication',
                    date: '2022-07-05',
                    points: 7,
                  },
                ].map(activity => (
                  <div
                    key={activity.id}
                    className="flex justify-between items-center p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{activity.activity}</h4>
                        <p className="text-gray-500 text-sm">{activity.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{activity.points} Points</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const NotificationsSection = () => (
    <div className="bg-gray-50 p-6 min-h-screen">
      <h1 className="mb-6 font-bold text-gray-900 text-3xl">Notifications</h1>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg ${
                    notification.read ? 'bg-white border' : 'bg-blue-50 border-blue-100 border'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-full ${
                        notification.read ? 'bg-gray-100' : 'bg-blue-100'
                      }`}
                    >
                      <Bell
                        className={`h-5 w-5 ${
                          notification.read ? 'text-gray-500' : 'text-blue-500'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="mt-1 text-gray-500 text-sm">{notification.date}</p>
                      <p className="mt-2 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua.
                      </p>
                      {!notification.read && (
                        <button className="mt-2 text-blue-600 text-sm hover:underline">
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center">
                <p className="text-gray-500">No notifications</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const MessagesSection = () => (
    <div className="bg-gray-50 p-6 min-h-screen">
      <h1 className="mb-6 font-bold text-gray-900 text-3xl">Messages</h1>
      <Card>
        <CardContent className="p-6">
          <div className="flex md:flex-row flex-col border rounded-lg h-[600px] overflow-hidden">
            {/* Messages list */}
            <div className="border-r w-full md:w-1/3">
              <div className="p-4 border-b">
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="p-2 border rounded-md w-full"
                />
              </div>
              <div className="h-[calc(600px-64px)] overflow-y-auto">
                {messages.length > 0 ? (
                  messages.map(message => (
                    <div
                      key={message.id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                        message.unread ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{message.sender}</h4>
                        <span className="text-gray-500 text-xs">{message.time}</span>
                      </div>
                      <p className="text-gray-600 text-sm truncate">{message.preview}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-gray-500">No messages</p>
                  </div>
                )}
              </div>
            </div>

            {/* Message content */}
            {messages.length > 0 ? (
              <div className="flex flex-col w-full md:w-2/3">
                <div className="p-4 border-b">
                  <h3 className="font-medium">ZIP Admin</h3>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
                        <p className="text-sm">
                          Hello John, this is a reminder that your membership will expire in 30
                          days. Please renew to maintain your active status.
                        </p>
                        <span className="block mt-1 text-gray-500 text-xs">10:30 AM</span>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-blue-100 p-3 rounded-lg max-w-[80%]">
                        <p className="text-sm">
                          Thank you for the reminder. I'll process the renewal this week.
                        </p>
                        <span className="block mt-1 text-gray-500 text-xs">10:32 AM</span>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
                        <p className="text-sm">
                          Great! Let me know if you need any assistance with the payment process.
                        </p>
                        <span className="block mt-1 text-gray-500 text-xs">10:35 AM</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 p-2 border rounded-md"
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition-colors">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center w-full md:w-2/3">
                <p className="text-gray-500">No message</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SettingsSection = () => (
    <div className="bg-gray-50 p-6 min-h-screen">
      <h1 className="mb-6 font-bold text-gray-900 text-3xl">Settings</h1>
      <Tabs defaultValue="account">
        <TabsList className="mb-6">
          <TabsTrigger value="account">Account Settings</TabsTrigger>
          {/*<TabsTrigger value="notifications">Notification Preferences</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>*/}
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 font-medium text-xl">Account Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="p-2 border rounded-md w-full"
                    value={user.email || 'john.doe@example.com'}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="p-2 border rounded-md w-full"
                    value={user.profile.phone || 'N/A'}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">
                    Language Preference
                  </label>
                  <select className="p-2 border rounded-md w-full">
                    <option>English</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 font-medium text-xl">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-gray-500 text-sm">Receive notifications via email</p>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="email-notifications" className="mr-2" checked />
                    <label htmlFor="email-notifications">Enabled</label>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-gray-500 text-sm">Receive notifications via SMS</p>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="sms-notifications" className="mr-2" />
                    <label htmlFor="sms-notifications">Disabled</label>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium">Payment Reminders</h4>
                    <p className="text-gray-500 text-sm">
                      Receive reminders about upcoming payments
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="payment-reminders" className="mr-2" checked />
                    <label htmlFor="payment-reminders">Enabled</label>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium">Event Notifications</h4>
                    <p className="text-gray-500 text-sm">
                      Receive notifications about upcoming events
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="event-notifications" className="mr-2" checked />
                    <label htmlFor="event-notifications">Enabled</label>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition-colors">
                    Save Preferences
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="privacy">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 font-medium text-xl">Privacy & Security</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 font-medium">Change Password</h4>
                  <div className="space-y-3">
                    <input
                      type="password"
                      className="p-2 border rounded-md w-full"
                      placeholder="Current Password"
                    />
                    <input
                      type="password"
                      className="p-2 border rounded-md w-full"
                      placeholder="New Password"
                    />
                    <input
                      type="password"
                      className="p-2 border rounded-md w-full"
                      placeholder="Confirm New Password"
                    />
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 mt-3 px-4 py-2 rounded-md text-white transition-colors">
                    Update Password
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <h4 className="mb-2 font-medium">Profile Visibility</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <h5 className="font-medium">Public Profile</h5>
                        <p className="text-gray-500 text-sm">
                          Allow your profile to be visible in the public directory
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="public-profile" className="mr-2" checked />
                        <label htmlFor="public-profile">Enabled</label>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <h5 className="font-medium">Contact Information</h5>
                        <p className="text-gray-500 text-sm">
                          Show your contact information to other members
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="contact-info" className="mr-2" />
                        <label htmlFor="contact-info">Disabled</label>
                      </div>
                    </div>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 mt-3 px-4 py-2 rounded-md text-white transition-colors">
                    Save Privacy Settings
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Render the appropriate content based on the current page
  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardOverview
            memberName={userName}
            membershipStatus={membershipStatus as 'Active' | 'Pending' | 'Expired'}
            membershipType={membershipType}
            membershipExpiry={membershipExpiry}
            notifications={notifications}
            upcomingEvents={upcomingEvents}
            paymentHistory={paymentHistory}
          />
        );
      case 'profile':
        return <ProfileSection />;
      case 'payments':
        return <PaymentsSection />;
      case 'documents':
        return <DocumentsSection />;
      case 'events':
        return <EventsSection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'messages':
        return <MessagesSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <DashboardOverview />;
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
