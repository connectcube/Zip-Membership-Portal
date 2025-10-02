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
import { set } from 'date-fns';
import MembersManagement from './components/MembersManagement';
import NotificationManagement from './components/NotificationManagement';
import EventsManagement from './components/EventsManagement';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      const docs = await getDocs(collection(fireDataBase, 'users'));
      setAllUser(docs.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
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
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <MembersManagement
            allUser={allUser}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            fetchAllUser={fetchAllUsers}
          />
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
          <NotificationManagement allUsers={allUser} />
          {/* Events Tab */}
          <EventsManagement />
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
