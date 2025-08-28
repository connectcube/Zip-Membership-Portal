import React, { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardOverview from "./DashboardOverview";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  CreditCard,
  FileText,
  Calendar,
  Bell,
  MessageSquare,
  Settings,
} from "lucide-react";

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
  userName = "John Doe",
  membershipType = "Professional Planner",
  membershipStatus = "Active",
  membershipExpiry = "December 31, 2023",
  activePage = "dashboard",
  userEmail = "john.doe@example.com",
  userPhone = "+260 97 1234567",
  userAddress = "123 Planning Avenue, Lusaka, Zambia",
  userTown = "Lusaka",
  userProvince = "Lusaka",
  plannerID = "ZIP-2020-0123",
  registrationDate = "January 15, 2020",
  qualification = "Bachelor of Urban Planning",
  institution = "University of Zambia",
  currentEmployer = "Ministry of Planning",
  jobTitle = "Urban Planner",
  experience = "5",
  specialization = "Urban Design",
  bio = "Experienced urban planner with expertise in sustainable development.",
  onLogout = () => {},
}: MemberDashboardProps) => {
  const [currentPage, setCurrentPage] = useState(activePage);

  // Generate personalized notifications based on user data
  const notifications = [
    {
      id: "1",
      title: `Hello ${userName.split(" ")[0]}, your membership renewal is due in 30 days`,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      read: false,
    },
    {
      id: "2",
      title: "New planning regulations for " + specialization + " published",
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      read: true,
    },
    {
      id: "3",
      title: "AGM scheduled for January 15, 2024 - Registration now open",
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      read: false,
    },
    {
      id: "4",
      title: `Welcome to ZIP, ${userName}! Your profile has been approved`,
      date: registrationDate,
      read: true,
    },
  ];

  // Generate relevant events based on user specialization
  const upcomingEvents = [
    {
      id: "1",
      title: "Annual General Meeting",
      date: "2024-01-15",
      type: "Conference",
    },
    {
      id: "2",
      title: specialization + " Workshop",
      date: "2024-02-10",
      type: "Workshop",
    },
    {
      id: "3",
      title: "Professional Development Seminar",
      date: "2024-03-25",
      type: "Seminar",
    },
    {
      id: "4",
      title: userProvince + " Regional Meeting",
      date: "2024-04-15",
      type: "Meeting",
    },
  ];

<<<<<<< HEAD
  // Generate payment history based on membership type and registration date
  const paymentHistory = [
    {
      id: "1",
      description: "Annual Membership Fee - " + membershipType,
      amount:
        membershipType === "Full Member"
          ? "K1,500"
          : membershipType === "Associate"
            ? "K1,200"
            : "K800",
      date: new Date().getFullYear() + "-01-15",
      status: "Paid" as const,
    },
    {
      id: "2",
      description: "Registration Fee",
      amount: "K500",
      date: registrationDate,
      status: "Paid" as const,
    },
    {
      id: "3",
      description: "Previous Year Membership",
      amount: membershipType === "Full Member" ? "K1,500" : "K1,200",
      date: new Date().getFullYear() - 1 + "-01-15",
      status: "Paid" as const,
    },
  ];
=======
  // Mock data for payment history
    type PaymentStatus = "Pending" | "Paid" | "Failed";

    const paymentHistory: {
      id: string;
      description: string;
      amount: string;
      date: string;
      status: PaymentStatus;
    }[] = [
      {
        id: "1",
        description: "Annual Membership Fee",
        amount: "K1,500",
        date: "2023-01-15",
        status: "Paid",
      },
      {
        id: "2",
        description: "AGM Registration",
        amount: "K500",
        date: "2022-12-10",
        status: "Paid",
      },
      {
        id: "3",
        description: "Membership Renewal",
        amount: "K1,500",
        date: "2022-01-15",
        status: "Paid",
      },
    ];
>>>>>>> 5bcd31367beedc86601367d59f99e6d640af2318

  // Placeholder components for different sections
  const ProfileSection = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [qualifications, setQualifications] = useState([
      {
        id: 1,
        qualification: qualification,
        institution: institution,
        graduationYear: new Date().getFullYear() - 5,
      },
    ]);
    const [newQualification, setNewQualification] = useState({
      qualification: "",
      institution: "",
      graduationYear: "",
    });
    const [showAddQualification, setShowAddQualification] = useState(false);

    const handleAddQualification = () => {
      if (
        newQualification.qualification &&
        newQualification.institution &&
        newQualification.graduationYear
      ) {
        const newId = Math.max(...qualifications.map((q) => q.id)) + 1;
        setQualifications([
          ...qualifications,
          {
            id: newId,
            ...newQualification,
            graduationYear: parseInt(newQualification.graduationYear),
          },
        ]);
        setNewQualification({
          qualification: "",
          institution: "",
          graduationYear: "",
        });
        setShowAddQualification(false);
      }
    };

    const handleRemoveQualification = (id: number) => {
      if (qualifications.length > 1) {
        setQualifications(qualifications.filter((q) => q.id !== id));
      }
    };

    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>
        <div className="space-y-6">
          {/* Basic Information Card */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                    <User size={64} className="text-slate-400" />
                  </div>
                  <button className="text-sm text-blue-600 hover:underline">
                    Change Photo
                  </button>
                </div>
                <div className="flex-1 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={userName}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Membership Type
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={membershipType}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full p-2 border rounded-md"
                        value={userEmail}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full p-2 border rounded-md"
                        value={userPhone}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Planner ID
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={plannerID}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Registration Date
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={registrationDate}
                        readOnly
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Professional Address
                    </label>
                    <textarea
                      className="w-full p-2 border rounded-md"
                      rows={3}
                      value={`${userAddress}, ${userTown}, ${userProvince}, Zambia`}
                      readOnly={!isEditing}
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    {isEditing ? (
                      <>
                        <button
                          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                          Save Changes
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          onClick={() => setIsEditing(true)}
                        >
                          Edit Profile
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                          Change Password
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Qualifications Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Qualifications</h2>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  onClick={() => setShowAddQualification(true)}
                >
                  Add Qualification
                </button>
              </div>

              <div className="space-y-4">
                {qualifications.map((qual) => (
                  <div key={qual.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">
                          {qual.qualification}
                        </h3>
                        <p className="text-gray-600">{qual.institution}</p>
                        <p className="text-sm text-gray-500">
                          Graduated: {qual.graduationYear}
                        </p>
                      </div>
                      {qualifications.length > 1 && (
                        <button
                          className="text-red-600 hover:text-red-800 text-sm"
                          onClick={() => handleRemoveQualification(qual.id)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Qualification Form */}
              {showAddQualification && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">
                    Add New Qualification
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Qualification
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="e.g., Master of Urban Planning"
                        value={newQualification.qualification}
                        onChange={(e) =>
                          setNewQualification({
                            ...newQualification,
                            qualification: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Institution
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="e.g., University of Zambia"
                        value={newQualification.institution}
                        onChange={(e) =>
                          setNewQualification({
                            ...newQualification,
                            institution: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Graduation Year
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded-md"
                        placeholder="e.g., 2020"
                        value={newQualification.graduationYear}
                        onChange={(e) =>
                          setNewQualification({
                            ...newQualification,
                            graduationYear: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 mt-4">
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setShowAddQualification(false);
                        setNewQualification({
                          qualification: "",
                          institution: "",
                          graduationYear: "",
                        });
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      onClick={handleAddQualification}
                    >
                      Add Qualification
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const PaymentsSection = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Payments</h1>
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
                {paymentHistory.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <CreditCard className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{payment.description}</h4>
                        <p className="text-sm text-gray-500">{payment.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{payment.amount}</p>
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">
                You have no pending payments at this time.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="make">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-medium mb-4">Make a Payment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Type
                  </label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Annual Membership Fee</option>
                    <option>AGM Registration</option>
                    <option>Workshop Registration</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value="K1,500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border p-4 rounded-md cursor-pointer hover:bg-gray-50 flex items-center gap-2">
                      <input
                        type="radio"
                        name="payment-method"
                        id="mobile-money"
                      />
                      <label htmlFor="mobile-money">Mobile Money</label>
                    </div>
                    <div className="border p-4 rounded-md cursor-pointer hover:bg-gray-50 flex items-center gap-2">
                      <input
                        type="radio"
                        name="payment-method"
                        id="bank-transfer"
                      />
                      <label htmlFor="bank-transfer">Bank Transfer</label>
                    </div>
                    <div className="border p-4 rounded-md cursor-pointer hover:bg-gray-50 flex items-center gap-2">
                      <input
                        type="radio"
                        name="payment-method"
                        id="card-payment"
                      />
                      <label htmlFor="card-payment">Card Payment</label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
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

  const DocumentsSection = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Documents</h1>
      <Tabs defaultValue="my-documents">
        <TabsList className="mb-6">
          <TabsTrigger value="my-documents">My Documents</TabsTrigger>
          <TabsTrigger value="institute-documents">
            Institute Documents
          </TabsTrigger>
          <TabsTrigger value="upload">Upload Document</TabsTrigger>
        </TabsList>
        <TabsContent value="my-documents">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    name: "Professional Certificate",
                    date: "2020-01-15",
                    type: "PDF",
                  },
                  {
                    id: 2,
                    name: "Academic Transcript",
                    date: "2020-01-15",
                    type: "PDF",
                  },
                  { id: 3, name: "CV", date: "2020-01-15", type: "DOCX" },
                ].map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{doc.name}</h4>
                        <p className="text-sm text-gray-500">
                          Uploaded on: {doc.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">
                        View
                      </button>
                      <button className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">
                        Download
                      </button>
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
                    name: "ZIP Constitution",
                    date: "2022-05-10",
                    type: "PDF",
                  },
                  {
                    id: 2,
                    name: "Code of Ethics",
                    date: "2022-03-15",
                    type: "PDF",
                  },
                  {
                    id: 3,
                    name: "Membership Guidelines",
                    date: "2022-01-20",
                    type: "PDF",
                  },
                ].map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{doc.name}</h4>
                        <p className="text-sm text-gray-500">
                          Published on: {doc.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">
                        View
                      </button>
                      <button className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">
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
              <h3 className="text-xl font-medium mb-4">Upload New Document</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Type
                  </label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Professional Certificate</option>
                    <option>Academic Transcript</option>
                    <option>CV</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Title
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter document title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 p-6 rounded-md text-center">
                    <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 mb-2">
                      Drag and drop your file here, or click to browse
                    </p>
                    <p className="text-xs text-gray-400">
                      Supported formats: PDF, DOCX, JPG, PNG (Max 10MB)
                    </p>
                    <input type="file" className="hidden" />
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      Browse Files
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
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

  const EventsSection = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Events & CPD</h1>
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
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="bg-blue-50 p-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <h3 className="font-medium">{event.title}</h3>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
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
                      <p className="text-sm text-gray-600 mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-sm">
                          <strong>CPD Points:</strong> 5
                        </p>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                          Register Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
                    title: "Urban Planning Conference",
                    date: "2022-10-15",
                    type: "Conference",
                    attended: true,
                  },
                  {
                    id: 2,
                    title: "Sustainable Development Workshop",
                    date: "2022-08-22",
                    type: "Workshop",
                    attended: true,
                  },
                  {
                    id: 3,
                    title: "Planning Law Seminar",
                    date: "2022-06-10",
                    type: "Seminar",
                    attended: false,
                  },
                ].map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <Calendar className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-gray-500">
                          {event.date} • {event.type}
                        </p>
                      </div>
                    </div>
                    <div>
                      {event.attended ? (
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Attended
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
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
                <h3 className="text-xl font-medium mb-2">CPD Points Summary</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        Current Year (2023)
                      </p>
                      <p className="text-2xl font-bold">15 / 20 Points</p>
                    </div>
                    <div className="w-24 h-24 rounded-full border-8 border-blue-500 flex items-center justify-center">
                      <span className="text-xl font-bold">75%</span>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-medium mb-4">CPD Activities</h3>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    activity: "Urban Planning Conference",
                    date: "2022-10-15",
                    points: 5,
                  },
                  {
                    id: 2,
                    activity: "Sustainable Development Workshop",
                    date: "2022-08-22",
                    points: 3,
                  },
                  {
                    id: 3,
                    activity: "Planning Journal Publication",
                    date: "2022-07-05",
                    points: 7,
                  },
                ].map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <Calendar className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{activity.activity}</h4>
                        <p className="text-sm text-gray-500">{activity.date}</p>
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Notifications</h1>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg ${notification.read ? "bg-white border" : "bg-blue-50 border-blue-100 border"}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-full ${notification.read ? "bg-gray-100" : "bg-blue-100"}`}
                  >
                    <Bell
                      className={`h-5 w-5 ${notification.read ? "text-gray-500" : "text-blue-500"}`}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {notification.date}
                    </p>
                    <p className="text-sm mt-2">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                    {!notification.read && (
                      <button className="text-sm text-blue-600 hover:underline mt-2">
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const MessagesSection = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row h-[600px] border rounded-lg overflow-hidden">
            {/* Messages list */}
            <div className="w-full md:w-1/3 border-r">
              <div className="p-4 border-b">
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="overflow-y-auto h-[calc(600px-64px)]">
                {[
                  {
                    id: 1,
                    sender: "ZIP Admin",
                    preview: "Your membership renewal...",
                    time: "10:30 AM",
                    unread: true,
                  },
                  {
                    id: 2,
                    sender: "Events Committee",
                    preview: "Regarding the upcoming workshop...",
                    time: "Yesterday",
                    unread: false,
                  },
                  {
                    id: 3,
                    sender: "Membership Officer",
                    preview: "Your documents have been...",
                    time: "Aug 15",
                    unread: false,
                  },
                ].map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${message.unread ? "bg-blue-50" : ""}`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{message.sender}</h4>
                      <span className="text-xs text-gray-500">
                        {message.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {message.preview}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Message content */}
            <div className="w-full md:w-2/3 flex flex-col">
              <div className="p-4 border-b">
                <h3 className="font-medium">ZIP Admin</h3>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
                      <p className="text-sm">
                        Hello John, this is a reminder that your membership will
                        expire in 30 days. Please renew to maintain your active
                        status.
                      </p>
                      <span className="text-xs text-gray-500 mt-1 block">
                        10:30 AM
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-blue-100 p-3 rounded-lg max-w-[80%]">
                      <p className="text-sm">
                        Thank you for the reminder. I'll process the renewal
                        this week.
                      </p>
                      <span className="text-xs text-gray-500 mt-1 block">
                        10:32 AM
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
                      <p className="text-sm">
                        Great! Let me know if you need any assistance with the
                        payment process.
                      </p>
                      <span className="text-xs text-gray-500 mt-1 block">
                        10:35 AM
                      </span>
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
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SettingsSection = () => (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
      <Tabs defaultValue="account">
        <TabsList className="mb-6">
          <TabsTrigger value="account">Account Settings</TabsTrigger>
          <TabsTrigger value="notifications">
            Notification Preferences
          </TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-medium mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded-md"
                    value="john.doe@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full p-2 border rounded-md"
                    value="+260 97 1234567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language Preference
                  </label>
                  <select className="w-full p-2 border rounded-md">
                    <option>English</option>
                    <option>French</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
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
              <h3 className="text-xl font-medium mb-4">
                Notification Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-500">
                      Receive notifications via email
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="email-notifications"
                      className="mr-2"
                      checked
                    />
                    <label htmlFor="email-notifications">Enabled</label>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-sm text-gray-500">
                      Receive notifications via SMS
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sms-notifications"
                      className="mr-2"
                    />
                    <label htmlFor="sms-notifications">Disabled</label>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium">Payment Reminders</h4>
                    <p className="text-sm text-gray-500">
                      Receive reminders about upcoming payments
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="payment-reminders"
                      className="mr-2"
                      checked
                    />
                    <label htmlFor="payment-reminders">Enabled</label>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium">Event Notifications</h4>
                    <p className="text-sm text-gray-500">
                      Receive notifications about upcoming events
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="event-notifications"
                      className="mr-2"
                      checked
                    />
                    <label htmlFor="event-notifications">Enabled</label>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
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
              <h3 className="text-xl font-medium mb-4">Privacy & Security</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Change Password</h4>
                  <div className="space-y-3">
                    <input
                      type="password"
                      className="w-full p-2 border rounded-md"
                      placeholder="Current Password"
                    />
                    <input
                      type="password"
                      className="w-full p-2 border rounded-md"
                      placeholder="New Password"
                    />
                    <input
                      type="password"
                      className="w-full p-2 border rounded-md"
                      placeholder="Confirm New Password"
                    />
                  </div>
                  <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Update Password
                  </button>
                </div>
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium mb-2">Profile Visibility</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <h5 className="font-medium">Public Profile</h5>
                        <p className="text-sm text-gray-500">
                          Allow your profile to be visible in the public
                          directory
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="public-profile"
                          className="mr-2"
                          checked
                        />
                        <label htmlFor="public-profile">Enabled</label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <h5 className="font-medium">Contact Information</h5>
                        <p className="text-sm text-gray-500">
                          Show your contact information to other members
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="contact-info"
                          className="mr-2"
                        />
                        <label htmlFor="contact-info">Disabled</label>
                      </div>
                    </div>
                  </div>
                  <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
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
      case "dashboard":
        return (
          <DashboardOverview
            memberName={userName}
            membershipStatus={
              membershipStatus as "Active" | "Pending" | "Expired"
            }
            membershipType={membershipType}
            membershipExpiry={membershipExpiry}
            notifications={notifications}
            upcomingEvents={upcomingEvents}
            paymentHistory={paymentHistory}
          />
        );
      case "profile":
        return <ProfileSection />;
      case "payments":
        return <PaymentsSection />;
      case "documents":
        return <DocumentsSection />;
      case "events":
        return <EventsSection />;
      case "notifications":
        return <NotificationsSection />;
      case "messages":
        return <MessagesSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        activePage={currentPage}
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
