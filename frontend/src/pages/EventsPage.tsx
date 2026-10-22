import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Event } from '../types';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  MapPin,
  Clock,
  User,
  Users,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  Video,
} from 'lucide-react';

export const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const [registeringEvent, setRegisteringEvent] = useState<Event | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ events: Event[] }>('/events');
      setEvents(res.events);

      if (user) {
        const myRes = await api.get<{ registrations: any[] }>('/events/my-registrations');
        setMyRegistrations(myRes.registrations);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const handleRegisterConfirm = async () => {
    if (!registeringEvent) return;
    try {
      await api.post(`/events/${registeringEvent.id}/register`);
      setSuccessMessage(`Registration confirmed for "${registeringEvent.title}"!`);
      setRegisteringEvent(null);
      await fetchEvents();
    } catch (err: any) {
      alert(err.message || 'Failed to register');
    }
  };

  const handleCancelRegistration = async (eventId: string) => {
    if (!confirm('Are you sure you want to cancel your registration?')) return;
    try {
      await api.delete(`/events/${eventId}/register`);
      await fetchEvents();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel registration');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      {/* 1. Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="blue">Community Sangha</Badge>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-900 tracking-tight">
          Workshops & Masterclasses
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Connect with experienced yoga acharyas and fellow practitioners. Deepen your practice with
          live virtual flows and mindful in-person weekend retreats.
        </p>
      </div>

      {/* 2. Success Alert */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between animate-fade-in max-w-2xl mx-auto">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. Navigation Tabs */}
      <div className="flex justify-center border-b border-stone-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-4 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'all'
                ? 'border-sage-600 text-sage-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Upcoming Events ({events.length})
          </button>
          {user && (
            <button
              onClick={() => setActiveTab('my')}
              className={`pb-4 text-sm font-semibold transition-all border-b-2 ${
                activeTab === 'my'
                  ? 'border-sage-600 text-sage-800'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              My Registered Events ({myRegistrations.length})
            </button>
          )}
        </div>
      </div>

      {/* 4. Events Display */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-sage-600 animate-spin mb-2" />
          <p className="text-xs text-stone-500">Checking workshop calendar...</p>
        </div>
      ) : activeTab === 'my' ? (
        /* User's registered events */
        myRegistrations.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-sage-100 max-w-md mx-auto">
            <Calendar className="w-10 h-10 text-sage-400 mx-auto mb-3" />
            <h3 className="font-display text-xl font-bold text-stone-800 mb-1">
              No Registered Events Yet
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Explore upcoming workshops to reserve your seat in live classes.
            </p>
            <button
              onClick={() => setActiveTab('all')}
              className="px-4 py-2 rounded-xl bg-sage-600 text-white text-xs font-semibold"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myRegistrations.map((reg) => (
              <div
                key={reg.id}
                className="bg-white rounded-3xl border border-sage-200 shadow-sm p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={reg.event.eventType === 'ONLINE' ? 'blue' : 'amber'}>
                      {reg.event.eventType}
                    </Badge>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Confirmed
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-stone-900 mb-2">
                    {reg.event.title}
                  </h3>
                  <p className="text-xs text-stone-600 mb-4 line-clamp-2">
                    {reg.event.description}
                  </p>
                  <div className="space-y-1.5 text-xs text-stone-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sage-600" />
                      <span>{new Date(reg.event.eventDate).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-sage-600" />
                      <span className="truncate">{reg.event.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    Registered on {new Date(reg.registeredAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleCancelRegistration(reg.event.id)}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                  >
                    Cancel Seat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* All upcoming events */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-3xl border border-sage-100 shadow-sm hover:shadow-xl hover:border-sage-300 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] bg-sage-50 overflow-hidden">
                  <img
                    src={ev.imageUrl}
                    alt={ev.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant={ev.eventType === 'ONLINE' ? 'blue' : 'amber'}>
                      {ev.eventType}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-stone-900/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3 text-sage-300" />
                    <span>{ev.durationMinutes} mins</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-stone-900 mb-2">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4">
                      {ev.description}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-stone-600 bg-cream-50/70 p-3 rounded-2xl border border-cream-200/60">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-sage-600 shrink-0" />
                      <span>{new Date(ev.eventDate).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-sage-600 shrink-0" />
                      <span className="truncate">{ev.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-sage-600 shrink-0" />
                      <span>Lead Instructor: <strong>{ev.instructorName}</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-6 pt-0">
                <div className="flex items-center justify-between pt-4 border-t border-sage-50 mb-4 text-xs">
                  <span className="flex items-center gap-1 text-stone-500">
                    <Users className="w-3.5 h-3.5 text-stone-400" />
                    <span>Capacity: {ev.registeredSeats} / {ev.maxSeats}</span>
                  </span>
                  <span
                    className={`font-semibold ${
                      (ev.seatsLeft ?? 1) <= 5 ? 'text-amber-600' : 'text-sage-700'
                    }`}
                  >
                    {ev.seatsLeft} seats left
                  </span>
                </div>

                {ev.isRegistered ? (
                  <div className="w-full py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center font-bold text-xs flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>You're Registered</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (!user) {
                        navigate('/login');
                      } else {
                        setRegisteringEvent(ev);
                      }
                    }}
                    disabled={(ev.seatsLeft ?? 1) <= 0}
                    className="w-full py-2.5 rounded-xl bg-sage-600 hover:bg-sage-700 disabled:bg-stone-300 text-white font-semibold text-xs shadow-sm transition-all active:scale-95"
                  >
                    {(ev.seatsLeft ?? 1) <= 0 ? 'Fully Booked' : 'Register for Workshop'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!registeringEvent}
        onClose={() => setRegisteringEvent(null)}
        title="Confirm Workshop Registration"
        maxWidth="md"
      >
        {registeringEvent && (
          <div className="space-y-5">
            <p className="text-sm text-stone-700 leading-relaxed">
              You are registering for <strong>{registeringEvent.title}</strong> led by{' '}
              {registeringEvent.instructorName}.
            </p>

            <div className="bg-sage-50 p-4 rounded-2xl border border-sage-100 text-xs space-y-1.5 text-stone-700">
              <p>
                <strong>Date & Time:</strong>{' '}
                {new Date(registeringEvent.eventDate).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}
              </p>
              <p>
                <strong>Type:</strong> {registeringEvent.eventType}
              </p>
              <p>
                <strong>Venue / Access:</strong> {registeringEvent.venue}
              </p>
            </div>

            <p className="text-xs text-stone-400">
              A demonstration access link and confirmation has been generated in your account.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setRegisteringEvent(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-medium text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleRegisterConfirm}
                className="flex-1 py-2.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-xs shadow-md"
              >
                Confirm Free Seat
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EventsPage;
