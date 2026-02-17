const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const memoryDB = require('../memoryDB');

exports.getMenuItems = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    if (mongoose.connection.readyState === 1) {
      const items = await MenuItem.find({ restaurantId });
      return res.json(items);
    }

    const items = await memoryDB.getMenuItems(restaurantId);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addMenuItem = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    if (mongoose.connection.readyState === 1) {
      const menuItem = new MenuItem({ ...req.body, restaurantId });
      await menuItem.save();
      return res.status(201).json(menuItem);
    }

    const menuItem = await memoryDB.addMenuItem(restaurantId, req.body);
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      const menuItem = await MenuItem.findByIdAndUpdate(id, req.body, { new: true });
      if (!menuItem) return res.status(404).json({ error: 'Menu item not found' });
      return res.json(menuItem);
    }

    const menuItem = await memoryDB.updateMenuItem(id, req.body);
    if (!menuItem) return res.status(404).json({ error: 'Menu item not found' });
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      const menuItem = await MenuItem.findByIdAndDelete(id);
      if (!menuItem) return res.status(404).json({ error: 'Menu item not found' });
      return res.json({ message: 'Menu item deleted' });
    }

    const menuItem = await memoryDB.deleteMenuItem(id);
    if (!menuItem) return res.status(404).json({ error: 'Menu item not found' });
    res.json({ message: 'Menu item deleted (in-memory)' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
