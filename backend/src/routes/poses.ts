import { Router } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth';
import { Difficulty, PoseCategory } from '@prisma/client';
import { logAdminAction } from '../utils/audit';

const router = Router();

const poseSchema = z.object({
  englishName: z.string().min(2, 'English name is required'),
  sanskritName: z.string().min(2, 'Sanskrit name is required'),
  difficulty: z.nativeEnum(Difficulty),
  category: z.nativeEnum(PoseCategory),
  targetedBodyAreas: z.string().min(2, 'Targeted body areas are required'),
  durationSeconds: z.coerce.number().min(10).max(600),
  instructions: z.string().min(10, 'Step-by-step instructions are required'),
  breathingGuidance: z.string().min(5, 'Breathing guidance is required'),
  benefits: z.string().min(5, 'Benefits are required'),
  contraindications: z.string().min(5, 'Safety precautions/contraindications are required'),
  imageUrl: z.string().url('A valid image URL is required'),
  videoUrl: z.string().url().optional().or(z.literal('')),
});

// GET /api/poses
router.get('/', async (req, res, next) => {
  try {
    const { search, category, difficulty, sortBy = 'englishName', sortOrder = 'asc' } = req.query;

    const where: any = {};

    if (search && typeof search === 'string') {
      const q = search.trim();
      where.OR = [
        { englishName: { contains: q, mode: 'insensitive' } },
        { sanskritName: { contains: q, mode: 'insensitive' } },
        { targetedBodyAreas: { contains: q, mode: 'insensitive' } },
        { benefits: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (category && typeof category === 'string' && category !== 'ALL') {
      where.category = category as PoseCategory;
    }

    if (difficulty && typeof difficulty === 'string' && difficulty !== 'ALL') {
      where.difficulty = difficulty as Difficulty;
    }

    const orderBy: any = {};
    if (sortBy === 'englishName' || sortBy === 'durationSeconds' || sortBy === 'createdAt') {
      orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
    } else {
      orderBy.englishName = 'asc';
    }

    const poses = await prisma.yogaPose.findMany({
      where,
      orderBy,
    });

    return res.json({
      count: poses.length,
      poses,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/poses/:id
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id as string;

    const pose = await prisma.yogaPose.findUnique({
      where: { id },
    });

    if (!pose) {
      return res.status(404).json({ message: 'Yoga pose not found' });
    }

    // Related poses (same category or difficulty, excluding current pose)
    const relatedPoses = await prisma.yogaPose.findMany({
      where: {
        id: { not: id },
        OR: [{ category: pose.category }, { difficulty: pose.difficulty }],
      },
      take: 4,
    });

    return res.json({ pose, relatedPoses });
  } catch (err) {
    next(err);
  }
});

// POST /api/poses (Admin only)
router.post('/', requireAuth, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const data = poseSchema.parse(req.body);

    const pose = await prisma.yogaPose.create({
      data: {
        ...data,
        videoUrl: data.videoUrl || null,
      },
    });

    await logAdminAction({
      userId: req.user!.userId,
      userEmail: req.user!.email,
      action: 'CREATE_POSE',
      entityType: 'YogaPose',
      entityId: pose.id,
      details: `Created pose: ${pose.englishName} (${pose.sanskritName})`,
    });

    return res.status(201).json({ message: 'Pose created successfully', pose });
  } catch (err) {
    next(err);
  }
});

// PUT /api/poses/:id (Admin only)
router.put('/:id', requireAuth, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const data = poseSchema.parse(req.body);

    const existing = await prisma.yogaPose.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Yoga pose not found' });
    }

    const pose = await prisma.yogaPose.update({
      where: { id },
      data: {
        ...data,
        videoUrl: data.videoUrl || null,
      },
    });

    await logAdminAction({
      userId: req.user!.userId,
      userEmail: req.user!.email,
      action: 'UPDATE_POSE',
      entityType: 'YogaPose',
      entityId: pose.id,
      details: `Updated pose: ${pose.englishName}`,
    });

    return res.json({ message: 'Pose updated successfully', pose });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/poses/:id (Admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.yogaPose.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Yoga pose not found' });
    }

    await prisma.yogaPose.delete({ where: { id } });

    await logAdminAction({
      userId: req.user!.userId,
      userEmail: req.user!.email,
      action: 'DELETE_POSE',
      entityType: 'YogaPose',
      entityId: id,
      details: `Deleted pose: ${existing.englishName}`,
    });

    return res.json({ message: 'Pose deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
