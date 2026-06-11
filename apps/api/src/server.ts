import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Try loading local .env, then root monorepo .env
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
import authRoutes from './routes/auth';
import aiRoutes from './routes/ai';
import billingRoutes from './routes/billing';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/billing', billingRoutes);

app.get('/api/v1/system/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(port, () => {
  console.log(`Zestify API running on port ${port}`);
});
