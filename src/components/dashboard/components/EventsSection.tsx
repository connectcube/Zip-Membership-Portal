import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from 'lucide-react';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, Timestamp } from 'firebase/firestore';
import { fireDataBase } from '@/lib/firebase';

interface EventItem {
  id: string;
  title: string;
  type: string;
  date: Timestamp;
  location?: string;
  description?: string;
  ignored: string[];
  willAttend: string[];
  attended: string[];
  missed: string[];
}

interface EventsSectionProps {
  userId: string;
}

const EventsSection = ({ userId }: EventsSectionProps) => {
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [pastEvents, setPastEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();
  const eventsRef = doc(fireDataBase, 'events', `${currentYear}`);

  // Fetch events from Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snap = await getDoc(eventsRef);
        if (snap.exists()) {
          const data = snap.data();
          const events: EventItem[] = data.eventsList || [];
          const now = new Date();

          setUpcomingEvents(events.filter(e => e.date.toDate() >= now));
          setPastEvents(events.filter(e => e.date.toDate() < now));
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle RSVP (willAttend / ignored)
  const handleRSVP = async (eventId: string, status: 'willAttend' | 'ignored') => {
    try {
      const snap = await getDoc(eventsRef);
      if (!snap.exists()) return;

      const events: EventItem[] = snap.data().eventsList || [];
      const event = events.find(e => e.id === eventId);
      if (!event) return;

      // Remove user from all status arrays first
      const updatedEvent: EventItem = {
        ...event,
        willAttend: event.willAttend.filter(u => u !== userId),
        ignored: event.ignored.filter(u => u !== userId),
        attended: event.attended.filter(u => u !== userId),
        missed: event.missed.filter(u => u !== userId),
      };

      // Add user to the selected status array
      updatedEvent[status] = [...updatedEvent[status], userId];

      // Update Firestore
      await updateDoc(eventsRef, {
        eventsList: arrayRemove(event),
      });
      await updateDoc(eventsRef, {
        eventsList: arrayUnion(updatedEvent),
      });

      // Update local state
      setUpcomingEvents(prev => prev.map(e => (e.id === eventId ? updatedEvent : e)));
      setPastEvents(prev => prev.map(e => (e.id === eventId ? updatedEvent : e)));
    } catch (err) {
      console.error('Error updating RSVP:', err);
    }
  };

  const renderEventCard = (event: EventItem) => {
    const isIgnored = event.ignored.includes(userId);
    const isWillAttend = event.willAttend.includes(userId);
    const isAttended = event.attended.includes(userId);
    const isMissed = event.missed.includes(userId);

    return (
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
        <div className="space-y-2 p-4">
          <div className="flex justify-between mb-2">
            <p className="text-sm">
              <strong>Date:</strong> {event.date.toDate().toLocaleDateString()}
            </p>
            <p className="text-sm">
              <strong>Location:</strong> {event.location || 'TBA'}
            </p>
          </div>
          <p className="text-gray-600 text-sm">{event.description}</p>

          {/* Status badges */}
          <div className="flex gap-2 mt-2">
            {isWillAttend && (
              <span className="inline-block bg-yellow-100 px-2 py-1 rounded-full text-yellow-800 text-xs">
                Will Attend
              </span>
            )}
            {isAttended && (
              <span className="inline-block bg-green-100 px-2 py-1 rounded-full text-green-800 text-xs">
                Attended
              </span>
            )}
            {isIgnored && (
              <span className="inline-block bg-red-100 px-2 py-1 rounded-full text-red-800 text-xs">
                Ignored
              </span>
            )}
            {isMissed && (
              <span className="inline-block bg-gray-100 px-2 py-1 rounded-full text-gray-800 text-xs">
                Missed
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-3">
            {!isWillAttend && !isAttended && !isIgnored && (
              <>
                <button
                  onClick={() => handleRSVP(event.id, 'willAttend')}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white text-sm transition-colors"
                >
                  Will Attend
                </button>
                <button
                  onClick={() => handleRSVP(event.id, 'ignored')}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white text-sm transition-colors"
                >
                  Ignore
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <h1 className="mb-6 font-bold text-gray-900 text-3xl">Events</h1>
      <Tabs defaultValue="upcoming">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {loading ? (
            <p>Loading events...</p>
          ) : upcomingEvents.length > 0 ? (
            <div className="space-y-6">{upcomingEvents.map(renderEventCard)}</div>
          ) : (
            <p className="text-gray-500">No upcoming events found.</p>
          )}
        </TabsContent>

        <TabsContent value="past">
          {loading ? (
            <p>Loading events...</p>
          ) : pastEvents.length > 0 ? (
            <div className="space-y-6">{pastEvents.map(renderEventCard)}</div>
          ) : (
            <p className="text-gray-500">No past events found.</p>
          )}
        </TabsContent>
        <TabsContent value="cpd">
          {' '}
          <Card>
            {' '}
            <CardContent className="p-6">
              {' '}
              <div className="mb-6">
                {' '}
                <h3 className="mb-2 font-medium text-xl">CPD Points Summary</h3>{' '}
                <div className="bg-blue-50 p-4 rounded-lg">
                  {' '}
                  <div className="flex justify-between items-center">
                    {' '}
                    <div>
                      {' '}
                      <p className="text-gray-600 text-sm">Current Year (2023)</p>{' '}
                      <p className="font-bold text-2xl">15 / 20 Points</p>{' '}
                    </div>{' '}
                    <div className="flex justify-center items-center border-8 border-blue-500 rounded-full w-24 h-24">
                      {' '}
                      <span className="font-bold text-xl">75%</span>{' '}
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
              </div>{' '}
              <h3 className="mb-4 font-medium text-xl">CPD Activities</h3>{' '}
              <div className="space-y-4">
                {' '}
                {[
                  { id: 1, activity: 'Urban Planning Conference', date: '2022-10-15', points: 5 },
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
                    {' '}
                    <div className="flex items-center gap-4">
                      {' '}
                      <div className="bg-green-100 p-3 rounded-lg">
                        {' '}
                        <Calendar className="w-5 h-5 text-green-600" />{' '}
                      </div>{' '}
                      <div>
                        {' '}
                        <h4 className="font-medium">{activity.activity}</h4>{' '}
                        <p className="text-gray-500 text-sm">{activity.date}</p>{' '}
                      </div>{' '}
                    </div>{' '}
                    <div className="text-right">
                      {' '}
                      <p className="font-bold">{activity.points} Points</p>{' '}
                    </div>{' '}
                  </div>
                ))}{' '}
              </div>{' '}
            </CardContent>{' '}
          </Card>{' '}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventsSection;
