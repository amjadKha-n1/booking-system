const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// CORS Configuration
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/payments', paymentRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!' 
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});