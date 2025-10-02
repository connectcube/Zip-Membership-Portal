import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TabsContent } from '@/components/ui/tabs';
import { FileText, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  collection,
  doc,
  setDoc,
  arrayUnion,
  Timestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { fireDataBase } from '@/lib/firebase'; // your firebase export

type User = {
  id: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  membershipNumber?: string;
  membershipInfo?: {
    membershipType?: string;
    isActive?: boolean;
    // other fields...
  };
  // other fields...
};

const MEMBERSHIP_OPTIONS = [
  { value: 'technician', label: 'Technician' },
  { value: 'associate', label: 'Associate' },
  { value: 'full', label: 'Full Member' },
  { value: 'fellow', label: 'Fellow' },
  { value: 'student', label: 'Student Chapter' },
  { value: 'postgrad', label: 'Post Grad.' },
  { value: 'planning-firms', label: 'Planning Firms' },
  { value: 'educational-ngo', label: 'Educational/Research Institutions or NGO' },
];

export default function NotificationManagement({ allUsers }: { allUsers: User[] }) {
  // Form state
  const [notificationType, setNotificationType] = useState<
    'membership' | 'renewal' | 'event' | 'general'
  >('membership');
  const [recipients, setRecipients] = useState<'all' | 'active' | 'expired' | string>('all'); // string might hold membership-type or 'specific'
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // When recipients === 'specific' admin picks a particular user from dropdown
  const [specificUserId, setSpecificUserId] = useState<string | null>(null);

  // Derived options for UI: user select list (display name + email)
  const userSelectOptions = useMemo(
    () =>
      (allUsers || []).map(u => ({
        label: `${u.firstName || ''} ${u.lastName || ''} ${u.email ? `(${u.email})` : ''}`.trim(),
        value: u.id,
      })),
    [allUsers]
  );

  // Helper: filter users according to recipients selection
  const filterUsers = (): User[] => {
    if (!allUsers || allUsers.length === 0) return [];

    if (recipients === 'all') return allUsers;
    if (recipients === 'active') return allUsers.filter(u => !!u.membershipInfo?.isActive);
    if (recipients === 'expired') return allUsers.filter(u => !u.membershipInfo?.isActive);

    if (recipients === 'specific') {
      if (!specificUserId) return [];
      return allUsers.filter(u => u.id === specificUserId);
    }

    // Otherwise, treat recipients string as membershipType (case-insensitive)
    const normalized = String(recipients).toLowerCase();
    return allUsers.filter(
      u => String(u.membershipInfo?.membershipType || '').toLowerCase() === normalized
    );
  };

  // Main send handler
  const handleSendNotification = async () => {
    if (!subject.trim() || !message.trim()) {
      alert('Please provide subject and message before sending.');
      return;
    }

    const filteredUsers = filterUsers();
    if (filteredUsers.length === 0) {
      alert('No recipients found for the selected filter.');
      return;
    }

    setSending(true);
    try {
      // We'll write in batches to avoid too many network calls.
      // Each user's notification doc path: notifications/{userId}
      // Each user doc updated with notificationDocRef -> doc(fireDataBase, 'notifications', user.id)
      const BATCH_SIZE = 300; // safe chunk (Firestore limit 500 operations per batch)
      for (let i = 0; i < filteredUsers.length; i += BATCH_SIZE) {
        const slice = filteredUsers.slice(i, i + BATCH_SIZE);
        const batch = writeBatch(fireDataBase);

        slice.forEach(user => {
          const notifRef = doc(fireDataBase, 'notifications', user.id);
          const userRef = doc(fireDataBase, 'users', user.id);

          // notification item structure
          const notificationItem = {
            notificationType, // membership / renewal / event / general
            subject: subject.trim(),
            message: message.trim(),
            sentAt: Timestamp.now(),
            isRead: false,
            // optionally you can add sentBy: currentAdminId
          };

          // Append to notifications array in notifications/{userId}
          // Here we use setDoc with merge: true by performing setDoc on notifRef via batch -- but batch doesn't have set with merge easily.
          // Instead, use update via arrayUnion if doc exists, otherwise create with setDoc.
          // To keep everything batched and atomic-ish, we'll use set-on-merge approach by calling setDoc outside batch only when required.
          // Simpler and reliable approach: use arrayUnion with updateDoc via batch is not supported directly, so we'll perform setDoc with merge by scheduling a set via batch.set
          // writeBatch has set which accepts options for merge.
          batch.set(
            notifRef,
            { notifications: arrayUnion(notificationItem) },
            { merge: true } as any // TS quirk: Firestore types sometimes need casting; runtime accepts merge true
          );

          // Update user doc with a pointer to their notification doc (DocumentReference)
          batch.set(userRef, { notificationDocRef: notifRef }, { merge: true } as any);
        });

        // commit current batch
        await batch.commit();
      }

      alert(`Notification sent to ${filteredUsers.length} users.`);
      // Optional: clear subject/message or leave them
      setSubject('');
      setMessage('');
      setSpecificUserId(null);
      setRecipients('all');
      setNotificationType('membership');
    } catch (err) {
      console.error('Error sending notifications:', err);
      alert('Failed to send notifications. Check console for details.');
    } finally {
      setSending(false);
    }
  };

  return (
    <TabsContent value="notifications">
      <Card>
        <CardHeader>
          <CardTitle>Send Notifications</CardTitle>
          <CardDescription>Send notifications and announcements to members</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {/* Notification Type */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Notification Type
              </label>
              <Select value={notificationType} onValueChange={(v: any) => setNotificationType(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select notification type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="membership">Membership Fees</SelectItem>
                  <SelectItem value="renewal">Membership Renewal</SelectItem>
                  <SelectItem value="event">Event Announcement</SelectItem>
                  <SelectItem value="general">General Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Recipients */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">Recipients</label>
              <Select value={recipients} onValueChange={(v: any) => setRecipients(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  <SelectItem value="active">Active Members</SelectItem>
                  <SelectItem value="expired">Expired Members</SelectItem>
                  <SelectItem value="specific">Specific Member</SelectItem>

                  {/* membership type options */}
                  {MEMBERSHIP_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* If specific, show user selector */}
            {recipients === 'specific' && (
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Select Member
                </label>
                <Select
                  value={specificUserId || ''}
                  onValueChange={(v: any) => setSpecificUserId(v || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pick a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {userSelectOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Subject */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">Subject</label>
              <Input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Enter notification subject"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="p-2 border rounded-md w-full min-h-[160px]"
                placeholder="Enter your message here..."
              />
            </div>

            {/* Fee template panel */}
            <div className="bg-blue-50 p-4 border rounded-md">
              <h3 className="mb-2 font-medium text-blue-800">Membership Categories and Fees</h3>
              <p className="mb-2 text-blue-700 text-sm">
                Include the following information in your notification:
              </p>
              <ul className="space-y-1 pl-5 text-blue-700 text-sm list-disc">
                <li>Student Member: K500 per year</li>
                <li>Associate Member: K1,000 per year</li>
                <li>Full Member: K1,500 per year</li>
                <li>Fellow: K2,000 per year</li>
                <li>Corporate Member: K5,000 per year</li>
              </ul>

              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Append fee template to message
                    const template = `\n\nMembership fees:\n- Student Member: K500/year\n- Associate Member: K1,000/year\n- Full Member: K1,500/year\n- Fellow: K2,000/year\n- Corporate Member: K5,000/year\n`;
                    setMessage(prev => (prev ? prev + template : template));
                  }}
                >
                  <FileText className="mr-2 w-4 h-4" /> Insert Fee Template
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  // Preview: simple browser confirm (you can upgrade to a modal)
                  const previewText = `Preview\n\nSubject: ${subject}\n\n${message}`;
                  // use window.confirm for a quick preview flow or implement modal
                  // Here we just show an alert for preview (replace with modal if you want)
                  alert(previewText);
                }}
              >
                Preview
              </Button>

              <Button
                onClick={handleSendNotification}
                disabled={sending || !subject.trim() || !message.trim()}
              >
                <Mail className="mr-2 w-4 h-4" /> {sending ? 'Sending...' : 'Send Notification'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
