import { Router } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { EnrollmentStatus } from '@prisma/client';

const router = Router();

// GET /api/enrollments/my
router.get('/my', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const enrollments = await prisma.programEnrollment.findMany({
      where: { userId: req.user!.userId },
      include: {
        program: {
          include: {
            _count: { select: { poses: true } },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    return res.json({ enrollments });
  } catch (err) {
    next(err);
  }
});

// POST /api/enrollments/:id/progress
router.post('/:id/progress', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const progressSchema = z.object({
      progressPercent: z.number().min(0).max(100).optional(),
      incrementSessions: z.boolean().default(true),
    });

    const { progressPercent, incrementSessions } = progressSchema.parse(req.body);

    const enrollment = await prisma.programEnrollment.findUnique({
      where: { id },
      include: { program: true },
    });

    if (!enrollment || enrollment.userId !== req.user!.userId) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    const newCompletedSessions = incrementSessions
      ? enrollment.completedSessions + 1
      : enrollment.completedSessions;

    // Calculate new progress percent if not explicitly provided
    // Assume 7 sessions for full program completion
    const calculatedPercent = progressPercent !== undefined
      ? progressPercent
      : Math.min(100, Math.round((newCompletedSessions / 7) * 100));

    const isCompleted = calculatedPercent >= 100;

    const updated = await prisma.programEnrollment.update({
      where: { id },
      data: {
        completedSessions: newCompletedSessions,
        progressPercent: calculatedPercent,
        status: isCompleted ? EnrollmentStatus.COMPLETED : EnrollmentStatus.ACTIVE,
        completedAt: isCompleted ? new Date() : enrollment.completedAt,
        lastPracticedAt: new Date(),
      },
      include: { program: true },
    });

    // Check achievement unlock if completed
    if (isCompleted) {
      const completerAch = await prisma.achievement.findUnique({ where: { code: 'PROGRAM_COMPLETER' } });
      if (completerAch) {
        await prisma.userAchievement.upsert({
          where: {
            userId_achievementId: {
              userId: req.user!.userId,
              achievementId: completerAch.id,
            },
          },
          create: { userId: req.user!.userId, achievementId: completerAch.id },
          update: {},
        });
      }
    }

    return res.json({ message: 'Enrollment progress updated', enrollment: updated });
  } catch (err) {
    next(err);
  }
});

export default router;
