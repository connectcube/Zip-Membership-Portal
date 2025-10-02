import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MapPin, PlusCircle, Trash2, Pencil } from 'lucide-react';
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
  setDoc,
} from 'firebase/firestore';
import { fireDataBase } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import { TabsContent } from '@/components/ui/tabs';

type EventItem = {
  id: string;
  title: string;
  description: string;
  date: Timestamp;
  location: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  ignored: string[];
  willAttend: string[];
  attended: string[];
  missed: string[];
};

const EventsManagement = () => {
  const currentYear = new Date().getFullYear().toString();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  });
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const eventsRef = doc(fireDataBase, 'events', currentYear);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snap = await getDoc(eventsRef);
        if (snap.exists()) {
          const data = snap.data();
          setEvents(data.eventsList || []);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const resetForm = () => {
    setForm({ title: '', description: '', date: '', location: '' });
    setEditingEvent(null);
  };

  const handleAddOrUpdate = async () => {
    if (!form.title || !form.date) return;

    const newEvent: EventItem = {
      id: editingEvent ? editingEvent.id : uuidv4(),
      title: form.title,
      description: form.description,
      date: Timestamp.fromDate(new Date(form.date)),
      location: form.location,
      createdAt: editingEvent ? editingEvent.createdAt : Timestamp.now(),
      updatedAt: Timestamp.now(),
      ignored: editingEvent.ignored ? editingEvent.ignored : [],
      willAttend: editingEvent.willAttend ? editingEvent.willAttend : [],
      attended: editingEvent.attended ? editingEvent.attended : [],
      missed: editingEvent.missed ? editingEvent.missed : [],
    };

    try {
      const snap = await getDoc(eventsRef);

      if (!snap.exists()) {
        // Create doc with first event
        await setDoc(eventsRef, { eventsList: [newEvent] });
        setEvents([newEvent]);
      } else {
        if (editingEvent) {
          await updateDoc(eventsRef, {
            eventsList: arrayRemove(editingEvent),
          });
        }
        await updateDoc(eventsRef, {
          eventsList: arrayUnion(newEvent),
        });

        setEvents(prev =>
          editingEvent
            ? prev.map(e => (e.id === editingEvent.id ? newEvent : e))
            : [...prev, newEvent]
        );
      }

      resetForm();
    } catch (err) {
      console.error('Error adding/updating event:', err);
    }
  };

  const handleDelete = async (event: EventItem) => {
    try {
      const snap = await getDoc(eventsRef);
      if (snap.exists()) {
        await updateDoc(eventsRef, {
          eventsList: arrayRemove(event),
        });
        setEvents(prev => prev.filter(e => e.id !== event.id));
      }
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  return (
    <TabsContent value="events">
      <div className="bg-gray-50 p-6 min-h-screen">
        <h1 className="mb-6 font-bold text-gray-900 text-3xl">Events Management</h1>
        <Card className="mb-8">
          <CardContent className="space-y-4 p-6">
            <h2 className="mb-2 font-semibold text-xl">
              {editingEvent ? 'Edit Event' : 'Add Event'}
            </h2>
            <Input
              placeholder="Event Title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <Input
              type="datetime-local"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />
            <Input
              placeholder="Location"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
            />
            <Button onClick={handleAddOrUpdate}>
              {editingEvent ? 'Update Event' : 'Add Event'}
            </Button>
            {editingEvent && (
              <Button variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="mb-4 font-semibold text-xl">All Events</h2>
            {isLoading ? (
              <p>Loading...</p>
            ) : events.length > 0 ? (
              events
                .sort((a, b) => a.date.toMillis() - b.date.toMillis())
                .map(ev => (
                  <div
                    key={ev.id}
                    className="flex sm:flex-row flex-col sm:items-start gap-4 p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{ev.title}</h3>
                      <p className="text-gray-500 text-sm">{ev.date.toDate().toLocaleString()}</p>
                      <p className="mt-1 text-gray-700">{ev.description}</p>
                      <p className="flex items-center gap-1 mt-1 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4" /> {ev.location}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setForm({
                            title: ev.title,
                            description: ev.description,
                            date: ev.date.toDate().toISOString().slice(0, 16),
                            location: ev.location,
                          });
                          setEditingEvent(ev);
                        }}
                      >
                        <Pencil className="mr-1 w-4 h-4" /> Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(ev)}>
                        <Trash2 className="mr-1 w-4 h-4" /> Delete
                      </Button>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500">No events available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

export default EventsManagement;
