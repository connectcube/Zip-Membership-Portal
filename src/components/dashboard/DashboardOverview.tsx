import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Bell,
  Calendar,
  CreditCard,
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
  BarChart3,
} from 'lucide-react';
import { useUserStore } from '@/lib/zustand';

interface DashboardOverviewProps {
  memberName?: string;
  membershipStatus?: 'Active' | 'Pending' | 'Expired';
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
    status: 'Paid' | 'Pending' | 'Failed';
  }>;
}

const DashboardOverview = ({
  memberName = 'John Doe',
  membershipStatus = 'Active',
  membershipType = 'Full Member',
  membershipExpiry = 'December 31, 2023',
  notifications = [],
  upcomingEvents = [],
  paymentHistory = [],
}: DashboardOverviewProps) => {
  const { user } = useUserStore();

  const getFullMembershipType = value => {
    const typeMap = {
      technician: 'Technician',
      associate: 'Associate',
      full: 'Full Member',
      fellow: 'Fellow',
      student: 'Student Chapter',
      postgrad: 'Post Grad.',
      'planning-firms': 'Planning Firms',
      'educational-ngo': 'Educational/Research Institutions or NGO',
    };

    return typeMap[value] || 'Unknown Type';
  };
  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="font-bold text-gray-900 text-3xl">
          Welcome,{' '}
          {user.profile.firstName + ' ' + user.profile.middleName + ' ' + user.profile.lastName ||
            ''}
        </h1>
        <p className="mt-1 text-gray-600">
          Here's an overview of your membership and recent activities
        </p>
      </div>

      {/* Membership Status Card */}
      <div className="gap-6 grid grid-cols-1 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Membership Status</span>
              <Badge
                variant={
                  user.profile.membershipInfo.membershipStatus === 'Active'
                    ? 'default'
                    : membershipStatus === 'Pending'
                    ? 'secondary'
                    : 'destructive'
                }
              >
                {user.profile.membershipInfo.membershipStatus ? 'Active' : 'Inactive'}
              </Badge>
            </CardTitle>
            <CardDescription>Your current membership details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-sm">Type:</span>
                <span className="text-sm">
                  {getFullMembershipType(user.profile.membershipInfo.membershipType)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-sm">Expires on:</span>
                <span className="text-sm">
                  {user.profile.membershipInfo.membershipExpiry || 'N/A'}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="place-self-end w-full">Renew Membership</Button>
          </CardFooter>
        </Card>

        {/* Quick Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Your membership at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="gap-4 grid grid-cols-2">
              <div className="flex flex-col justify-center items-center bg-blue-50 p-3 rounded-lg">
                <Users className="mb-2 w-8 h-8 text-blue-500" />
                <span className="font-medium text-sm">Member Since</span>
                <span className="font-bold text-lg">{user.profile.dateJoined || 'N/A'}</span>
              </div>
              <div className="flex flex-col justify-center items-center bg-green-50 p-3 rounded-lg">
                <FileText className="mb-2 w-8 h-8 text-green-500" />
                <span className="font-medium text-sm">Documents</span>
                <span className="font-bold text-lg">
                  {Object.entries(user.profile.documents).length || 0}
                </span>
              </div>
              <div className="flex flex-col justify-center items-center bg-purple-50 p-3 rounded-lg">
                <Calendar className="mb-2 w-8 h-8 text-purple-500" />
                <span className="font-medium text-sm">Events Attended</span>
                <span className="font-bold text-lg">0</span>
              </div>
              <div className="flex flex-col justify-center items-center bg-yellow-50 p-3 rounded-lg">
                <CreditCard className="mb-2 w-8 h-8 text-yellow-500" />
                <span className="font-medium text-sm">Payments</span>
                <span className="font-bold text-lg">0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Notifications</span>
              <Badge variant="secondary">{notifications.filter(n => !n.read).length} New</Badge>
            </CardTitle>
            <CardDescription>Recent updates and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.slice(0, 3).map(notification => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg ${
                      notification.read ? 'bg-gray-50' : 'bg-blue-50'
                    } flex items-start gap-3`}
                  >
                    {notification.read ? (
                      <CheckCircle className="mt-0.5 w-5 h-5 text-gray-400" />
                    ) : (
                      <Bell className="mt-0.5 w-5 h-5 text-blue-500" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-gray-500 text-xs">{notification.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-500">No notifications</div>
              )}
            </div>
          </CardContent>
          {notifications.length > 0 && (
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Notifications
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>

      {/* Second Row */}
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events and meetings you might be interested in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-start gap-4 p-3 border rounded-lg">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <div className="flex justify-between mt-1">
                        <p className="text-gray-500 text-xs">{event.date}</p>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-500">No upcoming events</div>
              )}
            </div>
          </CardContent>
          {upcomingEvents.length > 0 && (
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Events
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Your payment history and upcoming dues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentHistory.length > 0 ? (
                paymentHistory.map(payment => (
                  <div key={payment.id} className="flex items-start gap-4 p-3 border rounded-lg">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <CreditCard className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-sm">{payment.description}</h4>
                        <span className="font-bold text-sm">{payment.amount}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <p className="text-gray-500 text-xs">{payment.date}</p>
                        <Badge
                          variant={
                            payment.status === 'Paid'
                              ? 'default'
                              : payment.status === 'Pending'
                              ? 'secondary'
                              : 'destructive'
                          }
                          className="text-xs"
                        >
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-500">No recent payments</div>
              )}
            </div>
          </CardContent>
          {paymentHistory.length > 0 && (
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Payment History
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="gap-4 grid grid-cols-1 md:grid-cols-3 mt-6">
        <Button disabled className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Upload Documents
        </Button>
        <Button disabled variant="outline" className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          View Reports
        </Button>
        <Button disabled variant="secondary" className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Request Support
        </Button>
      </div>
    </div>
  );
};

export default DashboardOverview;
