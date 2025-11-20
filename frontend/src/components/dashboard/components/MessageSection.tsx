import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { doc, getDoc, updateDoc, onSnapshot, arrayUnion, Timestamp } from 'firebase/firestore';
import { fireDataBase } from '@/lib/firebase';
import formatTimestamp from '@/lib/formatTimestamp';

const MessagesSection = ({ userId }) => {
  const [senders, setSenders] = useState([]);
  const [selectedSender, setSelectedSender] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const decodeEmail = email => email.replace(/_DOT_/g, '.');
  // Load senders and their messages
  useEffect(() => {
    const messagesRef = doc(fireDataBase, 'messages', userId);

    const unsubscribe = onSnapshot(messagesRef, async docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const senderEmails = Object.keys(data);
        setSenders(senderEmails);

        if (selectedSender) {
          const senderMessages = data[`${selectedSender}`] || [];
          setMessages(senderMessages);

          // Mark admin messages as read
          const updatedMessages = senderMessages.map(msg =>
            msg.senderEmail === selectedSender && !msg.isRead ? { ...msg, isRead: true } : msg
          );

          if (JSON.stringify(updatedMessages) !== JSON.stringify(senderMessages)) {
            await updateDoc(messagesRef, { [`${selectedSender}`]: updatedMessages });
          }
        }
      } else {
        setSenders([]);
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [userId, selectedSender]);

  const handleSendMessage = async () => {
    if (!newMessage || !selectedSender) return;

    const messagesRef = doc(fireDataBase, 'messages', userId);
    const messageObj = {
      sender: 'user',
      senderEmail: userId,
      senderName: 'User',
      content: newMessage,
      time: Timestamp.now(),
      isRead: true, // user message considered read
    };

    try {
      const docSnap = await getDoc(messagesRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const senderMessages = data[`${selectedSender}`] || [];
        await updateDoc(messagesRef, {
          [`${selectedSender}`]: arrayUnion(messageObj),
        });
      }
      // Do not allow creating new sender keys
      setMessages(prev => [...prev, messageObj]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <h1 className="mb-6 font-bold text-gray-900 text-3xl">Messages</h1>
      <Card>
        <CardContent className="p-6">
          <div className="flex md:flex-row flex-col border rounded-lg h-[600px] overflow-hidden">
            {/* Left sidebar: list of senders */}
            <div className="bg-white border-r w-full md:w-1/3">
              <div className="top-0 z-10 sticky bg-white p-4 border-b">
                <input
                  type="text"
                  placeholder="Search senders..."
                  className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  value={''} // optional: add search functionality
                  onChange={() => {}}
                />
              </div>
              <div className="h-[calc(600px-64px)] overflow-y-auto">
                {senders.length > 0 ? (
                  senders.map(senderEmail => (
                    <div
                      key={senderEmail}
                      onClick={() => setSelectedSender(senderEmail)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedSender === senderEmail ? 'bg-blue-50' : ''
                      }`}
                    >
                      <h4 className="font-medium">{decodeEmail(senderEmail)}</h4>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-gray-500">No messages yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat area */}
            {selectedSender ? (
              <div className="flex flex-col bg-gray-50 w-full md:w-2/3">
                <div className="top-0 z-10 sticky bg-white p-4 border-b">
                  <h3 className="font-medium">{decodeEmail(selectedSender)}</h3>
                </div>
                <div className="flex-1 space-y-4 p-4 overflow-y-auto">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        msg.senderEmail === userId ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg max-w-[80%] shadow-sm ${
                          msg.senderEmail === userId ? 'bg-blue-100' : 'bg-gray-100'
                        } ${
                          !msg.isRead && msg.senderEmail !== userId
                            ? 'border-2 border-blue-500'
                            : ''
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <div className="flex justify-between items-center mt-1 text-gray-500 text-xs">
                          <span>{formatTimestamp(msg.time, 'medium')}</span>
                          <span className="text-gray-400 text-xs">
                            {msg.senderName} <span className="ml-[2px]">({msg.senderEmail})</span>
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
                <p className="text-gray-500">Select a sender to view messages</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagesSection;
