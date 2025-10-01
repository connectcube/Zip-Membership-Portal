import { Card, CardContent } from '@/components/ui/card';

const MessagesSection = ({ messages = [] }) => (
  <div className="bg-gray-50 p-6 min-h-screen">
    <h1 className="mb-6 font-bold text-gray-900 text-3xl">Messages</h1>
    <Card>
      <CardContent className="p-6">
        <div className="flex md:flex-row flex-col border rounded-lg h-[600px] overflow-hidden">
          {/* Messages list */}
          <div className="border-r w-full md:w-1/3">
            <div className="p-4 border-b">
              <input
                type="text"
                placeholder="Search messages..."
                className="p-2 border rounded-md w-full"
              />
            </div>
            <div className="h-[calc(600px-64px)] overflow-y-auto">
              {messages.length > 0 ? (
                messages.map(message => (
                  <div
                    key={message.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      message.unread ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{message.sender}</h4>
                      <span className="text-gray-500 text-xs">{message.time}</span>
                    </div>
                    <p className="text-gray-600 text-sm truncate">{message.preview}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center">
                  <p className="text-gray-500">No messages</p>
                </div>
              )}
            </div>
          </div>

          {/* Message content */}
          {messages.length > 0 ? (
            <div className="flex flex-col w-full md:w-2/3">
              <div className="p-4 border-b">
                <h3 className="font-medium">ZIP Admin</h3>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
                      <p className="text-sm">
                        Hello John, this is a reminder that your membership will expire in 30 days.
                        Please renew to maintain your active status.
                      </p>
                      <span className="block mt-1 text-gray-500 text-xs">10:30 AM</span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-blue-100 p-3 rounded-lg max-w-[80%]">
                      <p className="text-sm">
                        Thank you for the reminder. I'll process the renewal this week.
                      </p>
                      <span className="block mt-1 text-gray-500 text-xs">10:32 AM</span>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
                      <p className="text-sm">
                        Great! Let me know if you need any assistance with the payment process.
                      </p>
                      <span className="block mt-1 text-gray-500 text-xs">10:35 AM</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded-md"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition-colors">
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center w-full md:w-2/3">
              <p className="text-gray-500">No message</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
);
export default MessagesSection;
