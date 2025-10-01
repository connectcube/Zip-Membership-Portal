import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from 'lucide-react';

const EventsSection = ({ upcomingEvents = [] }) => (
  <div className="bg-gray-50 p-6 min-h-screen">
    <h1 className="mb-6 font-bold text-gray-900 text-3xl">Events & CPD</h1>
    <Tabs defaultValue="upcoming">
      <TabsList className="mb-6">
        <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
        <TabsTrigger value="past">Past Events</TabsTrigger>
        <TabsTrigger value="cpd">CPD Records</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map(event => (
                  <div key={event.id} className="border rounded-lg overflow-hidden">
                    <div className="flex justify-between items-center bg-blue-50 p-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <h3 className="font-medium">{event.title}</h3>
                      </div>
                      <span className="bg-blue-100 px-2 py-1 rounded-full text-blue-800 text-xs">
                        {event.type}
                      </span>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between mb-4">
                        <p className="text-sm">
                          <strong>Date:</strong> {event.date}
                        </p>
                        <p className="text-sm">
                          <strong>Location:</strong> Lusaka, Zambia
                        </p>
                      </div>
                      <p className="mb-4 text-gray-600 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua.
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-sm">
                          <strong>CPD Points:</strong> 5
                        </p>
                        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition-colors">
                          Register Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center">
                  <p className="text-gray-500">No upcoming events found.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="past">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  title: 'Urban Planning Conference',
                  date: '2022-10-15',
                  type: 'Conference',
                  attended: true,
                },
                {
                  id: 2,
                  title: 'Sustainable Development Workshop',
                  date: '2022-08-22',
                  type: 'Workshop',
                  attended: true,
                },
                {
                  id: 3,
                  title: 'Planning Law Seminar',
                  date: '2022-06-10',
                  type: 'Seminar',
                  attended: false,
                },
              ].map(event => (
                <div
                  key={event.id}
                  className="flex justify-between items-center p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-gray-500 text-sm">
                        {event.date} • {event.type}
                      </p>
                    </div>
                  </div>
                  <div>
                    {event.attended ? (
                      <span className="inline-block bg-green-100 px-2 py-1 rounded-full text-green-800 text-xs">
                        Attended
                      </span>
                    ) : (
                      <span className="inline-block bg-red-100 px-2 py-1 rounded-full text-red-800 text-xs">
                        Missed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="cpd">
        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="mb-2 font-medium text-xl">CPD Points Summary</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600 text-sm">Current Year (2023)</p>
                    <p className="font-bold text-2xl">15 / 20 Points</p>
                  </div>
                  <div className="flex justify-center items-center border-8 border-blue-500 rounded-full w-24 h-24">
                    <span className="font-bold text-xl">75%</span>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="mb-4 font-medium text-xl">CPD Activities</h3>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  activity: 'Urban Planning Conference',
                  date: '2022-10-15',
                  points: 5,
                },
                {
                  id: 2,
                  activity: 'Sustainable Development Workshop',
                  date: '2022-08-22',
                  points: 3,
                },
                {
                  id: 3,
                  activity: 'Planning Journal Publication',
                  date: '2022-07-05',
                  points: 7,
                },
              ].map(activity => (
                <div
                  key={activity.id}
                  className="flex justify-between items-center p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{activity.activity}</h4>
                      <p className="text-gray-500 text-sm">{activity.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{activity.points} Points</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
);
export default EventsSection;
