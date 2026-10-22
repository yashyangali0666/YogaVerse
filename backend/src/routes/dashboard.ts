import { Router } from 'express';
import prisma from '../prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { calculateStreak } from './sessions';
import { RegistrationStatus } from '@prisma/client';

const router = Router();

// GET /api/dashboard/stats
router.get('/stats', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.userId;

    // 1. User & Goal
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { goal: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Practice sessions
    const sessions = await prisma.practiceSession.findMany({
      where: { userId, completed: true },
      orderBy: { completedAt: 'desc' },
      include: {
        program: { select: { id: true, title: true, slug: true } },
      },
    });

    const totalSeconds = sessions.reduce((acc, s) => acc + s.durationSeconds, 0);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const completedSessionsCount = sessions.length;

    // Streak
    const currentStreak = calculateStreak(sessions.map((s) => s.completedAt));

    // Today's practice minutes
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySessions = sessions.filter((s) => new Date(s.completedAt) >= today);
    const todayMinutes = Math.floor(
      todaySessions.reduce((acc, s) => acc + s.durationSeconds, 0) / 60
    );

    // 3. Weekly activity (last 7 days: each day's date, day name, minutes practiced)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyActivity: { date: string; day: string; minutes: number; target: number }[] = [];
    const dailyGoal = user.goal?.dailyMinutesGoal || 20;

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);

      const daySessions = sessions.filter((s) => {
        const c = new Date(s.completedAt);
        return c >= d && c < nextD;
      });

      const dayMins = Math.floor(daySessions.reduce((acc, s) => acc + s.durationSeconds, 0) / 60);
      weeklyActivity.push({
        date: d.toISOString().split('T')[0],
        day: dayNames[d.getDay()],
        minutes: dayMins,
        target: dailyGoal,
      });
    }

    // 4. Enrolled programs
    const enrolledPrograms = await prisma.programEnrollment.findMany({
      where: { userId },
      include: {
        program: {
          include: { _count: { select: { poses: true } } },
        },
      },
      orderBy: { lastPracticedAt: 'desc' },
    });

    // 5. Upcoming registered events
    const upcomingEvents = await prisma.eventRegistration.findMany({
      where: {
        userId,
        status: RegistrationStatus.CONFIRMED,
        event: {
          eventDate: { gte: new Date() },
        },
      },
      include: { event: true },
      orderBy: { event: { eventDate: 'asc' } },
      take: 3,
    });

    // 6. Achievements (all achievements with unlocked status)
    const allAchievements = await prisma.achievement.findMany();
    const userUnlocked = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    });

    const unlockedSet = new Map(userUnlocked.map((ua) => [ua.achievementId, ua.unlockedAt]));

    const achievementsList = allAchievements.map((ach) => ({
      id: ach.id,
      code: ach.code,
      title: ach.title,
      description: ach.description,
      badgeIcon: ach.badgeIcon,
      category: ach.category,
      isUnlocked: unlockedSet.has(ach.id),
      unlockedAt: unlockedSet.get(ach.id) || null,
    }));

    // 7. Today's Recommended Practice
    // Based on user experience level or a featured beginner program
    const recommendedProgram = await prisma.yogaProgram.findFirst({
      where: {
        isPublished: true,
        ...(user.goal?.targetExperienceLevel && {
          difficulty: user.goal.targetExperienceLevel,
        }),
      },
      include: {
        poses: {
          include: { pose: true },
          take: 5,
        },
      },
    });

    return res.json({
      stats: {
        totalMinutes,
        completedSessions: completedSessionsCount,
        currentStreak,
        todayMinutes,
        dailyGoalMinutes: dailyGoal,
        goalCompletionPercent: Math.min(100, Math.round((todayMinutes / dailyGoal) * 100)),
      },
      weeklyActivity,
      recentSessions: sessions.slice(0, 5),
      enrolledPrograms,
      upcomingEvents: upcomingEvents.map((r) => r.event),
      achievements: achievementsList,
      recommendedProgram,
      userGoal: user.goal,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
