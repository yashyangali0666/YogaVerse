import { Router } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth';
import { logAdminAction } from '../utils/audit';

const router = Router();

const articleSchema = z.object({
  title: z.string().min(5, 'Title is required'),
  slug: z.string().min(3, 'Slug is required'),
  category: z.string().min(2, 'Category is required'),
  summary: z.string().min(10, 'Summary is required'),
  content: z.string().min(20, 'Content is required'),
  readTimeMinutes: z.coerce.number().min(1).max(60),
  author: z.string().default('YogaLife Wellness Team'),
  imageUrl: z.string().url('A valid image URL is required'),
  isPublished: z.boolean().default(true),
});

// GET /api/articles
router.get('/', async (req, res, next) => {
  try {
    const { category, search } = req.query;

    const where: any = { isPublished: true };

    if (category && typeof category === 'string' && category !== 'ALL') {
      where.category = category;
    }

    if (search && typeof search === 'string') {
      const q = search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { summary: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
      ];
    }

    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ articles });
  } catch (err) {
    next(err);
  }
});

// GET /api/articles/:id (or slug)
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id as string;

    const article = await prisma.article.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Related articles in same category
    const related = await prisma.article.findMany({
      where: {
        id: { not: article.id },
        category: article.category,
        isPublished: true,
      },
      take: 3,
    });

    return res.json({ article, related });
  } catch (err) {
    next(err);
  }
});

// POST /api/articles (Admin only)
router.post('/', requireAuth, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const data = articleSchema.parse(req.body);

    const article = await prisma.article.create({
      data,
    });

    await logAdminAction({
      userId: req.user!.userId,
      userEmail: req.user!.email,
      action: 'CREATE_ARTICLE',
      entityType: 'Article',
      entityId: article.id,
      details: `Created article: ${article.title}`,
    });

    return res.status(201).json({ message: 'Article created successfully', article });
  } catch (err) {
    next(err);
  }
});

// PUT /api/articles/:id (Admin only)
router.put('/:id', requireAuth, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const data = articleSchema.parse(req.body);

    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const article = await prisma.article.update({
      where: { id },
      data,
    });

    await logAdminAction({
      userId: req.user!.userId,
      userEmail: req.user!.email,
      action: 'UPDATE_ARTICLE',
      entityType: 'Article',
      entityId: id,
      details: `Updated article: ${article.title}`,
    });

    return res.json({ message: 'Article updated successfully', article });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/articles/:id (Admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Article not found' });
    }

    await prisma.article.delete({ where: { id } });

    await logAdminAction({
      userId: req.user!.userId,
      userEmail: req.user!.email,
      action: 'DELETE_ARTICLE',
      entityType: 'Article',
      entityId: id,
      details: `Deleted article: ${existing.title}`,
    });

    return res.json({ message: 'Article deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
