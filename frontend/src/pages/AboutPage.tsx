import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/Badge';
import {
  Sparkles,
  BookOpen,
  Heart,
  Wind,
  ShieldAlert,
  Compass,
  Layers,
  ArrowRight,
  Sun,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const [selectedLimb, setSelectedLimb] = useState<number>(0);

  const eightLimbs = [
    {
      number: 1,
      sanskrit: 'Yama',
      english: 'Universal Ethical Restraints',
      description:
        'The moral principles guiding how we interact with the surrounding world: Ahimsa (non-harm/compassion), Satya (truthfulness), Asteya (non-stealing), Brahmacharya (mindful energy usage), and Aparigraha (non-possessiveness).',
      practice: 'Cultivating patience and loving-kindness during everyday interactions and within internal dialogue.',
    },
    {
      number: 2,
      sanskrit: 'Niyama',
      english: 'Personal Observances',
      description:
        'Internal practices that cultivate personal character: Saucha (mental and bodily purity), Santosha (contentment), Tapas (disciplined zeal), Svadhyaya (self-reflection and study), and Ishvara Pranidhana (surrender to wisdom).',
      practice: 'Developing gratitude for the present moment and establishing consistent daily self-care rituals.',
    },
    {
      number: 3,
      sanskrit: 'Asana',
      english: 'Physical Postures',
      description:
        'Patanjali defines asana in the Yoga Sutras as "sthira sukham asanam" — steady and comfortable. Postures prepare the physical body and spinal column to sit effortlessly in quiet contemplation.',
      practice: 'Practicing postures with mindful breath, honoring natural bodily limits rather than competing.',
    },
    {
      number: 4,
      sanskrit: 'Pranayama',
      english: 'Conscious Breath Regulation',
      description:
        'The expansion and refinement of vitality (Prana) through conscious respiratory pacing. Breath serves as the autonomic bridge directly modulating the sympathetic and parasympathetic nervous systems.',
      practice: 'Box breathing (Sama Vritti) and Alternate Nostril breathing (Nadi Shodhana) to resolve stress.',
    },
    {
      number: 5,
      sanskrit: 'Pratyahara',
      english: 'Sensory Withdrawal',
      description:
        'The conscious inward turning of the senses. Rather than being continuously reactive to external digital stimuli and chaotic noise, awareness gently retreats inward like a tortoise drawing into its shell.',
      practice: 'Taking intentional silence breaks, closing eyes during rest poses, and unplugging from screens.',
    },
    {
      number: 6,
      sanskrit: 'Dharana',
      english: 'Focused Concentration',
      description:
        'Binding the mind to a single focal point — such as the sensation of breath at the nostrils, the flame of a candle (Trataka), or a grounding mantra — preventing fragmented attention.',
      practice: 'Observing the inhalation and exhalation without switching tasks for 5 continuous minutes.',
    },
    {
      number: 7,
      sanskrit: 'Dhyana',
      english: 'Unbroken Meditation',
      description:
        'The natural evolution of concentration into continuous, effortless awareness. While Dharana involves effortful focus, Dhyana is an unbroken stream of conscious perception like oil pouring smoothly from one vessel to another.',
      practice: 'Effortless witnessing of thoughts and sensations without attachment or aversion.',
    },
    {
      number: 8,
      sanskrit: 'Samadhi',
      english: 'Integrated Absorption & Oneness',
      description:
        'The ultimate culmination of yogic sadhana. The meditator, the process of meditation, and the object of meditation merge into unified consciousness, profound clarity, and lasting inner peace.',
      practice: 'Deep tranquility, freedom from compulsive mental loops, and a profound sense of universal harmony.',
    },
  ];

  const pillars = [
    {
      title: 'Asanas (Postures)',
      icon: Layers,
      summary: 'Strengthens musculoskeletal alignment, lubricates joints, and releases somatic tension.',
      details: 'Classical asanas were designed to balance the physical body so the mind could remain steady without aches or restlessness.',
    },
    {
      title: 'Pranayama (Breathwork)',
      icon: Wind,
      summary: 'Modulates heart rate variability and balances the autonomic nervous system.',
      details: 'Breath is the only autonomic bodily function that you can intentionally govern, making it a master dial for mental calmness.',
    },
    {
      title: 'Dhyana (Meditation)',
      icon: Heart,
      summary: 'Rewires brain pathways associated with anxiety, stress reactivity, and attention.',
      details: 'Consistent daily meditation cultivates the prefrontal cortex, promoting emotional resilience and objective awareness.',
    },
    {
      title: 'Yoga Nidra (Deep Relaxation)',
      icon: Sparkles,
      summary: 'Guided conscious rest that restores the endocrine and immune systems.',
      details: 'Practicing systematic body scanning in Savasana triggers profound theta-wave restorative relaxation equivalent to deep sleep.',
    },
  ];

  return (
    <div className="space-y-24 py-12 pb-24">
      {/* 1. Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <Badge variant="sage">Authentic Philosophy & Science</Badge>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight">
          The Art & Science of Yoga
        </h1>
        <p className="text-stone-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          Explore the profound philosophy, historical roots, and somatic sciences that transform
          physical postures into a lifelong journey of inner peace and equilibrium.
        </p>
      </section>

      {/* 2. What Yoga Is & Historical Roots */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="earth">Roots & Philosophy</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">
              Beyond the Mat: Uniting Consciousness
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-stone-700 leading-relaxed">
              <p>
                The word <strong className="text-stone-900">Yoga</strong> originates from the ancient
                Sanskrit root <em>yuj</em>, which translates as <em>“to yoke, unify, or harmonize.”</em>{' '}
                Historically documented over 5,000 years ago in the sacred Vedic texts and Upanishads of
                ancient India, yoga emerged not as physical gymnastics, but as an empirical science of
                consciousness.
              </p>
              <p>
                Around 400 CE, the sage <strong>Patanjali</strong> codified this vast oral tradition
                into the foundational <em>Yoga Sutras</em>. In Sutra 1.2, he defined the entire essence
                of yoga in four words:
              </p>
              <div className="p-4 rounded-2xl bg-cream-100 border border-cream-200 text-stone-900 font-serif italic text-base">
                “Yogas Chitta Vritti Nirodha” <br />
                <span className="text-xs text-stone-600 font-sans not-italic block mt-1">
                  — Yoga is the intentional quieting of the fluctuations of the mind.
                </span>
              </div>
              <p>
                In the modern era, yoga bridges ancient meditative wisdom with polyvagal science,
                biomechanics, and neuroplasticity.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-sage-100">
              <img
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80"
                alt="Classical Yoga Philosophy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 p-6 rounded-2xl bg-white border border-sage-200 shadow-xl max-w-xs hidden sm:block">
              <div className="flex items-center gap-3">
                <Sun className="w-8 h-8 text-amber-500 shrink-0" />
                <p className="text-xs text-stone-700 font-medium">
                  "Steady, comfortable embodiment leads to radiant mental stillness."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Eight Limbs (Ashtanga) Interactive Showcase */}
      <section id="eight-limbs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="sage" className="mb-2">Classical Architecture</Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
            The Eight Limbs of Patanjali (Ashtanga)
          </h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            Patanjali compared yoga to an eight-limbed tree where every component grows harmoniously
            together to nourish the whole being.
          </p>
        </div>

        {/* Limbs Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-8">
          {eightLimbs.map((limb, index) => (
            <button
              key={index}
              onClick={() => setSelectedLimb(index)}
              className={`p-3 rounded-2xl text-center transition-all border ${
                selectedLimb === index
                  ? 'bg-sage-600 text-white border-sage-600 shadow-md shadow-sage-600/20 scale-105'
                  : 'bg-white text-stone-700 border-sage-100 hover:border-sage-300 hover:bg-sage-50'
              }`}
            >
              <span className="block text-xs font-bold uppercase tracking-wider opacity-75">
                Limb {limb.number}
              </span>
              <span className="font-display font-semibold text-sm truncate block mt-0.5">
                {limb.sanskrit}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Limb Active Detail Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-sage-200 shadow-xl">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-sage-100 text-sage-800 font-bold flex items-center justify-center text-sm">
                #{eightLimbs[selectedLimb].number}
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
                {eightLimbs[selectedLimb].sanskrit}
              </h3>
              <span className="text-sm font-serif italic text-sage-600">
                ({eightLimbs[selectedLimb].english})
              </span>
            </div>

            <p className="text-base text-stone-700 leading-relaxed pt-2">
              {eightLimbs[selectedLimb].description}
            </p>

            <div className="pt-4 border-t border-sage-100">
              <span className="text-xs uppercase font-bold tracking-wider text-sage-700 block mb-1">
                Practical Daily Application
              </span>
              <p className="text-sm text-stone-600 bg-sage-50/70 p-4 rounded-xl border border-sage-100/80">
                {eightLimbs[selectedLimb].practice}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Four Core Practices (Asana, Pranayama, Meditation, Relaxation) */}
      <section className="bg-sage-50/50 py-20 border-y border-sage-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="earth" className="mb-2">Practice Pillars</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
              The Four Somatic Pillars
            </h2>
            <p className="text-stone-600 text-sm">
              How regular practice systematically rejuvenates the physical body and cognitive attention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((pil, idx) => {
              const Icon = pil.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-7 border border-sage-100 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-sage-100 text-sage-700 flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-stone-900 mb-2">
                      {pil.title}
                    </h3>
                    <p className="text-xs text-sage-700 font-semibold mb-3">{pil.summary}</p>
                    <p className="text-xs text-stone-600 leading-relaxed">{pil.details}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Benefits & Realistic Limitations of Yoga */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="sage" className="mb-2">Honest Perspective</Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
            Benefits & Thoughtful Limitations
          </h2>
          <p className="text-stone-600 text-sm">
            We believe in honest, scientifically-grounded wellness rather than unrealistic promises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Proven Benefits */}
          <div className="bg-emerald-50/50 rounded-3xl p-8 border border-emerald-200/80 space-y-4">
            <div className="flex items-center gap-2 text-emerald-900 font-display text-2xl font-bold">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <span>Documented Benefits</span>
            </div>
            <ul className="space-y-3 text-sm text-emerald-950/80">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Substantially improves spinal mobility, hamstring flexibility, and postural stability.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Down-regulates salivary cortisol and sympathetic nervous system hyper-arousal.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Strengthens deep transverse abdominals, scapular stabilizers, and hip flexors.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Enhances cognitive working memory, emotional regulation, and sleep onset latency.</span>
              </li>
            </ul>
          </div>

          {/* Genuine Limitations */}
          <div className="bg-amber-50/50 rounded-3xl p-8 border border-amber-200/80 space-y-4">
            <div className="flex items-center gap-2 text-amber-900 font-display text-2xl font-bold">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              <span>Honest Limitations</span>
            </div>
            <ul className="space-y-3 text-sm text-amber-950/80">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Yoga is not a substitute for clinical medical intervention, prescription medication, or surgery.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Does not replace progressive cardiovascular endurance training (like brisk walking or swimming).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Excessive force in postures like lotus or extreme backbends can lead to ligamentous strain if rushed.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Results accrue through consistent, patient months rather than instant overnight cures.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Beginners Safety Precautions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 space-y-6">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldCheck className="w-6 h-6" />
            <span className="text-xs uppercase tracking-widest font-bold">Safety Guide</span>
          </div>
          <h2 className="font-display text-3xl font-bold">Ahimsa: Practicing Safely with Self-Honor</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-stone-300">
            <div className="bg-stone-800/80 p-5 rounded-2xl border border-stone-700">
              <h4 className="font-bold text-white mb-2">1. Never Force Past Pinching Pain</h4>
              <p className="leading-relaxed">
                Healthy stretching feels warm and diffuse. Sharp, electric, joint, or pinching pain is
                your body’s clear signal to back off immediately.
              </p>
            </div>
            <div className="bg-stone-800/80 p-5 rounded-2xl border border-stone-700">
              <h4 className="font-bold text-white mb-2">2. Breathe Continuously</h4>
              <p className="leading-relaxed">
                If you find yourself gasping or holding your breath during a pose, you have pushed
                beyond your current physiological threshold. Soften the posture.
              </p>
            </div>
            <div className="bg-stone-800/80 p-5 rounded-2xl border border-stone-700">
              <h4 className="font-bold text-white mb-2">3. Warm Up & Cool Down</h4>
              <p className="leading-relaxed">
                Always begin with gentle joint mobilization (like Cat-Cow) and conclude with at least
                3–5 minutes of silent Savasana to integrate benefits.
              </p>
            </div>
          </div>
          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              to="/poses"
              className="px-6 py-3 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-medium text-sm transition-all"
            >
              Explore Pose Alignment
            </Link>
            <Link
              to="/guided-practice"
              className="px-6 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-medium text-sm transition-all"
            >
              Try a Gentle 5-Minute Practice
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
