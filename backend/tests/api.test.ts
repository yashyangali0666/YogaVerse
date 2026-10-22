import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/prisma';

let userToken: string;
let adminToken: string;
let testUserId: string;

describe('YogaLife Full-Stack API Suite', () => {
  beforeAll(async () => {
    // Obtain token for seeded admin and user
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@yogalife.com', password: 'Admin@123' });
    adminToken = adminLogin.body.token;

    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'demo@yogalife.com', password: 'User@123' });
    userToken = userLogin.body.token;
    testUserId = userLogin.body.user.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Health & Public Endpoints', () => {
    it('GET /api/health should return ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });

    it('GET /api/poses should return poses list with count >= 20', async () => {
      const res = await request(app).get('/api/poses');
      expect(res.status).toBe(200);
      expect(res.body.poses.length).toBeGreaterThanOrEqual(20);
    });

    it('GET /api/programs should return published yoga programs', async () => {
      const res = await request(app).get('/api/programs');
      expect(res.status).toBe(200);
      expect(res.body.programs.length).toBeGreaterThanOrEqual(5);
    });

    it('GET /api/articles should return educational articles', async () => {
      const res = await request(app).get('/api/articles');
      expect(res.status).toBe(200);
      expect(res.body.articles.length).toBeGreaterThanOrEqual(5);
    });

    it('GET /api/events should return upcoming events', async () => {
      const res = await request(app).get('/api/events');
      expect(res.status).toBe(200);
      expect(res.body.events.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Authentication & Protection', () => {
    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'demo@yogalife.com', password: 'WrongPassword' });
      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Invalid email or password');
    });

    it('should reject unauthenticated access to /api/auth/me', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('should return current user with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('demo@yogalife.com');
    });

    it('should register a new user successfully', async () => {
      const randomEmail = `test_${Date.now()}@yogalife.com`;
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: randomEmail,
          password: 'Password123!',
          name: 'Ananya Roy',
        });
      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(randomEmail);
    });
  });

  describe('Personal Dashboard & Practice Tracking', () => {
    it('GET /api/dashboard/stats should return personalized user stats', async () => {
      const res = await request(app)
        .get('/api/dashboard/stats')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.stats).toBeDefined();
      expect(res.body.weeklyActivity).toBeDefined();
      expect(res.body.weeklyActivity.length).toBe(7);
      expect(res.body.achievements).toBeDefined();
    });

    it('POST /api/sessions should log practice and return updated stats', async () => {
      const res = await request(app)
        .post('/api/sessions')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          sessionTitle: 'Morning Awakening Test Flow',
          durationSeconds: 300,
          targetDurationSeconds: 300,
          completed: true,
          notes: 'Test session verification',
        });
      expect(res.status).toBe(201);
      expect(res.body.session.durationSeconds).toBe(300);
      expect(res.body.stats.completedSessions).toBeGreaterThanOrEqual(1);
    });

    it('PUT /api/goals should update practice goal', async () => {
      const res = await request(app)
        .put('/api/goals')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          dailyMinutesGoal: 25,
          weeklyDaysGoal: 6,
          targetExperienceLevel: 'INTERMEDIATE',
          focusAreas: 'Flexibility, Spinal Strength',
        });
      expect(res.status).toBe(200);
      expect(res.body.goal.dailyMinutesGoal).toBe(25);
    });
  });

  describe('Personalized Yoga Planner', () => {
    it('POST /api/planner/recommend should generate rule-based routine with disclaimer', async () => {
      const res = await request(app)
        .post('/api/planner/recommend')
        .send({
          experienceLevel: 'BEGINNER',
          availableMinutes: 15,
          sessionType: 'GENTLE',
          wellnessGoals: ['stress_relief', 'flexibility'],
          timeOfDay: 'MORNING',
        });
      expect(res.status).toBe(200);
      expect(res.body.recommendation).toBeDefined();
      expect(res.body.recommendation.disclaimer).toContain('general wellness guidance');
      expect(res.body.recommendation.suggestedPoses.length).toBeGreaterThan(0);
    });
  });

  describe('Role-Based Authorization & Administration', () => {
    it('should deny non-admin access to admin endpoints', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Administrator privileges required');
    });

    it('should allow admin access to /api/admin/stats', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.stats.totalUsers).toBeGreaterThanOrEqual(2);
      expect(res.body.stats.totalPoses).toBeGreaterThanOrEqual(20);
    });
  });
});
