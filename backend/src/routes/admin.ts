import { Router } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth';
import { Role } from '@prisma/client';
import { logAdminAction } from '../utils/audit';

const router = Router();

// Apply auth and admin check to all admin routes
router.use(requireAuth, requireAdmin);

// GET /api/admin/stats
router.get('/stats', async (req: AuthRequest, res, next) => {
  try {
    const [
      totalUsers,
      totalSessions,
      sessionAgg,
      totalEnrollments,
      totalEventRegistrations,
      totalPoses,
      totalPrograms,
      totalArticles,
      totalEvents,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.practiceSession.count({ where: { completed: true } }),
      prisma.practiceSession.aggregate({
        _sum: { durationSeconds: true },
        where: { completed: true },
      }),
      prisma.programEnrollment.count(),
      prisma.eventRegistration.count(),
      prisma.yogaPose.count(),
      prisma.yogaProgram.count(),
      prisma.article.count(),
      prisma.event.count(),
    ]);

    const totalMinutes = Math.floor((sessionAgg._sum.durationSeconds || 0) / 60);

    return res.json({
      stats: {
        totalUsers,
        totalSessions,
        totalMinutes,
        totalEnrollments,
        totalEventRegistrations,
        totalPoses,
        totalPrograms,
        totalArticles,
        totalEvents,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/users
router.get('/users', async (req: AuthRequest, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: {
            sessions: true,
            enrollments: true,
            registrations: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ users });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/users/:id/role
router.put('/users/:id/role', async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const { role } = z.object({ role: z.nativeEnum(Role) }).parse(req.body);

    if (id === req.user!.userId && role !== Role.ADMIN) {
      return res.status(400).json({ message: 'You cannot revoke your own administrator role.' });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, name: true, role: true },
    });

    await logAdminAction({
      userId: req.user!.userId,
      userEmail: req.user!.email,
      action: 'UPDATE_USER_ROLE',
      entityType: 'User',
      entityId: id,
      details: `Changed role of user ${updated.email} to ${role}`,
    });

    return res.json({ message: 'User role updated successfully', user: updated });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/audit-logs
router.get('/audit-logs', async (req: AuthRequest, res, next) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return res.json({ logs });
  } catch (err) {
    next(err);
  }
});

export default router;
