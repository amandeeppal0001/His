import express from 'express';
import verifyJWT from '../middleware/authMiddleware.js';
import {
    getAvailableSlots,
    bookAppointment,
    getMyAppointments,
    cancelAppointment,
    getCounselorAppointments,
    updateAppointmentStatus,
    getAllCounselor
} from '../controllers/appointmentController.js';

const router = express.Router();

// Middleware to protect all appointment routes
router.use(verifyJWT);

// --- Student Routes ---
// GET /api/appointments/slots/:counselorId -> Get available slots for a specific counselor
router.get('/slots/:counselorId', getAvailableSlots);

// POST /api/appointments/book -> Book a new appointment
router.post('/book', bookAppointment);

// GET /api/appointments/my-appointments -> Get all appointments for the logged-in student
router.get('/my-appointments', getMyAppointments);

// PATCH /api/appointments/cancel/:appointmentId -> Cancel an appointment
router.patch('/cancel/:appointmentId', cancelAppointment);

router.get('/', getAllCounselor);
// --- Counselor Routes ---
// GET /api/appointments/counselor -> Get all appointments for the logged-in counselor
router.get('/counselor', getCounselorAppointments);

// PATCH /api/appointments/status/:appointmentId -> Update appointment status (e.g., to 'Completed')
router.patch('/status/:appointmentId', updateAppointmentStatus);


export default router;
