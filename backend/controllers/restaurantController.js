const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
const memoryDB = require('../memoryDB');

exports.getAllRestaurants = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const restaurants = await Restaurant.find();
      return res.json(restaurants);
    }

    const restaurants = await memoryDB.getAllRestaurants();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const restaurant = await Restaurant.findById(req.params.id);
      if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
      return res.json(restaurant);
    }

    const restaurant = await memoryDB.getRestaurantById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createRestaurant = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const restaurant = new Restaurant(req.body);
      await restaurant.save();
      return res.status(201).json(restaurant);
    }

    const restaurant = await memoryDB.createRestaurant(req.body);
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
