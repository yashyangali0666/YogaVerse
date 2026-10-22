import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { YogaPose, YogaProgram, Event } from '../types';
import PoseCard from '../components/PoseCard';
import PoseDetailModal from '../components/PoseDetailModal';
import Badge from '../components/Badge';
import {
  Sparkles,
  ArrowRight,
  Heart,
  Brain,
  ShieldCheck,
  Compass,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Quote,
  Flame,
  Activity,
  Play,
  Lightbulb,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredPrograms, setFeaturedPrograms] = useState<YogaProgram[]>([]);
  const [popularPoses, setPopularPoses] = useState<YogaPose[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [selectedPose, setSelectedPose] = useState<YogaPose | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    // Load home page data
    const loadHomeData = async () => {
      try {
        const [programsRes, posesRes, eventsRes] = await Promise.all([
          api.get<{ programs: YogaProgram[] }>('/programs'),
          api.get<{ poses: YogaPose[] }>('/poses?limit=6'),
          api.get<{ events: Event[] }>('/events?timeframe=upcoming'),
        ]);

        setFeaturedPrograms(programsRes.programs.slice(0, 3));
        setPopularPoses(posesRes.poses.slice(0, 4));
        setUpcomingEvents(eventsRes.events.slice(0, 3));
      } catch (err) {
        console.error('Error loading home data:', err);
      }
    };

    loadHomeData();
  }, []);

  const dailyWellnessTips = [
    {
      title: "Today's Prana Wisdom",
      tip: "When stress tightens your shoulders, pause and take three diaphragmatic breaths — making your exhales twice as long as your inhales to signal safety to your nervous system.",
      author: "Master Yogi Arya",
    },
  ];

  const benefits = [
    {
      icon: Activity,
      title: 'Physical Vitality & Ease',
      description: 'Gently release muscular tension, lubricate connective fascia, and improve spinal posture with daily mindful mobility.',
    },
    {
      icon: Brain,
      title: 'Mental Clarity & Peace',
      description: 'Cultivate uninterrupted concentration (Dharana) and lower systemic cortisol through conscious rhythmic breathwork.',
    },
    {
      icon: Heart,
      title: 'Holistic Nervous Reset',
      description: 'Activate your parasympathetic restorative system, encouraging restorative digestion and rejuvenating sleep quality.',
    },
    {
      icon: Compass,
      title: 'Personalized Daily Habit',
      description: 'Tailored 5- to 30-minute practice flows designed to seamlessly integrate into demanding work and study schedules.',
    },
  ];

  const testimonials = [
    {
      quote:
        'YogaLife transformed my sedentary workdays. Even just the 10-minute Desk Break routine completely alleviated my chronic lower back tightness.',
      name: 'Aditi Varma',
      role: 'Software Architect & Practitioner',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    {
      quote:
        'The step-by-step breathing guides and authentic philosophy teachings make YogaLife an extraordinary sanctuary away from digital burnout.',
      name: 'Dr. Michael Chen',
      role: 'Clinical Psychologist & Meditator',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    {
      quote:
        'As a beginner, I was always intimidated by complex poses. The detailed safety precautions and guided countdown timer gave me true confidence.',
      name: 'Sarah Jenkins',
      role: 'University Student & Member',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    },
  ];

  const faqs = [
    {
      q: 'Do I need to be flexible before starting yoga?',
      a: 'Not at all. Saying you need flexibility to begin yoga is like saying you need to be clean to take a shower. Flexibility is the natural outcome of steady, gentle practice, not a prerequisite.',
    },
    {
      q: 'How much time do I realistically need each day?',
      a: 'Consistency is far more transformative than duration. Even 10 to 15 minutes of mindful daily practice yields measurable neurological, cardiovascular, and stress-reduction benefits.',
    },
    {
      q: 'Can I track my real practice time and streaks?',
      a: 'Yes! YogaLife features a functional Guided Practice Studio with active timers that accurately log your completed minutes, calculate genuine day streaks, and award milestones.',
    },
    {
      q: 'Are the recommendations medical advice?',
      a: 'No. Our recommendations and personalized routines are educational general wellness guidance. Always consult your qualified healthcare practitioner if you have injuries, disc pathologies, or are pregnant.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-sage-50/60 via-cream-50 to-white">
        {/* Subtle decorative circles */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-sage-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text Col */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-100 text-sage-800 text-xs font-semibold uppercase tracking-wider border border-sage-200/80 shadow-xs">
                <Sparkles className="w-4 h-4 text-sage-600" />
                <span>Your Personal Yoga & Wellness Companion</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.15] tracking-tight">
                Find Your Balance. <br className="hidden sm:inline" />
                <span className="text-sage-700 italic font-serif">One Breath at a Time.</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
                Embrace conscious movement, ancient yogic awareness, and scientifically-informed
                breathwork. Transform daily stress into serene clarity with guided practices tailored
                to your life.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/guided-practice"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-base shadow-lg shadow-sage-600/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Start Your Yoga Journey</span>
                </Link>
                <Link
                  to="/about"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-sage-50 text-stone-800 font-semibold text-base border border-stone-200 hover:border-sage-300 shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore Yoga</span>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sage-600" />
                  <span>Classical Ashtanga & Modern Ergonomics</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sage-600" />
                  <span>Active Session Timer & Progress Tracking</span>
                </div>
              </div>
            </div>

            {/* Visual Col */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative bg-sage-100">
                  <img
                    src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80"
                    alt="Serene Yoga Meditation"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
                  
                  {/* Floating badge inside hero */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-sage-100 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sage-500 text-white flex items-center justify-center shrink-0">
                        <Flame className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-stone-900">
                          “Yoga is the journey of the self, through the self, to the self.”
                        </p>
                        <p className="text-[11px] text-sage-700 font-serif italic">— The Bhagavad Gita</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Daily Wellness Tip Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200/80 shadow-xl shadow-sage-900/5 flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Lightbulb className="w-7 h-7" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <Badge variant="amber" size="sm">Daily Wellness Tip</Badge>
              <span className="text-xs text-stone-400">• Updated Daily</span>
            </div>
            <p className="text-base text-stone-800 font-medium leading-relaxed">
              {dailyWellnessTips[0].tip}
            </p>
          </div>
          <Link
            to="/guided-practice"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-sage-50 hover:bg-sage-600 hover:text-white text-sage-800 font-medium text-sm transition-all border border-sage-200"
          >
            Practice 3 Breaths
          </Link>
        </div>
      </section>

      {/* 3. Featured Yoga Programs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <Badge variant="sage" className="mb-2">Curated Journeys</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">
              Featured Yoga Programs
            </h2>
            <p className="text-stone-600 text-sm mt-1 max-w-xl">
              Carefully structured sequences progressing from foundational grounding to energizing flows.
            </p>
          </div>
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sage-700 hover:text-sage-900 transition-colors"
          >
            <span>View All Programs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPrograms.map((prog) => (
            <div
              key={prog.id}
              onClick={() => navigate(`/programs/${prog.slug}`)}
              className="group bg-white rounded-3xl border border-sage-100 shadow-sm hover:shadow-xl hover:border-sage-300 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-sage-50">
                <img
                  src={prog.imageUrl}
                  alt={prog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="emerald">{prog.difficulty}</Badge>
                  <Badge variant="cream">{prog.category}</Badge>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                  {prog.totalDurationMinutes} mins/session
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-stone-900 group-hover:text-sage-700 transition-colors mb-2">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                    {prog.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-sage-50 flex items-center justify-between text-xs font-semibold text-sage-700">
                  <span>Explore Routine</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Popular Yoga Asanas Showcase */}
      <section className="bg-sage-50/50 py-16 border-y border-sage-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <Badge variant="earth" className="mb-2">Foundation Asanas</Badge>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">
                Popular Yoga Poses
              </h2>
              <p className="text-stone-600 text-sm mt-1 max-w-xl">
                Master essential postures with step-by-step alignment, breathing cues, and safety modifications.
              </p>
            </div>
            <Link
              to="/poses"
              className="inline-flex items-center gap-2 text-sm font-semibold text-sage-700 hover:text-sage-900 transition-colors"
            >
              <span>Explore All 20+ Asanas</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularPoses.map((pose) => (
              <PoseCard
                key={pose.id}
                pose={pose}
                onSelect={(p) => setSelectedPose(p)}
                onPractice={(p) => navigate(`/guided-practice?poseId=${p.id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Benefits of Regular Yoga Practice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="sage" className="mb-2">Holistic Science</Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
            The Transformative Power of Daily Practice
          </h2>
          <p className="text-stone-600 text-base leading-relaxed">
            Yoga is not simply physical exercise; it is an integrated methodology that harmonizes
            the somatic body, the respiratory rhythm, and cognitive discernment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="bg-white p-7 rounded-3xl border border-sage-100 shadow-sm hover:shadow-md transition-shadow relative"
              >
                <div className="w-12 h-12 rounded-2xl bg-sage-100 text-sage-700 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-stone-900 mb-2">
                  {b.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Upcoming Community Events */}
      {upcomingEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <Badge variant="blue" className="mb-2">Community & Gatherings</Badge>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">
                Upcoming Yoga Workshops
              </h2>
              <p className="text-stone-600 text-sm mt-1">
                Participate in immersive virtual masterclasses and hands-on retreats with certified instructors.
              </p>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-sm font-semibold text-sage-700 hover:text-sage-900 transition-colors"
            >
              <span>View All Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.map((ev) => (
              <div
                key={ev.id}
                onClick={() => navigate('/events')}
                className="bg-white rounded-3xl border border-sage-100 shadow-sm hover:shadow-lg transition-all p-6 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant={ev.eventType === 'ONLINE' ? 'blue' : 'amber'}>
                      {ev.eventType}
                    </Badge>
                    <span className="text-xs font-semibold text-sage-700">
                      {ev.seatsLeft ?? (ev.maxSeats - ev.registeredSeats)} seats left
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-stone-900 mb-2">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                    {ev.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-sage-600" />
                    <span>{new Date(ev.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <span className="font-medium text-sage-700">Register →</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Member Testimonials */}
      <section className="bg-cream-100/70 py-20 border-y border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="earth" className="mb-2">Demonstration Community Voice</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
              Stories from Mindful Practitioners
            </h2>
            <p className="text-stone-600 text-sm">
              Discover how regular guided sessions foster sustainable peace in daily life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-3xl border border-cream-300 shadow-sm relative flex flex-col justify-between"
              >
                <div>
                  <Quote className="w-8 h-8 text-sage-300 mb-4" />
                  <p className="text-sm text-stone-700 leading-relaxed italic mb-6">
                    "{t.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-cream-100">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-sage-200"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{t.name}</h4>
                    <p className="text-xs text-stone-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="sage" className="mb-2">Clarity & Answers</Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-stone-600 text-sm">
            Everything you need to know about embarking on your yoga and mindfulness journey.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-sage-100 overflow-hidden transition-all shadow-xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left text-base font-semibold text-stone-800 hover:text-sage-700 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-stone-400 transition-transform duration-200 shrink-0 ml-4 ${
                    openFaq === i ? 'rotate-180 text-sage-600' : ''
                  }`}
                />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 pt-1 text-sm text-stone-600 leading-relaxed border-t border-sage-50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-sage-800 to-sage-900 text-white p-10 sm:p-16 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
              Begin Your Practice Today. <br />
              <span className="italic font-serif text-sage-300">Inner Peace Awaits.</span>
            </h2>
            <p className="text-sage-100 text-sm sm:text-base leading-relaxed">
              Join thousands who have rediscovered posture, serene breathing, and mental clarity.
              Start your first guided session in just 5 minutes without equipment.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/guided-practice"
                className="px-8 py-3.5 rounded-xl bg-white hover:bg-sage-50 text-sage-900 font-semibold text-sm shadow-md transition-all hover:scale-[1.02]"
              >
                Launch Practice Studio
              </Link>
              <Link
                to="/planner"
                className="px-8 py-3.5 rounded-xl bg-sage-700/60 hover:bg-sage-700 text-white font-medium text-sm border border-sage-500/50 transition-all"
              >
                Get Personalized Plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      <PoseDetailModal
        pose={selectedPose}
        onClose={() => setSelectedPose(null)}
        onStartPractice={(p) => navigate(`/guided-practice?poseId=${p.id}`)}
      />
    </div>
  );
};

export default HomePage;
