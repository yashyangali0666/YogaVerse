export type Role = 'USER' | 'ADMIN';
export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type PoseCategory =
  | 'STANDING'
  | 'SEATED'
  | 'BALANCING'
  | 'SUPINE'
  | 'PRONE'
  | 'INVERSION'
  | 'RESTORATIVE';

export type ProgramCategory =
  | 'MORNING'
  | 'BEGINNERS'
  | 'FLEXIBILITY'
  | 'STRESS_RELIEF'
  | 'DESK_BREAK'
  | 'EVENING';

export type SectionType = 'WARMUP' | 'MAIN' | 'COOLDOWN';
export type EventType = 'ONLINE' | 'OFFLINE';

export interface UserGoal {
  id: string;
  userId: string;
  dailyMinutesGoal: number;
  weeklyDaysGoal: number;
  targetExperienceLevel: Difficulty;
  focusAreas: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string | null;
  bio?: string | null;
  goal?: UserGoal | null;
}

export interface YogaPose {
  id: string;
  englishName: string;
  sanskritName: string;
  difficulty: Difficulty;
  category: PoseCategory;
  targetedBodyAreas: string;
  durationSeconds: number;
  instructions: string;
  breathingGuidance: string;
  benefits: string;
  contraindications: string;
  imageUrl: string;
  videoUrl?: string | null;
}

export interface ProgramPose {
  id: string;
  programId: string;
  poseId: string;
  orderIndex: number;
  customDurationSeconds?: number | null;
  section: SectionType;
  pose: YogaPose;
}

export interface YogaProgram {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  category: ProgramCategory;
  totalDurationMinutes: number;
  imageUrl: string;
  isPublished: boolean;
  poses?: ProgramPose[];
  poseCount?: number;
  enrollment?: {
    id: string;
    status: 'ACTIVE' | 'COMPLETED';
    progressPercent: number;
    completedSessions: number;
  } | null;
}

export interface ProgramEnrollment {
  id: string;
  userId: string;
  programId: string;
  status: 'ACTIVE' | 'COMPLETED';
  progressPercent: number;
  completedSessions: number;
  enrolledAt: string;
  completedAt?: string | null;
  lastPracticedAt?: string | null;
  program: YogaProgram;
}

export interface PracticeSession {
  id: string;
  userId: string;
  programId?: string | null;
  sessionTitle: string;
  durationSeconds: number;
  targetDurationSeconds: number;
  completed: boolean;
  startedAt: string;
  completedAt: string;
  notes?: string | null;
  program?: {
    id: string;
    title: string;
    slug: string;
  } | null;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  readTimeMinutes: number;
  author: string;
  imageUrl: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  eventType: EventType;
  venue: string;
  eventDate: string;
  durationMinutes: number;
  instructorName: string;
  maxSeats: number;
  registeredSeats: number;
  seatsLeft?: number;
  imageUrl: string;
  isRegistered?: boolean;
  userRegistration?: any;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  badgeIcon: string;
  category: string;
  isUnlocked: boolean;
  unlockedAt?: string | null;
}

export interface DashboardStats {
  stats: {
    totalMinutes: number;
    completedSessions: number;
    currentStreak: number;
    todayMinutes: number;
    dailyGoalMinutes: number;
    goalCompletionPercent: number;
  };
  weeklyActivity: {
    date: string;
    day: string;
    minutes: number;
    target: number;
  }[];
  recentSessions: PracticeSession[];
  enrolledPrograms: ProgramEnrollment[];
  upcomingEvents: Event[];
  achievements: Achievement[];
  recommendedProgram?: YogaProgram | null;
  userGoal?: UserGoal | null;
}
