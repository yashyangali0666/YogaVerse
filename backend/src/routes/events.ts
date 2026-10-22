import { Router } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { requireAuth, optionalAuth, requireAdmin, AuthRequest } from '../middleware/auth';
import { EventType, RegistrationStatus } from '@prisma/client';
import { logAdminAction } from '../utils/audit';

const router = Router();

const eventSchema = z.object({
  title: z.string().min(5, 'Title is required'),
  description: z.string().min(10, 'Description is required'),
  eventType: z.nativeEnum(EventType),
  venue: z.string().min(3, 'Venue or stream link description is required'),
  eventDate: z.string().transform((val) => new Date(val)),
  durationMinutes: z.coerce.number().min(15).max(480),
  instructorName: z.string().min(2, 'Instructor name is required'),
  maxSeats: z.coerce.number().min(1).max(1000),
  imageUrl: z.string().url('A valid image URL is required'),
  isPublished: z.boolean().default(true),
});

// GET /api/events/my-registrations
router.get('/my-registrations', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const registrations = await prisma.eventRegistration.findMany({
      where: {
        userId: req.user!.userId,
        status: RegistrationStatus.CONFIRMED,
      },
      include: {
        event: true,
      },
      orderBy: { registeredAt: 'desc' },
    });

    return res.json({ registrations });
  } catch (err) {
    next(err);
  }
});

// GET /api/events
router.get('/', optionalAuth, async (req: AuthRequest, res, next) => {
  try {
    const { type, timeframe } = req.query;

    const where: any = {};
    if (!req.user || req.user.role !== 'ADMIN') {
      where.isPublished = true;
    }

    if (type && (type === 'ONLINE' || type === 'OFFLINE')) {
      where.eventType = type as EventType;
    }

    if (timeframe === 'upcoming') {
      where.eventDate = { gte: new Date() };
    } else if (timeframe === 'past') {
      where.eventDate = { lt: new Date() };
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        ...(req.user && {
          registrations: {
            where: {
              userId: req.user.userId,
              status: RegistrationStatus.CONFIRMED,
            },
            select: { id: true, status: true, registeredAt: true },
          },
        }),
      },
      orderBy: { eventDate: 'asc' },
    });

    const formatted = events.map((ev) => ({
      ...ev,
      isRegistered: (ev as any).registrations?.length > 0,
      userRegistration: (ev as any).registrations?.[0] || null,
      seatsLeft: Math.max(0, ev.maxSeats - ev.registeredSeats),
    }));

    return res.json({ events: formatted });
  } catch (err) {
    next(err);
  }
});

// GET /api/events/:id
router.get('/:id', optionalAuth, async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        ...(req.user && {
          registrations: {
            where: {
              userId: req.user.userId,
              status: RegistrationStatus.CONFIRMED,
            },
          },
        }),
      },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const isRegistered = (event as any).registrations?.length > 0;
    const userRegistration = (event as any).registrations?.[0] || null;

    return res.json({
      event: {
        ...event,
        isRegistered,
        userRegistration,
        seatsLeft: Math.max(0, event.maxSeats - event.registeredSeats),
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/events/:id/register
router.post('/:id/register', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.registeredSeats >= event.maxSeats) {
      return res.status(400).json({ message: 'This event is fully booked. No seats remaining.' });
    }

    const existing = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: { eventId: id, userId },
      },
    });

    if (existing && existing.status === RegistrationStatus.CONFIRMED) {
      return res.status(400).json({ message: 'You are already registered for this event.' });
    }

    // Register user & increment registeredSeats in a transaction
    const [registration] = await prisma.$transaction([
      prisma.eventRegistration.upsert({
        where: { eventId_userId: { eventId: id, userId } },
        create: {
          eventId: id,
          userId,
          status: RegistrationStatus.CONFIRMED,
        },
        update: {
          status: RegistrationStatus.CONFIRMED,
          registeredAt: new Date(),
        },
      }),
      prisma.event.update({
        where: { id },
        data: { registeredSeats: { increment: 1 } },
      }),
    ]);

    return res.status(201).json({
      message: `Registration confirmed for ${event.title}!`,
      registration,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/events/:id/register (Cancel registration)
router.delete('/:id/register', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.userId;

    const existing = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: { eventId: id, userId },
      },
    });

    if (!existing || existing.status === RegistrationStatus.CANCELLED) {
      return res.status(400).json({ message: 'No active registration found for this event.' });
    }

    await prisma.$transaction([
      prisma.eventRegistration.update({
        where: { id: existing.id },
        data: { status: RegistrationStatus.CANCELLED },
      }),
      prisma.event.update({
        where: { id },
        data: { registeredSeats: { decrement: 1 } },
      }),
    ]);

    return res.json({ message: 'Registration cancelled successfully.' });
  } catch (err) {
    next(err);
  }
});

// POST /api/events (Admin only)
router.post('/', requireAuth, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const data = eventSchema.parse(req.body);

    const event = await prisma.event.create({ data });

    await logAdminAction({
      userId: req.user!.userId,
      userEmail: req.user!.email,
      action: 'CREATE_EVENT',
      entityType: 'Event',
      entityId: event.id,
      details: `Created event: ${event.title}`,
    });

    return res.status(201).json({ message: 'Event created successfully', event });
  } catch (err) {
    next(err);
  }
});

// PUT /api/events/:id (Admin only)
router.put('/:id', requireAuth, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const data = eventSchema.parse(req.body);

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const event = await prisma.event.update({
      where: { id },
      data,
    });

    await logAdminAction({
      userId: req.user!.userId,
      userEmail: req.user!.email,
      action: 'UPDATE_EVENT',
      entityType: 'Event',
      entityId: id,
      details: `Updated event: ${event.title}`,
    });

    return res.json({ message: 'Event updated successfully', event });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/events/:id (Admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await prisma.event.delete({ where: { id } });

    await logAdminAction({
      userId: req.user!.userId,
      userEmail: req.user!.email,
      action: 'DELETE_EVENT',
      entityType: 'Event',
      entityId: id,
      details: `Deleted event: ${existing.title}`,
    });

    return res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// GET /api/events/:id/attendees (Admin only)
router.get('/:id/attendees', requireAuth, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;

    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId: id, status: RegistrationStatus.CONFIRMED },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
      orderBy: { registeredAt: 'asc' },
    });

    const attendees = (registrations as any[]).map((r) => ({
      ...r.user,
      registeredAt: r.registeredAt,
    }));

    return res.json({ attendees });
  } catch (err) {
    next(err);
  }
});

export default router;
