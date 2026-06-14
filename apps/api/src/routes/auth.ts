import { Router } from 'express';
import { z } from 'zod';
import prisma from '@zestify/db';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'zestify-dev-secret-k8x9m2p5v7w3';

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

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { profile: true }
    });
    
    if (!user || !user.passwordHash) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Verify password hash
    const inputHash = crypto.createHash('sha256').update(data.password).digest('hex');
    if (user.passwordHash !== inputHash) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check user status
    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ success: false, error: 'Account is not active' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.profile
          ? `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim()
          : user.email,
        role: 'user'
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      data: {
        accessToken: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.profile
            ? `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim()
            : user.email,
        },
        requiresMfa: false
      }
    });
  } catch (error: any) {
    console.error("Login Error:", error);
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

    // Hash password with SHA-256
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
    res.status(400).json({ success: false, error: error.message || 'Invalid payload or database error' });
  }
});

export default router;
