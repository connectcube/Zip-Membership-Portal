import React, { useEffect, useState } from 'react';
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
import formatTimestamp from '@/lib/formatTimestamp';
import { membershipServices } from '@/lib/memberShipHelpers';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { fireDataBase } from '@/lib/firebase';

interface DashboardOverviewProps {
  paymentHistory?: Array<{
    id: string;
    description: string;
    amount: string;
    date: string;
    status: 'Paid' | 'Pending' | 'Failed';
  }>;
  userId: string;
  setCurrentPage: (page: string) => void;
}
const countNotifications = notifications => {
  let count = 0;
  notifications.forEach(notification => {
    notification.isRead ? null : count++;
  });
  return count;
};
const DashboardOverview = ({
  paymentHistory = [],
  userId,
  setCurrentPage,
}: DashboardOverviewProps) => {
  const { user, notificationCount, setNotificationCount } = useUserStore();
  const [notifications, setNotifications] = useState([]);
  const [isLoadingnotification, setIsLoadingNotification] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isLoadingupcomingEvents, setIsLoadingUpcomingEvents] = useState(true);
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
  const fetchNotifications = async () => {
    try {
      const notifRef = doc(fireDataBase, 'notifications', userId);
      const notifSnap = await getDoc(notifRef);
      if (notifSnap.exists()) {
        const notifData = notifSnap.data();
        setNotifications(notifData.notifications);

        setIsLoadingNotification(false);
        const count = countNotifications(notifData.notifications);
        setNotificationCount(count);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };
  const fetchEvents = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const eventsRef = doc(fireDataBase, 'events', `${currentYear}`);
      const snap = await getDoc(eventsRef);
      if (snap.exists()) {
        const data = snap.data();
        const events = data.eventsList || [];
        const now = new Date();

        setUpcomingEvents(events.filter(e => e.date.toDate() >= now));
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setIsLoadingUpcomingEvents(false);
    }
  };
  useEffect(() => {
    fetchEvents();
    fetchNotifications();
  }, [userId]);

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
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Membership Status</span>
                <Badge
                  variant={
                    user.profile.membershipInfo.isActive
                      ? 'default'
                      : user.profile.membershipInfo.status === 'Pending'
                      ? 'secondary'
                      : 'destructive'
                  }
                >
                  {user.profile.membershipInfo.isActive ? 'Active' : 'Inactive'}
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
                    {formatTimestamp(user.profile.membershipInfo.membershipExpiry, 'long')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-sm">Remaining days:</span>
                  <span className="text-sm">
                    {membershipServices.calculateRemainingDays(
                      user.profile.membershipInfo.startDate,
                      user.profile.membershipInfo.membershipExpiry
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </div>
          <CardFooter className="place-self-end w-full">
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
              <Badge variant="secondary">{notifications.filter(n => !n.isRead).length} New</Badge>
            </CardTitle>
            <CardDescription>Recent updates and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoadingnotification ? (
                // Skeleton for loading notifications
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-gray-100 p-3 rounded-lg animate-pulse"
                  >
                    <div className="bg-gray-300 mt-1.5 rounded-full w-5 h-5" />
                    <div className="flex-1 space-y-2">
                      <div className="bg-gray-300 rounded w-3/4 h-4"></div>
                      <div className="bg-gray-200 rounded w-1/2 h-3"></div>
                    </div>
                  </div>
                ))
              ) : notifications.length > 0 ? (
                notifications.slice(0, 3).map((notification, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      notification.isRead ? 'bg-gray-50' : 'bg-blue-50'
                    } flex items-start gap-3`}
                  >
                    {notification.isRead ? (
                      <CheckCircle className="mt-0.5 w-5 h-5 text-gray-400" />
                    ) : (
                      <Bell className="mt-0.5 w-5 h-5 text-blue-500" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{notification.message}</p>
                      <p className="text-gray-500 text-xs">
                        {formatTimestamp(notification.sentAt)}
                      </p>
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
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setCurrentPage('notifications')}
              >
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
              {isLoadingupcomingEvents ? (
                // Skeleton for loading events
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-3 border rounded-lg animate-pulse"
                  >
                    <div className="bg-gray-200 p-3 rounded-lg w-12 h-12" />
                    <div className="flex-1 space-y-2">
                      <div className="bg-gray-300 rounded w-3/4 h-4"></div>
                      <div className="bg-gray-200 rounded w-1/2 h-3"></div>
                    </div>
                  </div>
                ))
              ) : upcomingEvents.length > 0 ? (
                upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-start gap-4 p-3 border rounded-lg">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <div className="flex justify-between mt-1">
                        <p className="text-gray-500 text-xs">
                          {formatTimestamp(event.date, 'long')}
                        </p>
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
              <Button variant="outline" className="w-full" onClick={() => setCurrentPage('events')}>
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
