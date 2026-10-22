import { Router } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { Difficulty } from '@prisma/client';

const router = Router();

const goalSchema = z.object({
  dailyMinutesGoal: z.coerce.number().min(5).max(180),
  weeklyDaysGoal: z.coerce.number().min(1).max(7),
  targetExperienceLevel: z.nativeEnum(Difficulty),
  focusAreas: z.string().min(2),
});

// GET /api/goals
router.get('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.userId;
    let goal = await prisma.userGoal.findUnique({ where: { userId } });

    if (!goal) {
      goal = await prisma.userGoal.create({
        data: {
          userId,
          dailyMinutesGoal: 20,
          weeklyDaysGoal: 5,
          targetExperienceLevel: Difficulty.BEGINNER,
          focusAreas: 'Flexibility, Mindful Calm',
        },
      });
    }

    return res.json({ goal });
  } catch (err) {
    next(err);
  }
});

// PUT /api/goals
router.put('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.userId;
    const data = goalSchema.parse(req.body);

    const goal = await prisma.userGoal.upsert({
      where: { userId },
      create: {
        userId,
        ...data,
      },
      update: data,
    });

    return res.json({ message: 'Wellness goals updated successfully', goal });
  } catch (err) {
    next(err);
  }
});

export default router;
