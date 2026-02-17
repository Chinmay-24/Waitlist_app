/**
 * Sample data insertion script for MongoDB
 * Run this in MongoDB Compass or mongosh to populate the database with sample data
 */

// Add sample restaurants
db.restaurants.insertMany([
  {
    name: "The Italian Kitchen",
    description: "Authentic Italian cuisine with traditional recipes passed down through generations",
    address: "123 Main St, Downtown",
    phone: "555-0123",
    email: "info@italiankit.com",
    cuisine: ["Italian", "Pasta", "Pizza"],
    openingHours: {
      monday: { open: "11:00", close: "23:00" },
      tuesday: { open: "11:00", close: "23:00" },
      wednesday: { open: "11:00", close: "23:00" },
      thursday: { open: "11:00", close: "23:00" },
      friday: { open: "11:00", close: "00:00" },
      saturday: { open: "12:00", close: "00:00" },
      sunday: { open: "12:00", close: "23:00" }
    },
    totalTables: 20
  },
  {
    name: "Spice Route",
    description: "Authentic Indian cuisine with aromatic spices and traditional cooking methods",
    address: "456 Oak Ave, Midtown",
    phone: "555-0124",
    email: "info@spiceroute.com",
    cuisine: ["Indian", "Curry", "Tandoori"],
    openingHours: {
      monday: { open: "12:00", close: "23:30" },
      tuesday: { open: "12:00", close: "23:30" },
      wednesday: { open: "12:00", close: "23:30" },
      thursday: { open: "12:00", close: "23:30" },
      friday: { open: "12:00", close: "00:30" },
      saturday: { open: "11:00", close: "00:30" },
      sunday: { open: "11:00", close: "23:30" }
    },
    totalTables: 25
  },
  {
    name: "Sushi Paradise",
    description: "Premium Japanese sushi and seafood restaurant with expert chefs",
    address: "789 Pine St, Uptown",
    phone: "555-0125",
    email: "info@sushiparadise.com",
    cuisine: ["Japanese", "Sushi", "Seafood"],
    openingHours: {
      monday: { open: "12:00", close: "23:00" },
      tuesday: { open: "12:00", close: "23:00" },
      wednesday: { open: "12:00", close: "23:00" },
      thursday: { open: "12:00", close: "23:00" },
      friday: { open: "12:00", close: "00:00" },
      saturday: { open: "11:00", close: "00:00" },
      sunday: { open: "11:00", close: "22:00" }
    },
    totalTables: 18
  }
]);

// Get the restaurant IDs (you'll need these)
const restaurants = db.restaurants.find({}).toArray();
const italianKitchenId = restaurants[0]._id;
const spiceRouteId = restaurants[1]._id;
const sushiParadiseId = restaurants[2]._id;

// Add sample menu items for Italian Kitchen
db.menuitems.insertMany([
  {
    restaurantId: italianKitchenId,
    name: "Spaghetti Carbonara",
    description: "Classic Italian pasta with creamy egg sauce and pancetta",
    category: "Pasta",
    price: 12.99,
    available: true
  },
  {
    restaurantId: italianKitchenId,
    name: "Margherita Pizza",
    description: "Traditional pizza with fresh mozzarella, basil, and tomato",
    category: "Pizza",
    price: 13.99,
    available: true
  },
  {
    restaurantId: italianKitchenId,
    name: "Risotto al Tartufo",
    description: "Creamy risotto with black truffle",
    category: "Main Course",
    price: 18.99,
    available: true
  },
  {
    restaurantId: italianKitchenId,
    name: "Tiramisu",
    description: "Classic Italian dessert with mascarpone cream",
    category: "Dessert",
    price: 7.99,
    available: true
  }
]);

// Add sample menu items for Spice Route
db.menuitems.insertMany([
  {
    restaurantId: spiceRouteId,
    name: "Butter Chicken",
    description: "Tender chicken in a creamy tomato and butter sauce",
    category: "Main Course",
    price: 13.99,
    available: true
  },
  {
    restaurantId: spiceRouteId,
    name: "Chicken Tandoori",
    description: "Marinated chicken cooked in traditional tandoori oven",
    category: "Main Course",
    price: 14.99,
    available: true
  },
  {
    restaurantId: spiceRouteId,
    name: "Paneer Tikka",
    description: "Grilled cottage cheese with Indian spices",
    category: "Appetizer",
    price: 9.99,
    available: true
  },
  {
    restaurantId: spiceRouteId,
    name: "Garlic Naan",
    description: "Traditional Indian bread with garlic",
    category: "Bread",
    price: 3.99,
    available: true
  }
]);

// Add sample menu items for Sushi Paradise
db.menuitems.insertMany([
  {
    restaurantId: sushiParadiseId,
    name: "California Roll",
    description: "Crab, avocado, and cucumber in sushi rice",
    category: "Sushi Rolls",
    price: 10.99,
    available: true
  },
  {
    restaurantId: sushiParadiseId,
    name: "Salmon Nigiri",
    description: "Fresh salmon over sushi rice",
    category: "Nigiri",
    price: 12.99,
    available: true
  },
  {
    restaurantId: sushiParadiseId,
    name: "Tempura Shrimp",
    description: "Battered and fried shrimp",
    category: "Appetizer",
    price: 11.99,
    available: true
  },
  {
    restaurantId: sushiParadiseId,
    name: "Miso Soup",
    description: "Traditional Japanese soup",
    category: "Soup",
    price: 4.99,
    available: true
  }
]);

console.log("Sample data inserted successfully!");
