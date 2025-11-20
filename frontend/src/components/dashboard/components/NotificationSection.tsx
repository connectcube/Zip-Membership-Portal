import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Trash2, CheckCircle2 } from 'lucide-react';
import { doc, updateDoc, arrayRemove, arrayUnion, getDoc } from 'firebase/firestore';
import { fireDataBase } from '@/lib/firebase';
import { Timestamp } from 'firebase/firestore';
import { useUserStore } from '@/lib/zustand';

// Notification type based on our backend implementation
type NotificationItem = {
  notificationType: 'membership' | 'renewal' | 'event' | 'general';
  subject: string;
  message: string;
  sentAt: Timestamp;
  isRead: boolean;
};

interface NotificationsSectionProps {
  userId: string;
}
const countNotifications = notifications => {
  let count = 0;
  notifications.forEach(notification => {
    notification.isRead ? null : count++;
  });
  return count;
};
const NotificationsSection = ({ userId }: NotificationsSectionProps) => {
  const { setNotificationCount, notificationCount } = useUserStore();
  const [localNotifications, setLocalNotifications] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotification] = useState(true);
  const notifRef = doc(fireDataBase, 'notifications', userId);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifSnap = await getDoc(notifRef);
        if (notifSnap.exists()) {
          const notifData = notifSnap.data();
          setLocalNotifications(notifData.notifications);

          setIsLoadingNotification(false);
          const count = countNotifications(notifData.notifications);
          setNotificationCount(count);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchNotifications();
  }, []);
  // Mark notification as read/unread
  const toggleRead = async (notification: NotificationItem) => {
    try {
      // Remove old version
      await updateDoc(notifRef, {
        notifications: arrayRemove(notification),
      });

      // Add updated version
      await updateDoc(notifRef, {
        notifications: arrayUnion({ ...notification, isRead: !notification.isRead }),
      });
      //Update zustand store
      setNotificationCount(!notification.isRead ? notificationCount - 1 : notificationCount + 1);
      // Update local state
      setLocalNotifications(prev =>
        prev.map(n =>
          n.sentAt.isEqual(notification.sentAt) && n.subject === notification.subject
            ? { ...n, isRead: !n.isRead }
            : n
        )
      );
    } catch (err) {
      console.error('Error updating read status:', err);
    }
  };

  // Delete notification
  const deleteNotification = async (notification: NotificationItem) => {
    try {
      await updateDoc(notifRef, {
        notifications: arrayRemove(notification),
      });

      setLocalNotifications(prev =>
        prev.filter(
          n =>
            !(
              n.sentAt.isEqual(notification.sentAt) &&
              n.subject === notification.subject &&
              n.message === notification.message
            )
        )
      );
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <h1 className="mb-6 font-bold text-gray-900 text-3xl">Notifications</h1>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {isLoadingNotifications ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-gray-100 p-4 border rounded-lg animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-300 rounded-full w-10 h-10" />
                    <div className="flex-1 space-y-2">
                      <div className="bg-gray-300 rounded w-1/3 h-4" />
                      <div className="bg-gray-200 rounded w-1/4 h-3" />
                      <div className="bg-gray-200 rounded w-3/4 h-3" />
                    </div>
                  </div>
                </div>
              ))
            ) : localNotifications.length > 0 ? (
              localNotifications
                .sort((a, b) => b.sentAt.toMillis() - a.sentAt.toMillis()) // newest first
                .map((notification, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg flex flex-col sm:flex-row sm:items-start gap-4 ${
                      notification.isRead ? 'bg-white border' : 'bg-blue-50 border-blue-100 border'
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`p-2 rounded-full ${
                        notification.isRead ? 'bg-gray-100' : 'bg-blue-100'
                      }`}
                    >
                      <Bell
                        className={`h-5 w-5 ${
                          notification.isRead ? 'text-gray-500' : 'text-blue-500'
                        }`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h4 className="font-medium">{notification.subject}</h4>
                      <p className="mt-1 text-gray-500 text-sm">
                        {notification.sentAt.toDate().toLocaleString()}
                      </p>
                      <p className="mt-2 text-gray-700 text-sm">{notification.message}</p>

                      {/* Actions */}
                      <div className="flex gap-4 mt-3">
                        <button
                          onClick={() => toggleRead(notification)}
                          className="flex items-center gap-1 text-blue-600 text-sm hover:underline"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          {notification.isRead ? 'Mark as Unread' : 'Mark as Read'}
                        </button>
                        <button
                          onClick={() => deleteNotification(notification)}
                          className="flex items-center gap-1 text-red-600 text-sm hover:underline"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
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
};

export default NotificationsSection;
