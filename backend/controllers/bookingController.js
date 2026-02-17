const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Restaurant = require('../models/Restaurant');
const memoryDB = require('../memoryDB');

exports.createBooking = async (req, res) => {
  try {
    const { restaurantId, bookingDate, numberOfGuests, specialRequests } = req.body;
    
    if (!restaurantId || !bookingDate || !numberOfGuests) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (mongoose.connection.readyState === 1) {
      const booking = new Booking({ userId: req.userId, restaurantId, bookingDate, numberOfGuests, specialRequests });
      await booking.save();
      return res.status(201).json(booking);
    }

    const booking = await memoryDB.createBooking({ userId: req.userId, restaurantId, bookingDate, numberOfGuests, specialRequests });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const bookings = await Booking.find({ userId: req.userId }).populate('restaurantId').sort({ bookingDate: -1 });
      return res.json(bookings);
    }

    const bookings = await memoryDB.findBookingsByUser(req.userId);
    res.json(bookings.sort((a,b) => new Date(b.bookingDate) - new Date(a.bookingDate)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const booking = await Booking.findById(req.params.id).populate('restaurantId');
      if (!booking) return res.status(404).json({ error: 'Booking not found' });
      return res.json(booking);
    }

    const booking = await memoryDB.findBookingById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!booking) return res.status(404).json({ error: 'Booking not found' });
      return res.json(booking);
    }

    const booking = await memoryDB.updateBooking(req.params.id, req.body);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
      if (!booking) return res.status(404).json({ error: 'Booking not found' });
      return res.json(booking);
    }

    const booking = await memoryDB.cancelBooking(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
