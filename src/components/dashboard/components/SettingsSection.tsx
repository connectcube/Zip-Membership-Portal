import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserStore } from '@/lib/zustand';

const SettingsSection = () => {
  const { user } = useUserStore();
  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <h1 className="mb-6 font-bold text-gray-900 text-3xl">Settings</h1>
      <Tabs defaultValue="account">
        <TabsList className="mb-6">
          <TabsTrigger value="account">Account Settings</TabsTrigger>
          {/*<TabsTrigger value="notifications">Notification Preferences</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>*/}
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 font-medium text-xl">Account Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="p-2 border rounded-md w-full"
                    value={user.email || 'john.doe@example.com'}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="p-2 border rounded-md w-full"
                    value={user.profile.phone || 'N/A'}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">
                    Language Preference
                  </label>
                  <select className="p-2 border rounded-md w-full">
                    <option>English</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition-colors">
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
              <h3 className="mb-4 font-medium text-xl">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-gray-500 text-sm">Receive notifications via email</p>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="email-notifications" className="mr-2" checked />
                    <label htmlFor="email-notifications">Enabled</label>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-gray-500 text-sm">Receive notifications via SMS</p>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="sms-notifications" className="mr-2" />
                    <label htmlFor="sms-notifications">Disabled</label>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium">Payment Reminders</h4>
                    <p className="text-gray-500 text-sm">
                      Receive reminders about upcoming payments
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="payment-reminders" className="mr-2" checked />
                    <label htmlFor="payment-reminders">Enabled</label>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium">Event Notifications</h4>
                    <p className="text-gray-500 text-sm">
                      Receive notifications about upcoming events
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="event-notifications" className="mr-2" checked />
                    <label htmlFor="event-notifications">Enabled</label>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition-colors">
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
              <h3 className="mb-4 font-medium text-xl">Privacy & Security</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 font-medium">Change Password</h4>
                  <div className="space-y-3">
                    <input
                      type="password"
                      className="p-2 border rounded-md w-full"
                      placeholder="Current Password"
                    />
                    <input
                      type="password"
                      className="p-2 border rounded-md w-full"
                      placeholder="New Password"
                    />
                    <input
                      type="password"
                      className="p-2 border rounded-md w-full"
                      placeholder="Confirm New Password"
                    />
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 mt-3 px-4 py-2 rounded-md text-white transition-colors">
                    Update Password
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <h4 className="mb-2 font-medium">Profile Visibility</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <h5 className="font-medium">Public Profile</h5>
                        <p className="text-gray-500 text-sm">
                          Allow your profile to be visible in the public directory
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="public-profile" className="mr-2" checked />
                        <label htmlFor="public-profile">Enabled</label>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <h5 className="font-medium">Contact Information</h5>
                        <p className="text-gray-500 text-sm">
                          Show your contact information to other members
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="contact-info" className="mr-2" />
                        <label htmlFor="contact-info">Disabled</label>
                      </div>
                    </div>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 mt-3 px-4 py-2 rounded-md text-white transition-colors">
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
};

export default SettingsSection;
