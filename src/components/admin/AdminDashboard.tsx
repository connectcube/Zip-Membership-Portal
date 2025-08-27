import React from "react";
import { Download, FileText, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminDashboard = () => {
  // Sample data for mentors
  const mentors = [
    {
      id: "M001",
      name: "John Doe",
      email: "john.doe@example.com",
      specialization: "Spatial Planning",
      experience: "10 years",
      mentees: "5",
      status: "Available",
    },
    {
      id: "M002",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      specialization: "Socio-economic Planning",
      experience: "8 years",
      mentees: "3",
      status: "Unavailable",
    },
    {
      id: "M003",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      specialization: "Environmental Planning",
      experience: "12 years",
      mentees: "7",
      status: "Available",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button>Add New Member</Button>
        </div>

        <Tabs defaultValue="members">
          <TabsList className="mb-4">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="mentors">Mentors</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Member Management</CardTitle>
                <CardDescription>
                  View and manage all registered members
                </CardDescription>
              </CardHeader>
              <CardContent>{/* Member management content */}</CardContent>
            </Card>
          </TabsContent>

          {/* Mentors Tab */}
          <TabsContent value="mentors">
            <Card>
              <CardHeader>
                <CardTitle>Mentor Management</CardTitle>
                <CardDescription>
                  View and manage all registered mentors
                </CardDescription>
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
                      {mentors.map((mentor) => (
                        <TableRow key={mentor.id}>
                          <TableCell className="font-medium">
                            {mentor.id}
                          </TableCell>
                          <TableCell>{mentor.name}</TableCell>
                          <TableCell>{mentor.email}</TableCell>
                          <TableCell>{mentor.specialization}</TableCell>
                          <TableCell>{mentor.experience}</TableCell>
                          <TableCell>{mentor.mentees}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                mentor.status === "Available"
                                  ? "default"
                                  : "secondary"
                              }
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
                <CardDescription>
                  Send notifications and announcements to members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notification Type
                    </label>
                    <Select defaultValue="membership">
                      <SelectTrigger>
                        <SelectValue placeholder="Select notification type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="membership">
                          Membership Fees
                        </SelectItem>
                        <SelectItem value="renewal">
                          Membership Renewal
                        </SelectItem>
                        <SelectItem value="event">
                          Event Announcement
                        </SelectItem>
                        <SelectItem value="general">
                          General Announcement
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipients
                    </label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipients" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Members</SelectItem>
                        <SelectItem value="active">
                          Active Members Only
                        </SelectItem>
                        <SelectItem value="expired">
                          Expired Memberships
                        </SelectItem>
                        <SelectItem value="spatial">
                          Spatial Planning Specialists
                        </SelectItem>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <Input placeholder="Enter notification subject" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      className="w-full p-2 border rounded-md min-h-[200px]"
                      placeholder="Enter your message here..."
                    ></textarea>
                  </div>

                  <div className="border p-4 rounded-md bg-blue-50">
                    <h3 className="font-medium text-blue-800 mb-2">
                      Membership Categories and Fees
                    </h3>
                    <p className="text-sm text-blue-700 mb-2">
                      Include the following information in your notification:
                    </p>
                    <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
                      <li>Student Member: K500 per year</li>
                      <li>Associate Member: K1,000 per year</li>
                      <li>Full Member: K1,500 per year</li>
                      <li>Fellow: K2,000 per year</li>
                      <li>Corporate Member: K5,000 per year</li>
                    </ul>
                    <Button className="mt-3" variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" /> Insert Fee Template
                    </Button>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button variant="outline">Preview</Button>
                    <Button>
                      <Mail className="h-4 w-4 mr-2" /> Send Notification
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Membership Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                        <p className="text-gray-500">
                          Membership distribution chart
                        </p>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" /> Download Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Membership Duration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                        <p className="text-gray-500">
                          Membership duration chart
                        </p>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" /> Download Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Geographic Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                        <p className="text-gray-500">
                          Geographic distribution chart
                        </p>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" /> Download Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Specialization Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                        <p className="text-gray-500">
                          Specialization distribution chart
                        </p>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" /> Download Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Custom Report</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Report Type
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="members">Member List</SelectItem>
                          <SelectItem value="payments">
                            Payment History
                          </SelectItem>
                          <SelectItem value="applications">
                            Applications
                          </SelectItem>
                          <SelectItem value="mentorship">
                            Mentorship Program
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date Range
                      </label>
                      <div className="flex gap-2">
                        <Input type="date" className="flex-1" />
                        <Input type="date" className="flex-1" />
                      </div>
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full">
                        <Download className="h-4 w-4 mr-2" /> Generate Report
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
