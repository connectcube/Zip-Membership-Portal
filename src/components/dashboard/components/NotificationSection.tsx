import { Card, CardContent } from '@/components/ui/card';
import { Bell } from 'lucide-react';

const NotificationsSection = ({ notifications = [] }) => (
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
                      className={`h-5 w-5 ${notification.read ? 'text-gray-500' : 'text-blue-500'}`}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="mt-1 text-gray-500 text-sm">{notification.date}</p>
                    <p className="mt-2 text-sm">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua.
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
export default NotificationsSection;
