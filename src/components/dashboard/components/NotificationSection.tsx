import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Trash2, CheckCircle2 } from 'lucide-react';
import { doc, updateDoc, arrayRemove, arrayUnion, getDoc } from 'firebase/firestore';
import { fireDataBase } from '@/lib/firebase';
import { Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';

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

const PAGE_SIZE = 5;

const NotificationsSection = ({ userId }: NotificationsSectionProps) => {
  const [localNotifications, setLocalNotifications] = useState<NotificationItem[]>([]);
  const [isLoadingNotifications, setIsLoadingNotification] = useState(true);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [page, setPage] = useState(1);

  const notifRef = doc(fireDataBase, 'notifications', userId);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifSnap = await getDoc(notifRef);
        if (notifSnap.exists()) {
          const notifData = notifSnap.data();
          setLocalNotifications(notifData.notifications || []);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setIsLoadingNotification(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  // Mark notification as read/unread
  const toggleRead = async (notification: NotificationItem) => {
    try {
      await updateDoc(notifRef, {
        notifications: arrayRemove(notification),
      });

      await updateDoc(notifRef, {
        notifications: arrayUnion({ ...notification, isRead: !notification.isRead }),
      });

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

  // Sorting
  const sortedNotifications = [...localNotifications].sort((a, b) => {
    if (sortOrder === 'newest') {
      return b.sentAt.toMillis() - a.sentAt.toMillis();
    } else {
      return a.sentAt.toMillis() - b.sentAt.toMillis();
    }
  });

  // Pagination
  const startIdx = (page - 1) * PAGE_SIZE;
  const paginatedNotifications = sortedNotifications.slice(startIdx, startIdx + PAGE_SIZE);
  const totalPages = Math.ceil(sortedNotifications.length / PAGE_SIZE);

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-gray-900 text-3xl">Notifications</h1>
        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value as 'newest' | 'oldest')}
          className="px-2 py-1 border rounded-md text-sm"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {isLoadingNotifications ? (
              // Skeletons
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
            ) : paginatedNotifications.length > 0 ? (
              paginatedNotifications.map((notification, idx) => (
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <Button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            variant="outline"
          >
            Previous
          </Button>
          <p className="text-gray-600 text-sm">
            Page {page} of {totalPages}
          </p>
          <Button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationsSection;
