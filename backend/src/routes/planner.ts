import { Router } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { Difficulty, PoseCategory } from '@prisma/client';

const router = Router();

const plannerInputSchema = z.object({
  experienceLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  availableMinutes: z.coerce.number().min(5).max(60),
  sessionType: z.enum(['GENTLE', 'FLOW', 'RESTORATIVE', 'STRENGTH', 'DESK_BREAK']),
  wellnessGoals: z.array(z.string()).min(1, 'Select at least one wellness goal'),
  timeOfDay: z.enum(['MORNING', 'AFTERNOON', 'EVENING']),
});

// POST /api/planner/recommend
router.post('/recommend', async (req, res, next) => {
  try {
    const input = plannerInputSchema.parse(req.body);

    // Rule-based matching for recommended program
    let programSlug = '7-day-yoga-for-beginners';

    if (input.sessionType === 'DESK_BREAK') {
      programSlug = 'desk-break-yoga';
    } else if (input.timeOfDay === 'MORNING' || input.wellnessGoals.includes('energy')) {
      programSlug = 'morning-energy-and-alignment';
    } else if (input.timeOfDay === 'EVENING' || input.wellnessGoals.includes('sleep')) {
      programSlug = 'evening-wind-down-routine';
    } else if (input.wellnessGoals.includes('flexibility')) {
      programSlug = 'flexibility-and-mobility';
    } else if (input.wellnessGoals.includes('stress_relief') || input.sessionType === 'RESTORATIVE') {
      programSlug = 'relaxation-and-mindfulness';
    }

    const matchedProgram = await prisma.yogaProgram.findUnique({
      where: { slug: programSlug },
      include: {
        poses: {
          include: { pose: true },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    // Rule-based pose selection matching categories
    const categoryFilter: PoseCategory[] = [];
    if (input.sessionType === 'GENTLE' || input.sessionType === 'RESTORATIVE') {
      categoryFilter.push(PoseCategory.RESTORATIVE, PoseCategory.SEATED, PoseCategory.SUPINE);
    } else if (input.sessionType === 'STRENGTH') {
      categoryFilter.push(PoseCategory.STANDING, PoseCategory.BALANCING, PoseCategory.PRONE);
    } else if (input.sessionType === 'FLOW') {
      categoryFilter.push(PoseCategory.STANDING, PoseCategory.INVERSION, PoseCategory.PRONE);
    } else {
      categoryFilter.push(PoseCategory.STANDING, PoseCategory.SEATED, PoseCategory.RESTORATIVE);
    }

    const candidatePoses = await prisma.yogaPose.findMany({
      where: {
        difficulty: input.experienceLevel as Difficulty,
        category: { in: categoryFilter },
      },
      take: 6,
    });

    // Fallback if none found for strict difficulty
    const posesToUse = candidatePoses.length > 0
      ? candidatePoses
      : await prisma.yogaPose.findMany({ take: 5 });

    // Time budget breakdown
    const warmUpMins = Math.max(1, Math.round(input.availableMinutes * 0.2));
    const coolDownMins = Math.max(1, Math.round(input.availableMinutes * 0.2));
    const mainMins = Math.max(2, input.availableMinutes - warmUpMins - coolDownMins);

    return res.json({
      recommendation: {
        routineTitle: `${input.timeOfDay.charAt(0) + input.timeOfDay.slice(1).toLowerCase()} ${
          input.sessionType.charAt(0) + input.sessionType.slice(1).toLowerCase()
        } Practice (${input.availableMinutes} min)`,
        summary: `Customized routine tailored for ${input.experienceLevel.toLowerCase()} practitioners focusing on ${input.wellnessGoals.join(', ')}.`,
        timeAllocation: {
          warmUpMinutes: warmUpMins,
          mainPracticeMinutes: mainMins,
          coolDownMinutes: coolDownMins,
          totalMinutes: input.availableMinutes,
        },
        matchedProgram,
        suggestedPoses: posesToUse,
        guidelines: [
          'Move at your own rhythmic pace and never push through joint or sharp pain.',
          'Keep your breath smooth, steady, and audible in the back of your throat.',
          input.timeOfDay === 'MORNING'
            ? 'Hydrate with warm lemon water before practice to awaken your digestive fire.'
            : 'Allow a calm space free of phone notifications to receive maximum parasympathetic benefit.',
        ],
        disclaimer: 'These personalized suggestions are general wellness guidance and are not medical advice. If you have any acute injuries, spinal disc conditions, or are pregnant, please consult your physician or a certified clinical yoga therapist before commencing any practice.',
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
