import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { fireDataBase } from '@/lib/firebase';

const AdminManagement = () => {
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchAdminEmails = async () => {
    try {
      const adminListRef = doc(fireDataBase, 'admins', 'admins');
      const adminListDoc = await getDoc(adminListRef);
      const emails = adminListDoc.data()?.adminEmails || [];
      setAdminEmails(emails);
    } catch (error) {
      console.error('Error fetching admin emails:', error);
    }
  };

  const addAdminEmail = async () => {
    if (!newEmail || !newEmail.includes('@')) return;
    
    setIsLoading(true);
    try {
      const adminListRef = doc(fireDataBase, 'admins', 'admins');
      await updateDoc(adminListRef, {
        adminEmails: arrayUnion(newEmail)
      });
      setNewEmail('');
      await fetchAdminEmails();
    } catch (error) {
      console.error('Error adding admin email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeAdminEmail = async (email: string) => {
    setIsLoading(true);
    try {
      const adminListRef = doc(fireDataBase, 'admins', 'admins');
      await updateDoc(adminListRef, {
        adminEmails: arrayRemove(email)
      });
      await fetchAdminEmails();
    } catch (error) {
      console.error('Error removing admin email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminEmails();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Management</CardTitle>
        <CardDescription>Add or remove admin email addresses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter admin email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addAdminEmail} disabled={isLoading || !newEmail}>
              Add Admin
            </Button>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Current Admins ({adminEmails.length})</h3>
            {adminEmails.length === 0 ? (
              <p className="text-gray-500 text-sm">No admin emails found</p>
            ) : (
              adminEmails.map((email) => (
                <div key={email} className="flex justify-between items-center p-3 border rounded">
                  <span>{email}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeAdminEmail(email)}
                    disabled={isLoading}
                  >
                    Remove
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminManagement;