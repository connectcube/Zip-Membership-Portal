import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  onSnapshot,
  arrayUnion,
  Timestamp,
} from 'firebase/firestore';
import { fireDataBase } from '@/lib/firebase';
import formatTimestamp from '@/lib/formatTimestamp';

const AdminMessagesSection = ({ users = [], adminEmail }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter users for sidebar
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.firstName?.toLowerCase().includes(query) ||
      user.lastName?.toLowerCase().includes(query) ||
      user.middleName?.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });
  const encodeEmail = email => email.replace(/\./g, '_DOT_');
  useEffect(() => {
    if (!selectedUser) return;

    const messagesRef = doc(fireDataBase, 'messages', selectedUser.id);

    const unsubscribe = onSnapshot(messagesRef, docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const allMessages = data[encodeEmail(adminEmail)] || [];
        setMessages(allMessages);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [selectedUser, adminEmail]);

  const handleSendMessage = async () => {
    if (!newMessage || !selectedUser) return;

    const messagesRef = doc(fireDataBase, 'messages', selectedUser.id);
    const messageObj = {
      sender: 'admin',
      senderEmail: adminEmail,
      senderName: 'Admin',
      content: newMessage,
      time: Timestamp.now(),
      isRead: false,
    };
    const encodeEmail = email => email.replace(/\./g, '_DOT_');
    const senderKey = encodeEmail(adminEmail);

    try {
      const docSnap = await getDoc(messagesRef);
      if (docSnap.exists()) {
        await updateDoc(messagesRef, {
          [senderKey]: arrayUnion(messageObj),
        });
      } else {
        await setDoc(messagesRef, {
          [senderKey]: [messageObj],
        });
      }

      // update local state immediately
      setMessages(prev => [...prev, messageObj]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <TabsContent value="messages">
      <div className="bg-gray-50 p-6 min-h-screen">
        <h1 className="mb-6 font-bold text-gray-900 text-3xl">Admin Messages</h1>
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex md:flex-row flex-col border rounded-lg h-[600px] overflow-hidden">
              {/* Users sidebar */}
              <div className="bg-white border-r w-full md:w-1/3">
                <div className="top-0 z-10 sticky bg-white p-4 border-b">
                  <input
                    type="text"
                    placeholder="Search users by name, email or ID..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  />
                </div>
                <div className="h-[calc(600px-64px)] overflow-y-auto">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => {
                      const hasUnread = messages.some(
                        msg => !msg.isRead && msg.senderEmail !== adminEmail
                      );

                      return (
                        <div
                          key={user}
                          onClick={() => setSelectedUser(user)}
                          className={`p-4 border-b cursor-pointer hover:bg-gray-50 flex flex-col ${
                            selectedUser?.id === user.id ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{`${user.firstName} ${user.lastName}`}</h4>
                            <span className="text-gray-500 text-xs">{user.email}</span>
                          </div>
                          {hasUnread && (
                            <span className="block mt-1 font-medium text-blue-600 text-xs">
                              Unread messages
                            </span>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-gray-500">No users found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat area */}
              {selectedUser ? (
                <div className="flex flex-col bg-gray-50 w-full md:w-2/3">
                  <div className="top-0 z-10 sticky bg-white p-4 border-b">
                    <h3 className="font-medium">{`${selectedUser.firstName} ${selectedUser.lastName}`}</h3>
                    <span className="text-gray-500 text-sm">{selectedUser.email}</span>
                  </div>
                  <div className="flex-1 space-y-4 p-4 overflow-y-auto">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${
                          msg.senderEmail === adminEmail ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`p-3 rounded-lg max-w-[80%] shadow-sm ${
                            msg.senderEmail === adminEmail ? 'bg-blue-100' : 'bg-gray-100'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <div className="flex justify-between items-center mt-1 text-gray-500 text-xs">
                            <span>{formatTimestamp(msg.time, 'medium')}</span>
                            <span className="text-gray-400 text-xs">
                              {msg.senderName} ({msg.senderEmail})
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 bg-white p-4 border-t">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center bg-gray-50 w-full md:w-2/3">
                  <p className="text-gray-500">Select a user to start messaging</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

export default AdminMessagesSection;
