import { Router } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { EnrollmentStatus } from '@prisma/client';

const router = Router();

const sessionSchema = z.object({
  programId: z.string().optional().nullable(),
  sessionTitle: z.string().min(2, 'Session title is required'),
  durationSeconds: z.number().min(10, 'Practice must be at least 10 seconds to record').max(7200, 'Duration exceeds reasonable session limit'),
  targetDurationSeconds: z.number().min(10).max(7200),
  completed: z.boolean().default(true),
  startedAt: z.string().transform((val) => new Date(val)).optional(),
  completedAt: z.string().transform((val) => new Date(val)).optional(),
  notes: z.string().max(1000).optional(),
});

export function calculateStreak(sessionDates: Date[]): number {
  if (!sessionDates.length) return 0;

  // Format distinct calendar day keys (YYYY-MM-DD)
  const daySet = new Set<string>();
  sessionDates.forEach((d) => {
    const key = new Date(d).toISOString().split('T')[0];
    daySet.add(key);
  });

  const sortedDays = Array.from(daySet).sort().reverse();
  const todayKey = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().split('T')[0];

  const mostRecent = sortedDays[0];
  if (mostRecent !== todayKey && mostRecent !== yesterdayKey) {
    return 0; // Streak broken
  }

  let streak = 0;
  let checkDate = new Date(mostRecent);

  for (const day of sortedDays) {
    const expectedKey = checkDate.toISOString().split('T')[0];
    if (day === expectedKey) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

// POST /api/sessions - Record practice session
router.post('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.userId;
    const data = sessionSchema.parse(req.body);

    const now = new Date();
    const startedAt = data.startedAt || new Date(now.getTime() - data.durationSeconds * 1000);
    const completedAt = data.completedAt || now;

    // Create session record
    const session = await prisma.practiceSession.create({
      data: {
        userId,
        programId: data.programId || null,
        sessionTitle: data.sessionTitle,
        durationSeconds: data.durationSeconds,
        targetDurationSeconds: data.targetDurationSeconds,
        completed: data.completed,
        startedAt,
        completedAt,
        notes: data.notes || null,
      },
    });

    // If session was tied to a program, update or create program enrollment progress
    if (data.programId) {
      const enrollment = await prisma.programEnrollment.findUnique({
        where: {
          userId_programId: {
            userId,
            programId: data.programId,
          },
        },
      });

      if (enrollment) {
        const nextCount = enrollment.completedSessions + 1;
        const progress = Math.min(100, Math.round((nextCount / 7) * 100));
        await prisma.programEnrollment.update({
          where: { id: enrollment.id },
          data: {
            completedSessions: nextCount,
            progressPercent: progress,
            status: progress >= 100 ? EnrollmentStatus.COMPLETED : EnrollmentStatus.ACTIVE,
            lastPracticedAt: completedAt,
          },
        });
      }
    }

    // Check & unlock achievements
    const newlyUnlocked: string[] = [];

    // All user sessions
    const allSessions = await prisma.practiceSession.findMany({
      where: { userId, completed: true },
      select: { durationSeconds: true, completedAt: true },
    });

    const totalMinutes = Math.floor(allSessions.reduce((acc, s) => acc + s.durationSeconds, 0) / 60);
    const currentStreak = calculateStreak(allSessions.map((s) => s.completedAt));

    // Helper to unlock
    const unlock = async (code: string) => {
      const ach = await prisma.achievement.findUnique({ where: { code } });
      if (ach) {
        const existing = await prisma.userAchievement.findUnique({
          where: { userId_achievementId: { userId, achievementId: ach.id } },
        });
        if (!existing) {
          await prisma.userAchievement.create({
            data: { userId, achievementId: ach.id },
          });
          newlyUnlocked.push(ach.title);
        }
      }
    };

    if (allSessions.length >= 1) await unlock('FIRST_STEP');
    if (totalMinutes >= 60) await unlock('MIN_60');
    if (totalMinutes >= 300) await unlock('MIN_300');
    if (currentStreak >= 3) await unlock('STREAK_3');
    if (currentStreak >= 7) await unlock('STREAK_7');

    return res.status(201).json({
      message: 'Practice session completed and logged successfully!',
      session,
      newlyUnlocked,
      stats: {
        totalMinutes,
        completedSessions: allSessions.length,
        currentStreak,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/sessions/my - Get user session history
router.get('/my', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.userId;
    const { limit = '50' } = req.query;

    const sessions = await prisma.practiceSession.findMany({
      where: { userId },
      include: {
        program: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { completedAt: 'desc' },
      take: parseInt(limit as string, 10),
    });

    return res.json({ sessions });
  } catch (err) {
    next(err);
  }
});

// GET /api/sessions/:id
router.get('/:id', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const session = await prisma.practiceSession.findUnique({
      where: { id },
      include: { program: true },
    });

    if (!session || session.userId !== req.user!.userId) {
      return res.status(404).json({ message: 'Session not found' });
    }

    return res.json({ session });
  } catch (err) {
    next(err);
  }
});

export default router;
