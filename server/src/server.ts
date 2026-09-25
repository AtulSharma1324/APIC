import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import programRoutes from './routes/programRoutes';
import specializationRoutes from './routes/specializationRoutes';
import semesterRoutes from './routes/semesterRoutes';
import subjectRoutes from './routes/subjectRoutes';
import syllabusRoutes from './routes/syllabusRoutes';
import caRuleRoutes from './routes/caRuleRoutes';
import searchRoutes from './routes/searchRoutes';
import aiRoutes from './routes/aiRoutes';
import adminRoutes from './routes/adminRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint (Requirement #41)
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Academic Information API is running'
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/specializations', specializationRoutes);
app.use('/api/semesters', semesterRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/ca-rules', caRuleRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome to Academic Program and Credit Information System API',
    documentation: '/api/health'
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Bind server for cloud hosting (Render / Local) when not running as Vercel serverless function
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🌐 Academic Info System Server listening on port ${PORT}`);
  });
}

export default app;

