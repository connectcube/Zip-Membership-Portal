import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useUserStore } from '@/lib/zustand';

interface NotificationItemProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
}

const NotificationItem = ({ id, title, description, checked }: NotificationItemProps) => (
  <div className="flex justify-between items-center p-3 border rounded-md">
    <div>
      <h4 className="font-medium">{title}</h4>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
    <div className="flex items-center space-x-2">
      <Checkbox id={id} checked={checked} />
      <Label htmlFor={id}>{checked ? 'Enabled' : 'Disabled'}</Label>
    </div>
  </div>
);

interface PrivacyItemProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
}

const PrivacyItem = ({ id, title, description, checked }: PrivacyItemProps) => (
  <div className="flex justify-between items-center p-3 border rounded-md">
    <div>
      <h5 className="font-medium">{title}</h5>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
    <div className="flex items-center space-x-2">
      <Checkbox id={id} checked={checked} />
      <Label htmlFor={id}>{checked ? 'Enabled' : 'Disabled'}</Label>
    </div>
  </div>
);

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
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || 'john.doe@example.com'}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={user.profile.phone || 'N/A'}
                  />
                </div>
                <div>
                  <Label htmlFor="language">Language Preference</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="English" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
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
                <NotificationItem
                  id="email-notifications"
                  title="Email Notifications"
                  description="Receive notifications via email"
                  checked={true}
                />
                <NotificationItem
                  id="sms-notifications"
                  title="SMS Notifications"
                  description="Receive notifications via SMS"
                  checked={false}
                />
                <NotificationItem
                  id="payment-reminders"
                  title="Payment Reminders"
                  description="Receive reminders about upcoming payments"
                  checked={true}
                />
                <NotificationItem
                  id="event-notifications"
                  title="Event Notifications"
                  description="Receive notifications about upcoming events"
                  checked={true}
                />
                <div className="flex justify-end">
                  <Button>Save Preferences</Button>
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
                    <Input type="password" placeholder="Current Password" />
                    <Input type="password" placeholder="New Password" />
                    <Input type="password" placeholder="Confirm New Password" />
                  </div>
                  <Button className="mt-3">Update Password</Button>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <h4 className="mb-2 font-medium">Profile Visibility</h4>
                  <div className="space-y-3">
                    <PrivacyItem
                      id="public-profile"
                      title="Public Profile"
                      description="Allow your profile to be visible in the public directory"
                      checked={true}
                    />
                    <PrivacyItem
                      id="contact-info"
                      title="Contact Information"
                      description="Show your contact information to other members"
                      checked={false}
                    />
                  </div>
                  <Button className="mt-3">Save Privacy Settings</Button>
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
