import React, { useEffect, useMemo, useState } from 'react';
import { Download, FileText, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUserStore } from '@/lib/zustand';
import LoginForm from '../auth/LoginForm';
import * as z from 'zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, fireDataBase } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import AdminLogin from './auth/AdminLogin';
import AdminSignup from './auth/AdminSignup';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
const AdminDashboard = () => {
  const { user, setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  const handleStateUpdate = async data => {
    try {
      setIsLoading(true);
      console.log('User data from login/signup:', data);
      const checkAdminPrivileges = (email: string | null) => {
        const adminEmails = [
          'registrar@zambiainstituteofplanners.org.zm',
          'busikusm@gmail.com',
          'linda@realtyplus.co.zm',
          'mohd@landlord.com',
        ]; // Replace with your admin email list
        return adminEmails.includes(email);
      };
      // 3. Trigger success callback with full user data
      setUser({
        isAdmin: data.isAdmin || checkAdminPrivileges(data.email),
        uid: data.uid,
        email: data.email,
        rememberMe: data.rememberMe,
        profile: data.profile,
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Login failed:', error);
      // Optionally show toast or error feedback
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center bg-gray-50 w-[100svw] h-[100svh]">
        <div className="w-1/3">
          {activeTab === 'login' ? (
            <AdminLogin handleStateUpdate={handleStateUpdate} setActiveTab={setActiveTab} />
          ) : (
            <AdminSignup handleStateUpdate={handleStateUpdate} setActiveTab={setActiveTab} />
          )}
        </div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="flex flex-col justify-center items-center bg-gray-50 w-[100svw] h-[100svh]">
        <div className="w-1/3">
          <AdminLogin handleStateUpdate={handleStateUpdate} setActiveTab={setActiveTab} />
        </div>
        <div className="mt-4 w-1/3">
          <div className="flex items-start gap-3 bg-red-50 shadow-sm p-4 border border-red-300 rounded-xl text-red-700 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0 mt-0.5 w-5 h-5 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 
           0 1.918-.816 1.995-1.85l.007-.15V7.999c0-1.054-.816-1.918-1.85-1.995L18.918 6H5.082c-1.054 
           0-1.918.816-1.995 1.85L3.08 8v10.001c0 1.054.816 1.918 1.85 1.995L5.082 20z"
              />
            </svg>

            <div className="flex-1">
              <p className="font-medium">Access Denied</p>
              <p className="mt-1">
                The entered user does not have admin privileges. Please check your credentials and
                try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <MainDashboard />;
};

const MainDashboard = () => {
  const [allUser, setAllUser] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const docs = await getDocs(collection(fireDataBase, 'users'));
        setAllUser(docs.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchAllUsers();
  }, []);

  // --- Aggregations ---
  const membershipDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    allUser.forEach(u => {
      const type = u?.membershipInfo?.membershipType || 'Unknown';
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [allUser]);

  const specializationDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    allUser.forEach(u => {
      const spec = u?.membershipInfo?.specialization || 'Unknown';
      counts[spec] = (counts[spec] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [allUser]);

  const geographicDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    allUser.forEach(u => {
      const province = u?.province || 'Unknown';
      counts[province] = (counts[province] || 0) + 1;
    });
    return Object.entries(counts).map(([province, members]) => ({ province, members }));
  }, [allUser]);

  const membershipDuration = useMemo(() => {
    const counts: Record<string, number> = {};
    allUser.forEach(u => {
      const year = u?.professionalInfo?.graduationYear || 'Unknown';
      counts[year] = (counts[year] || 0) + 1;
    });
    return Object.entries(counts).map(([year, members]) => ({ year, members }));
  }, [allUser]);

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-bold text-2xl">Admin Dashboard</h1>
          <Button>Add New Member</Button>
        </div>

        <Tabs defaultValue="members">
          <TabsList className="mb-4">
            <TabsTrigger value="members">Members</TabsTrigger>
            {/* <TabsTrigger value="mentors">Mentors</TabsTrigger> */}
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Member Management</CardTitle>
                <CardDescription>View and manage all registered members</CardDescription>
              </CardHeader>

              <CardContent>
                {allUser.length > 0 ? (
                  <div className="space-y-6">
                    {allUser.map(user => (
                      <div
                        key={user.id}
                        className="gap-6 grid grid-cols-1 md:grid-cols-2 bg-white shadow-sm p-4 border rounded-lg"
                      >
                        <div>
                          <h2 className="font-semibold text-xl">
                            {user.firstName} {user.middleName} {user.lastName}
                          </h2>
                          <p className="text-gray-500 text-sm">
                            Membership #: {user.membershipNumber}
                          </p>
                          <p className="mt-2 text-gray-700">📍 {user.address}</p>
                          <p className="text-gray-700">📞 {user.phone}</p>
                          <p className="text-gray-700">📧 {user.email}</p>
                          <p className="text-gray-700">🗓️ Joined: {user.dateJoined}</p>
                        </div>

                        <div>
                          <h3 className="font-medium text-gray-800">Membership Info</h3>
                          <p className="text-gray-600 text-sm">
                            Type: {user.membershipInfo.membershipType}
                          </p>
                          <p className="text-gray-600 text-sm">
                            Specialization: {user.membershipInfo.specialization}
                          </p>
                          <p className="mt-2 text-gray-700 text-sm italic">
                            “{user.membershipInfo.bio}”
                          </p>

                          <h3 className="mt-4 font-medium text-gray-800">Professional Info</h3>
                          <ul className="space-y-1 text-gray-600 text-sm">
                            <li>🏢 Employer: {user.professionalInfo.currentEmployer}</li>
                            <li>🎓 Institution: {user.professionalInfo.institution}</li>
                            <li>📅 Graduation Year: {user.professionalInfo.graduationYear}</li>
                            <li>🧠 Specialization: {user.professionalInfo.specialization}</li>
                            <li>🧪 Experience: {user.professionalInfo.experience} years</li>
                          </ul>
                        </div>

                        <div className="col-span-2">
                          <h3 className="mb-2 font-medium text-gray-800">Documents</h3>
                          <div className="gap-4 grid grid-cols-2 text-blue-600 text-sm">
                            <a
                              href={user.documents.cvURL}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              📄 CV
                            </a>
                            {user.documents.idCopyURL ? (
                              <a
                                href={user.documents.idCopyURL}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                🪪 ID Copy
                              </a>
                            ) : (
                              <span className="text-gray-400">🪪 ID Copy: Not uploaded</span>
                            )}
                            <a
                              href={user.documents.qualificationCertificateURL}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              🎓 Qualification Certificate
                            </a>
                            <a
                              href={user.documents.professionalReferencesURL}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              📁 Professional References
                            </a>
                            <a
                              href={user.documents.passportPhotoURL}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              🖼️ Passport Photo
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>No data available</>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mentors Tab */}
          <TabsContent value="mentors">
            <Card>
              <CardHeader>
                <CardTitle>Mentor Management</CardTitle>
                <CardDescription>View and manage all registered mentors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Specialization</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Mentees</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[].map(mentor => (
                        <TableRow key={mentor.id}>
                          <TableCell className="font-medium">{mentor.id}</TableCell>
                          <TableCell>{mentor.name}</TableCell>
                          <TableCell>{mentor.email}</TableCell>
                          <TableCell>{mentor.specialization}</TableCell>
                          <TableCell>{mentor.experience}</TableCell>
                          <TableCell>{mentor.mentees}</TableCell>
                          <TableCell>
                            <Badge
                              variant={mentor.status === 'Available' ? 'default' : 'secondary'}
                            >
                              {mentor.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                View Mentees
                              </Button>
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Send Notifications</CardTitle>
                <CardDescription>Send notifications and announcements to members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      Notification Type
                    </label>
                    <Select defaultValue="membership">
                      <SelectTrigger>
                        <SelectValue placeholder="Select notification type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="membership">Membership Fees</SelectItem>
                        <SelectItem value="renewal">Membership Renewal</SelectItem>
                        <SelectItem value="event">Event Announcement</SelectItem>
                        <SelectItem value="general">General Announcement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      Recipients
                    </label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipients" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Members</SelectItem>
                        <SelectItem value="active">Active Members Only</SelectItem>
                        <SelectItem value="expired">Expired Memberships</SelectItem>
                        <SelectItem value="spatial">Spatial Planning Specialists</SelectItem>
                        <SelectItem value="socioeconomic">
                          Socio-economic Planning Specialists
                        </SelectItem>
                        <SelectItem value="environmental">
                          Environmental Planning Specialists
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700 text-sm">Subject</label>
                    <Input placeholder="Enter notification subject" />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700 text-sm">Message</label>
                    <textarea
                      className="p-2 border rounded-md w-full min-h-[200px]"
                      placeholder="Enter your message here..."
                    ></textarea>
                  </div>

                  <div className="bg-blue-50 p-4 border rounded-md">
                    <h3 className="mb-2 font-medium text-blue-800">
                      Membership Categories and Fees
                    </h3>
                    <p className="mb-2 text-blue-700 text-sm">
                      Include the following information in your notification:
                    </p>
                    <ul className="space-y-1 pl-5 text-blue-700 text-sm list-disc">
                      <li>Student Member: K500 per year</li>
                      <li>Associate Member: K1,000 per year</li>
                      <li>Full Member: K1,500 per year</li>
                      <li>Fellow: K2,000 per year</li>
                      <li>Corporate Member: K5,000 per year</li>
                    </ul>
                    <Button className="mt-3" variant="outline" size="sm">
                      <FileText className="mr-2 w-4 h-4" /> Insert Fee Template
                    </Button>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button variant="outline">Preview</Button>
                    <Button>
                      <Mail className="mr-2 w-4 h-4" /> Send Notification
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>
                  Generate and download reports about membership data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                  {/* Membership Distribution (Pie) */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Membership Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={membershipDistribution}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            label
                          >
                            {membershipDistribution.map((_, i) => (
                              <Cell
                                key={i}
                                fill={
                                  ['#3b82f6', '#22c55e', '#f97316', '#a855f7', '#ef4444'][i % 5]
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Geographic Distribution (Bar) */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Geographic Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={geographicDistribution}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="province" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="members" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Membership Duration (Bar) */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Membership Duration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={membershipDuration}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="members" fill="#22c55e" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Specialization Distribution (Pie) */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Specialization Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={specializationDistribution}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            label
                          >
                            {specializationDistribution.map((_, i) => (
                              <Cell
                                key={i}
                                fill={
                                  ['#f97316', '#06b6d4', '#84cc16', '#a855f7', '#ef4444'][i % 5]
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <h3 className="mb-4 font-medium text-lg">Custom Report</h3>
                  <div className="gap-4 grid grid-cols-1 md:grid-cols-3 mb-4">
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 text-sm">
                        Report Type
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="members">Member List</SelectItem>
                          <SelectItem value="payments">Payment History</SelectItem>
                          <SelectItem value="applications">Applications</SelectItem>
                          <SelectItem value="mentorship">Mentorship Program</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700 text-sm">
                        Date Range
                      </label>
                      <div className="flex gap-2">
                        <Input type="date" className="flex-1" />
                        <Input type="date" className="flex-1" />
                      </div>
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full">
                        <Download className="mr-2 w-4 h-4" /> Generate Report
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
