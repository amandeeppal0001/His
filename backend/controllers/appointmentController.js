import { Appointment } from '../models/Appointment.model.js';
import { Counselor } from '../models/Counselor.model.js';
import  User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import moment from "moment-timezone";

// --- Student Controllers ---

/**
 * @desc    Get available appointment slots for a counselor on a given date
 * @route   GET /api/appointments/slots/:counselorId?date=YYYY-MM-DD
 * @access  Private (Student)
 */
export const getAvailableSlots = asyncHandler(async (req, res) => {
    const { counselorId } = req.params;
    const { date } = req.query; // Expecting date in 'YYYY-MM-DD' format

    if (!date) {
        throw new ApiError(400, "Date query parameter is required.");
    }

    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.toLocaleString('en-US', { weekday: 'long' }); // e.g., "Monday"

    const counselor = await Counselor.findById(counselorId);
    if (!counselor) {
        throw new ApiError(404, "Counselor not found.");
    }

    const dayAvailabilities = counselor.availability.filter(d => d.day === dayOfWeek && d.isAvailable);
    // if (!dayAvailability) {
    //     return res.status(200).json(new ApiResponse(200, [], "Counselor is not available on this day."));
    // }

    if (dayAvailabilities.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], "Counselor is not available on this day."));
}

    // Get appointments already booked for that day
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const existingAppointments = await Appointment.find({
        counselor: counselorId,
        appointmentTime: { $gte: startOfDay, $lte: endOfDay },
        status: 'Scheduled'
    });

    const bookedTimes = new Set(existingAppointments.map(app => app.appointmentTime.toISOString()));

    let availableSlots = [];
    const slotDuration = 60; // in minutes

    for (const availability of dayAvailabilities) {
    const [startHour, startMinute] = availability.startTime.split(':').map(Number);
    const [endHour, endMinute] = availability.endTime.split(':').map(Number);
    
    let currentTime = new Date(requestedDate);
    currentTime.setHours(startHour, startMinute, 0, 0);

    let endTime = new Date(requestedDate);
    endTime.setHours(endHour, endMinute, 0, 0);

    while (currentTime < endTime) {
        // if (!bookedTimes.has(currentTime.toISOString())) {
        //     availableSlots.push(new Date(currentTime));
        // }

         const slotEnd = new Date(currentTime.getTime() + slotDuration * 60000);
const isOverlapping = existingAppointments.some(app => {
  return (
    (currentTime >= app.appointmentTime && currentTime < app.endTime) ||
    (slotEnd > app.appointmentTime && slotEnd <= app.endTime)
  );
});

if (!isOverlapping) {
  availableSlots.push(new Date(currentTime));
}

        currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
    }
    }
    // --- right after availableSlots is built ---
availableSlots.sort((a,b) => a - b); // optional: ensure sorted

const timezone = 'Asia/Kolkata'; // change to whichever timezone you want
const formattedSlots = availableSlots.map(slot => {
  // get parts using Intl so we can build a clean YYYY-MM-DDTHH:mm string
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).formatToParts(slot);

  const map = {};
  for (const { type, value } of parts) {
    map[type] = value;
  }

  // format: 2025-09-20T18:00
  return `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}`;
});

res.status(200).json(new ApiResponse(200, formattedSlots, "Available slots fetched successfully."));

    // const [startHour, startMinute] = dayAvailability.startTime.split(':').map(Number);
    // const [endHour, endMinute] = dayAvailability.endTime.split(':').map(Number);
    
    // let currentTime = new Date(requestedDate);
    // currentTime.setUTCHours(startHour, startMinute, 0, 0);

    // let endTime = new Date(requestedDate);
    // endTime.setUTCHours(endHour, endMinute, 0, 0);

    // while (currentTime < endTime) {
    //     if (!bookedTimes.has(currentTime.toISOString())) {
    //         availableSlots.push(new Date(currentTime));
    //     }
    //     currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
    // }


    
    // res.status(200).json(new ApiResponse(200, availableSlots, "Available slots fetched successfully."));
});

export const getAllCounselor = asyncHandler(async (req, res) => {
    const counselors = await Counselor.find().sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, counselors, "All counselors fetched successfully."));
});
/**
 * @desc    Book an appointment with a counselor
 * @route   POST /api/appointments/book
 * @access  Private (Student)
 */
export const bookAppointment = asyncHandler(async (req, res) => {
    const { counselorId, appointmentTime, mode } = req.body;
    const studentId = req.user._id;
    console.log(`Attempting to book for counselor: ${counselorId}`);
    console.log(`Requested time: ${appointmentTime}`);
    console.log(`Requested mode: ${mode}`);

    if (!counselorId || !appointmentTime) {
        console.log("Counselor ID and appointment time are required.");
        throw new ApiError(400, "Counselor ID and appointment time are required.");
        
        
    }
     // Validate that time includes both date and time
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(appointmentTime)) {
                console.log("Appointment time must include both date and time in format YYYY-MM-DDTHH:mm");

        throw new ApiError(400, "Appointment time must include both date and time in format YYYY-MM-DDTHH:mm");
    }


    const appointmentDate = new Date(appointmentTime);
const now = new Date();
if (appointmentDate < now) {
    console.log("You cannot book an appointment in the past.");
    
    throw new ApiError(400, "You cannot book an appointment in the past.");
}

    // 1️⃣ Get counselor and their availability
const counselor = await Counselor.findById(counselorId);
    if (!counselor) {
        console.log("Counselor not found.");
        throw new ApiError(404, "Counselor not found.");
    }

    const dayOfWeek = appointmentDate.toLocaleString('en-US', { weekday: 'long' });
    const dayAvailability = counselor.availability.find(
        d => d.day === dayOfWeek && d.isAvailable
    );

    if (!dayAvailability) {
        console.log(`Counselor is not available on ${dayOfWeek}.`);
        
        throw new ApiError(400, `Counselor is not available on ${dayOfWeek}.`);
    }

    // 2️⃣ Check if the time is inside working hours
    const [startHour, startMinute] = dayAvailability.startTime.split(':').map(Number);
    const [endHour, endMinute] = dayAvailability.endTime.split(':').map(Number);

    const startTime = new Date(appointmentDate);
    startTime.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date(appointmentDate);
    endTime.setHours(endHour, endMinute, 0, 0);

    if (appointmentDate < startTime || appointmentDate >= endTime) {
        console.log(`Appointment time must be between ${dayAvailability.startTime} and ${dayAvailability.endTime} on ${dayOfWeek}.You should only book hour one before of counselor's endtime availibility hour `);
        
        throw new ApiError(400, `Appointment time must be between ${dayAvailability.startTime} and ${dayAvailability.endTime} on ${dayOfWeek}.You should only book hour one before of counselor's endtime availibility hour `);
    }



 const slotDurationMinutes = 60;
const slotEndTime = new Date(appointmentDate.getTime() + slotDurationMinutes * 60000);
// const slotDurationMinutes = 60;
// const slotEndTime  = new Date(appointmentDate.getTime() + slotDurationMinutes * 60000);


    // Check if the slot is still available
    const existingAppointment = await Appointment.findOne({
        counselor: counselorId,
        appointmentTime: { $gte: appointmentDate, $lt: slotEndTime  },
        status: 'Scheduled'
    });

    if (existingAppointment) {
        console.log("This appointment slot is no longer available.");
        
        throw new ApiError(409, "This appointment slot is no longer available.");
    }
    
    // 4️⃣ Create appointment (still stored in UTC)
  const appointment = await Appointment.create({
    student: studentId,
    counselor: counselorId,
    appointmentTime: appointmentDate,
    endTime: slotEndTime,
    mode,
  });

  // 5️⃣ Convert dates to IST (or any other timezone) before sending response
  const timezone = "Asia/Kolkata";
  const formattedAppointment = {
    ...appointment.toObject(),
    appointmentTime: moment(appointment.appointmentTime)
      .tz(timezone)
      .format("YYYY-MM-DD HH:mm"),
    endTime: moment(appointment.endTime).tz(timezone).format("YYYY-MM-DD HH:mm"),
  };

  res
    .status(201)
    .json(
      new ApiResponse(201, formattedAppointment, "Appointment booked successfully.")
    );
});
    
    // const appointment = await Appointment.create({
    //     student: studentId,
    //     counselor: counselorId,
    //     appointmentTime: appointmentDate,
    //      endTime:slotEndTime,
    //     mode
    // });

    // res.status(201).json(new ApiResponse(201, appointment, "Appointment booked successfully."));
    // console.log("Appointment booked successfully.");
    
// });

/**
 * @desc    Get appointments for the logged-in student
 * @route   GET /api/appointments/my-appointments
 * @access  Private (Student)
 */
export const getMyAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find({ student: req.user._id })
        .populate({
            path: 'counselor',
            populate: {
                path: 'user',
                select: 'name email'
            }
        })
        .sort({ appointmentTime: -1 });

        
  // Format dates into Asia/Kolkata
  const timezone = "Asia/Kolkata";
  const formattedAppointments = appointments.map(app => ({
    ...app.toObject(),
    appointmentTime: moment(app.appointmentTime).tz(timezone).format("YYYY-MM-DDTHH:mm"),
    endTime: moment(app.endTime).tz(timezone).format("YYYY-MM-DDTHH:mm"),
    createdAt: moment(app.createdAt).tz(timezone).format("YYYY-MM-DD HH:mm"),
    updatedAt: moment(app.updatedAt).tz(timezone).format("YYYY-MM-DD HH:mm"),
  }));

  res
    .status(200)
    .json(new ApiResponse(200, formattedAppointments, "Student's appointments fetched successfully."));

    // res.status(200).json(new ApiResponse(200, appointments, "Student's appointments fetched successfully."));
});

/**
 * @desc    Cancel a scheduled appointment
 * @route   PATCH /api/appointments/cancel/:appointmentId
 * @access  Private (Student)
 */
export const cancelAppointment = asyncHandler(async (req, res) => {
    const { appointmentId } = req.params;
    const studentId = req.user._id;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
        throw new ApiError(404, "Appointment not found.");
    }

    // Ensure the student owns this appointment
    if (appointment.student.toString() !== studentId.toString()) {
        throw new ApiError(403, "You are not authorized to cancel this appointment.");
    }

    if (appointment.status !== 'Scheduled') {
        throw new ApiError(400, "Only scheduled appointments can be cancelled.");
    }
    
    appointment.status = 'Cancelled';
    await appointment.save();

    res.status(200).json(new ApiResponse(200, appointment, "Appointment cancelled successfully."));
});


// --- Counselor Controllers ---

/**
 * @desc    Get appointments for the logged-in counselor
 * @route   GET /api/appointments/counselor
 * @access  Private (Counselor)
 */
export const getCounselorAppointments = asyncHandler(async (req, res) => {
    // Find the counselor profile linked to the logged-in user
    const counselorProfile = await Counselor.findOne({ user: req.user._id });
    if (!counselorProfile) {
        throw new ApiError(404, "Counselor profile not found for the logged-in user.");
    }

    const appointments = await Appointment.find({ counselor: counselorProfile._id })
        .populate('student', 'name email')
        .sort({ appointmentTime: -1 });

const timezone = "Asia/Kolkata";
  const formattedAppointments = appointments.map(app => ({
    ...app.toObject(),
    appointmentTime: moment(app.appointmentTime).tz(timezone).format("YYYY-MM-DDTHH:mm"),
    endTime: moment(app.endTime).tz(timezone).format("YYYY-MM-DDTHH:mm"),
    createdAt: moment(app.createdAt).tz(timezone).format("YYYY-MM-DD HH:mm"),
    updatedAt: moment(app.updatedAt).tz(timezone).format("YYYY-MM-DD HH:mm"),
  }));

  res
    .status(200)
    .json(new ApiResponse(200, formattedAppointments, "Student's appointments fetched successfully."));

    // res.status(200).json(new ApiResponse(200, appointments, "Counselor's appointments fetched successfully."));
});

/**
 * @desc    Update the status of an appointment
 * @route   PATCH /api/appointments/status/:appointmentId
 * @access  Private (Counselor)
 */
export const updateAppointmentStatus = asyncHandler(async (req, res) => {
    const { appointmentId } = req.params;
    const { status, notes } = req.body; // e.g., status: 'Completed', 'No-show'

    if (!status) {
        throw new ApiError(400, "Status is required.");
    }

    const counselorProfile = await Counselor.findOne({ user: req.user._id });
    if (!counselorProfile) {
        throw new ApiError(404, "Counselor profile not found.");
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
        throw new ApiError(404, "Appointment not found.");
    }

    // Ensure the counselor owns this appointment
    if (appointment.counselor.toString() !== counselorProfile._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this appointment.");
    }

    appointment.status = status;
    if (notes) {
        appointment.notes = notes;
    }
    await appointment.save();
    

    const timezone = "Asia/Kolkata";
    const formattedAppointment = {
        ...appointment.toObject(),
        appointmentTime: moment(appointment.appointmentTime).tz(timezone).format("YYYY-MM-DDTHH:mm"),
        endTime: moment(appointment.endTime).tz(timezone).format("YYYY-MM-DDTHH:mm"),
        createdAt: moment(appointment.createdAt).tz(timezone).format("YYYY-MM-DD HH:mm"),
        updatedAt: moment(appointment.updatedAt).tz(timezone).format("YYYY-MM-DD HH:mm"),
    };

    res.status(200).json(new ApiResponse(200, formattedAppointment, "Appointment status updated successfully."));
    
    // res.status(200).json(new ApiResponse(200, appointment, "Appointment status updated successfully."));
});
