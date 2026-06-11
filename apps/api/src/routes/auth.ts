import { Router } from 'express';
import { z } from 'zod';
import prisma from '@zestify/db';
import crypto from 'crypto';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    // Note: Mocking auth response. In production, use bcrypt to compare passwords
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    res.json({
      success: true,
      data: {
        accessToken: 'mock_jwt_token_123',
        requiresMfa: false
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Invalid payload' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already in use' });
    }

    // Hash password (using crypto for mock, use bcrypt in prod)
    const passwordHash = crypto.createHash('sha256').update(data.password).digest('hex');

    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        profile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
          }
        }
      }
    });

    res.json({ success: true, data: { message: 'User registered', userId: newUser.id } });
  } catch (error: any) {
    console.error("Signup Error:", error);
    res.status(400).json({ success: false, error: error.message || 'Invalid payload or database error', details: error });
  }
});

export default router;
