const mongoose = require('mongoose');
const Order = require('../models/Order');
const memoryDB = require('../memoryDB');

exports.createOrder = async (req, res) => {
  try {
    const { restaurantId, bookingId, items } = req.body;

    if (!restaurantId || !items || items.length === 0) {
      return res.status(400).json({ error: 'Restaurant ID and items are required' });
    }

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (mongoose.connection.readyState === 1) {
      const order = new Order({ userId: req.userId, restaurantId, bookingId, items, totalAmount });
      await order.save();
      return res.status(201).json(order);
    }

    const order = await memoryDB.createOrder({ userId: req.userId, restaurantId, bookingId, items });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const orders = await Order.find({ userId: req.userId }).populate('restaurantId').sort({ createdAt: -1 });
      return res.json(orders);
    }

    const orders = await memoryDB.findOrdersByUser(req.userId);
    res.json(orders.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const order = await Order.findById(req.params.id).populate('restaurantId').populate('items.menuItemId');
      if (!order) return res.status(404).json({ error: 'Order not found' });
      return res.json(order);
    }

    const order = await memoryDB.findOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (mongoose.connection.readyState === 1) {
      const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (!order) return res.status(404).json({ error: 'Order not found' });
      return res.json(order);
    }

    const order = await memoryDB.updateOrderStatus(req.params.id, status);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const order = await Order.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
      if (!order) return res.status(404).json({ error: 'Order not found' });
      return res.json(order);
    }

    const order = await memoryDB.cancelOrder(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
