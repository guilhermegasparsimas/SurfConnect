import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import controllers
import { register, login } from './controllers/authController.js';
import {
  createClass,
  listAllClasses,
  listAllBookings,
  listInstructors,
  getAdminMetrics,
  listInstructorClasses,
  markAttendance,
  listAvailableClasses,
  createBooking,
  listStudentBookings,
  getWeather
} from './controllers/classController.js';

// Import middlewares
import { authenticateToken, checkRole } from './middlewares/authMiddleware.js';

dotenv.config();

const app = express();

// Configure CORS to allow local React app connections
app.use(cors({
  origin: '*', // For demo purposes, allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Public Routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

// Protected Routes (require a valid JWT token)
app.get('/api/weather', authenticateToken, getWeather);

// STUDENT routes
app.get('/api/student/classes', authenticateToken, checkRole(['STUDENT']), listAvailableClasses);
app.get('/api/student/bookings', authenticateToken, checkRole(['STUDENT']), listStudentBookings);
app.post('/api/student/bookings', authenticateToken, checkRole(['STUDENT']), createBooking);

// INSTRUCTOR routes
app.get('/api/instructor/classes', authenticateToken, checkRole(['INSTRUCTOR']), listInstructorClasses);
app.post('/api/instructor/attendance', authenticateToken, checkRole(['INSTRUCTOR']), markAttendance);

// ADMIN routes
app.post('/api/admin/classes', authenticateToken, checkRole(['ADMIN']), createClass);
app.get('/api/admin/classes', authenticateToken, checkRole(['ADMIN']), listAllClasses);
app.get('/api/admin/bookings', authenticateToken, checkRole(['ADMIN']), listAllBookings);
app.get('/api/admin/instructors', authenticateToken, checkRole(['ADMIN']), listInstructors);
app.get('/api/admin/metrics', authenticateToken, checkRole(['ADMIN']), getAdminMetrics);

// Basic health check route
app.get('/', (req, res) => {
  res.json({ status: 'active', message: 'SurfConnect API is running smoothly.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo deu errado no servidor!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[SurfConnect] Servidor rodando em http://localhost:${PORT}`);
});
