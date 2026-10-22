import { Router } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { requireAuth, optionalAuth, requireAdmin, AuthRequest } from '../middleware/auth';
import { Difficulty, ProgramCategory, SectionType } from '@prisma/client';
import { logAdminAction } from '../utils/audit';

const router = Router();

const programSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  slug: z.string().min(3, 'Slug is required'),
  description: z.string().min(10, 'Description is required'),
  difficulty: z.nativeEnum(Difficulty),
  category: z.nativeEnum(ProgramCategory),
  totalDurationMinutes: z.coerce.number().min(5).max(180),
  imageUrl: z.string().url('A valid image URL is required'),
  isPublished: z.boolean().default(true),
  poses: z.array(
    z.object({
      poseId: z.string(),
      orderIndex: z.number(),
      section: z.nativeEnum(SectionType).default(SectionType.MAIN),
      customDurationSeconds: z.number().optional(),
    })
  ).optional(),
});

// GET /api/programs
router.get('/', optionalAuth, async (req: AuthRequest, res, next) => {
  try {
    const { category, difficulty, search } = req.query;

    const where: any = {};
    if (!req.user || req.user.role !== 'ADMIN') {
      where.isPublished = true;
    }

    if (category && typeof category === 'string' && category !== 'ALL') {
      where.category = category as ProgramCategory;
    }

    if (difficulty && typeof difficulty === 'string' && difficulty !== 'ALL') {
      where.difficulty = difficulty as Difficulty;
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const programs = await prisma.yogaProgram.findMany({
      where,
      include: {
        _count: { select: { poses: true } },
        ...(req.user && {
          enrollments: {
            where: { userId: req.user.userId },
            select: { id: true, status: true, progressPercent: true, completedSessions: true },
          },
        }),
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = programs.map((p) => {
      const userEnrollment = (p as any).enrollments?.[0] || null;
      return {
        ...p,
        poseCount: p._count.poses,
        enrollment: userEnrollment,
      };
    });

    return res.json({ programs: formatted });
  } catch (err) {
    next(err);
  }
});

// GET /api/programs/:id (or slug)
router.get('/:id', optionalAuth, async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;

    const program = await prisma.yogaProgram.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        poses: {
          include: { pose: true },
          orderBy: { orderIndex: 'asc' },
        },
        ...(req.user && {
          enrollments: {
            where: { userId: req.user.userId },
          },
        }),
      },
    });

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    const userEnrollment = (program as any).enrollments?.[0] || null;

    return res.json({
      program: {
        ...program,
        enrollment: userEnrollment,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/programs/:id/enroll
router.post('/:id/enroll', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;

    const program = await prisma.yogaProgram.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    const existingEnrollment = await prisma.programEnrollment.findUnique({
      where: {
        userId_programId: {
          userId,
          programId: program.id,
        },
      },
    });

    if (existingEnrollment) {
      return res.json({
        message: 'You are already enrolled in this program.',
        enrollment: existingEnrollment,
      });
    }

    const enrollment = await prisma.programEnrollment.create({
      data: {
        userId,
        programId: program.id,
        status: 'ACTIVE',
        progressPercent: 0,
        completedSessions: 0,
      },
    });

    return res.status(201).json({
      message: `Successfully enrolled in ${program.title}!`,
      enrollment,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/programs (Admin only)
router.post('/', requireAuth, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const data = programSchema.parse(req.body);
    const { poses, ...programData } = data;

    const program = await prisma.yogaProgram.create({
      data: {
        ...programData,
        poses: poses
          ? {
              create: poses.map((p) => ({
                poseId: p.poseId,
                orderIndex: p.orderIndex,
                section: p.section,
                customDurationSeconds: p.customDurationSeconds,
              })),
            }
          : undefined,
      },
      include: { poses: { include: { pose: true } } },
    });

    await logAdminAction({
      userId: req.user!.userId,
      userEmail: req.user!.email,
      action: 'CREATE_PROGRAM',
      entityType: 'YogaProgram',
      entityId: program.id,
      details: `Created program: ${program.title}`,
    });

    return res.status(201).json({ message: 'Program created successfully', program });
  } catch (err) {
    next(err);
  }
});

// PUT /api/programs/:id (Admin only)
router.put('/:id', requireAuth, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const data = programSchema.parse(req.body);
    const { poses, ...programData } = data;

    const existing = await prisma.yogaProgram.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Program not found' });
    }

    // Update program details
    await prisma.yogaProgram.update({
      where: { id },
      data: programData,
    });

    // Replace poses if provided
    if (poses) {
      await prisma.programPose.deleteMany({ where: { programId: id } });
      await prisma.programPose.createMany({
        data: poses.map((p) => ({
          programId: id,
          poseId: p.poseId,
          orderIndex: p.orderIndex,
          section: p.section,
          customDurationSeconds: p.customDurationSeconds,
        })),
      });
    }

    const updated = await prisma.yogaProgram.findUnique({
      where: { id },
      include: { poses: { include: { pose: true }, orderBy: { orderIndex: 'asc' } } },
    });

    await logAdminAction({
      userId: req.user!.userId,
      userEmail: req.user!.email,
      action: 'UPDATE_PROGRAM',
      entityType: 'YogaProgram',
      entityId: id,
      details: `Updated program: ${updated?.title}`,
    });

    return res.json({ message: 'Program updated successfully', program: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/programs/:id (Admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.yogaProgram.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Program not found' });
    }

    await prisma.yogaProgram.delete({ where: { id } });

    await logAdminAction({
      userId: req.user!.userId,
      userEmail: req.user!.email,
      action: 'DELETE_PROGRAM',
      entityType: 'YogaProgram',
      entityId: id,
      details: `Deleted program: ${existing.title}`,
    });

    return res.json({ message: 'Program deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
