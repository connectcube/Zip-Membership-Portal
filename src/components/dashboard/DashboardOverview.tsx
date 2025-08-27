import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Bell,
  Calendar,
  CreditCard,
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
  BarChart3,
} from "lucide-react";

interface DashboardOverviewProps {
  memberName?: string;
  membershipStatus?: "Active" | "Pending" | "Expired";
  membershipType?: string;
  membershipExpiry?: string;
  notifications?: Array<{
    id: string;
    title: string;
    date: string;
    read: boolean;
  }>;
  upcomingEvents?: Array<{
    id: string;
    title: string;
    date: string;
    type: string;
  }>;
  paymentHistory?: Array<{
    id: string;
    description: string;
    amount: string;
    date: string;
    status: "Paid" | "Pending" | "Failed";
  }>;
}

const DashboardOverview = ({
  memberName = "John Doe",
  membershipStatus = "Active",
  membershipType = "Full Member",
  membershipExpiry = "December 31, 2023",
  notifications = [
    {
      id: "1",
      title: "Your membership renewal is due in 30 days",
      date: "2023-11-15",
      read: false,
    },
    {
      id: "2",
      title: "New planning regulations published",
      date: "2023-11-10",
      read: true,
    },
    {
      id: "3",
      title: "AGM scheduled for January 15, 2024",
      date: "2023-11-05",
      read: false,
    },
  ],
  upcomingEvents = [
    {
      id: "1",
      title: "Annual General Meeting",
      date: "2024-01-15",
      type: "Conference",
    },
    {
      id: "2",
      title: "Urban Planning Workshop",
      date: "2023-12-10",
      type: "Workshop",
    },
    {
      id: "3",
      title: "Membership Committee Meeting",
      date: "2023-11-25",
      type: "Meeting",
    },
  ],
  paymentHistory = [
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
  ],
}: DashboardOverviewProps) => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {memberName}
        </h1>
        <p className="text-gray-600 mt-1">
          Here's an overview of your membership and recent activities
        </p>
      </div>

      {/* Membership Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Membership Status</span>
              <Badge
                variant={
                  membershipStatus === "Active"
                    ? "default"
                    : membershipStatus === "Pending"
                      ? "secondary"
                      : "destructive"
                }
              >
                {membershipStatus}
              </Badge>
            </CardTitle>
            <CardDescription>Your current membership details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Type:</span>
                <span className="text-sm">{membershipType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Expires on:</span>
                <span className="text-sm">{membershipExpiry}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Renew Membership</Button>
          </CardFooter>
        </Card>

        {/* Quick Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Your membership at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center p-3 bg-blue-50 rounded-lg">
                <Users className="h-8 w-8 text-blue-500 mb-2" />
                <span className="text-sm font-medium">Member Since</span>
                <span className="text-lg font-bold">2020</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-green-50 rounded-lg">
                <FileText className="h-8 w-8 text-green-500 mb-2" />
                <span className="text-sm font-medium">Documents</span>
                <span className="text-lg font-bold">7</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-purple-50 rounded-lg">
                <Calendar className="h-8 w-8 text-purple-500 mb-2" />
                <span className="text-sm font-medium">Events Attended</span>
                <span className="text-lg font-bold">12</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-yellow-50 rounded-lg">
                <CreditCard className="h-8 w-8 text-yellow-500 mb-2" />
                <span className="text-sm font-medium">Payments</span>
                <span className="text-lg font-bold">5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Notifications</span>
              <Badge variant="secondary">
                {notifications.filter((n) => !n.read).length} New
              </Badge>
            </CardTitle>
            <CardDescription>Recent updates and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg ${notification.read ? "bg-gray-50" : "bg-blue-50"} flex items-start gap-3`}
                >
                  {notification.read ? (
                    <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                  ) : (
                    <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-gray-500">{notification.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Notifications
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Events and meetings you might be interested in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-3 border rounded-lg"
                >
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{event.title}</h4>
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-500">{event.date}</p>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Events
            </Button>
          </CardFooter>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>
              Your payment history and upcoming dues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-start gap-4 p-3 border rounded-lg"
                >
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="text-sm font-medium">
                        {payment.description}
                      </h4>
                      <span className="text-sm font-bold">
                        {payment.amount}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-500">{payment.date}</p>
                      <Badge
                        variant={
                          payment.status === "Paid"
                            ? "default"
                            : payment.status === "Pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-xs"
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Payment History
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Upload Documents
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          View Reports
        </Button>
        <Button variant="secondary" className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Request Support
        </Button>
      </div>
    </div>
  );
};

export default DashboardOverview;
