/* Seed Bangalore sample restaurants and menu items.
   Usage: node seed-bangalore.js
   Inserts into MongoDB when connected, otherwise into memoryDB fallback.
*/
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
const memoryDB = require('./memoryDB');

const restaurants = [
  {
    name: 'Garden City Café',
    description: 'Cozy café serving continental and Indian favourites',
    address: 'Indiranagar, Bangalore',
    phone: '080-1234-0001',
    email: 'hello@gardencity.example',
    cuisine: ['Café', 'Continental', 'Indian'],
    openingHours: { monday: {open:'08:00',close:'22:00'}, tuesday:{open:'08:00',close:'22:00'}, wednesday:{open:'08:00',close:'22:00'}, thursday:{open:'08:00',close:'22:00'}, friday:{open:'08:00',close:'23:00'}, saturday:{open:'09:00',close:'23:00'}, sunday:{open:'09:00',close:'21:00'} },
    totalTables: 25
  },
  {
    name: 'Bangalore Spice House',
    description: 'Traditional South Indian and Karnataka specialties',
    address: 'MG Road, Bangalore',
    phone: '080-1234-0002',
    email: 'info@spicehouse.example',
    cuisine: ['South Indian', 'Karnataka'],
    openingHours: { monday: {open:'10:00',close:'22:00'}, tuesday:{open:'10:00',close:'22:00'}, wednesday:{open:'10:00',close:'22:00'}, thursday:{open:'10:00',close:'22:00'}, friday:{open:'10:00',close:'23:00'}, saturday:{open:'10:00',close:'23:00'}, sunday:{open:'10:00',close:'22:00'} },
    totalTables: 40
  },
  {
    name: 'Brew & Bites',
    description: 'Popular brewpub with wood-fired pizzas and sharing plates',
    address: 'Koramangala, Bangalore',
    phone: '080-1234-0003',
    email: 'contact@brewbites.example',
    cuisine: ['Brewpub', 'Pizza', 'Global'],
    openingHours: { monday: {open:'12:00',close:'23:00'}, tuesday:{open:'12:00',close:'23:00'}, wednesday:{open:'12:00',close:'23:00'}, thursday:{open:'12:00',close:'23:00'}, friday:{open:'12:00',close:'01:00'}, saturday:{open:'12:00',close:'01:00'}, sunday:{open:'12:00',close:'22:00'} },
    totalTables: 30
  }
];

const menus = {
  'Garden City Café': [
    { name: 'Avocado Toast', description: 'Sourdough toast with smashed avocado', category: 'Breakfast', price: 350, available: true },
    { name: 'Masala Dosa', description: 'Crispy dosa with potato masala', category: 'South Indian', price: 180, available: true },
    { name: 'Espresso', description: 'Single shot espresso', category: 'Beverages', price: 120, available: true }
  ],
  'Bangalore Spice House': [
    { name: 'Ragi Mudde', description: 'Traditional finger millet balls with sambar', category: 'Karnataka', price: 140, available: true },
    { name: 'Bisi Bele Bath', description: 'Spiced rice with lentils and vegetables', category: 'Main', price: 160, available: true },
    { name: 'Filter Coffee', description: 'South Indian filter coffee', category: 'Beverages', price: 60, available: true }
  ],
  'Brew & Bites': [
    { name: 'Margherita Pizza', description: 'Wood-fired pizza with fresh basil', category: 'Pizza', price: 420, available: true },
    { name: 'BBQ Chicken Wings', description: 'Smoky wings with house sauce', category: 'Starters', price: 320, available: true },
    { name: 'Craft Lager (500ml)', description: 'House-brewed lager', category: 'Beverages', price: 250, available: true }
  ]
};

async function seed() {
  try {
    const connected = mongoose.connection.readyState === 1;
    if (connected) console.log('MongoDB connected - seeding into MongoDB');
    else console.log('MongoDB not connected - seeding into in-memory DB');

    for (const r of restaurants) {
      let created;
      if (connected) {
        created = await Restaurant.create(r);
      } else {
        created = await memoryDB.createRestaurant(r);
      }
      console.log('Created restaurant:', created.name, created._id);

      const items = menus[created.name] || [];
      for (const it of items) {
        if (connected) {
          await MenuItem.create({ ...it, restaurantId: created._id });
        } else {
          await memoryDB.addMenuItem(created._id, it);
        }
      }
    }

    console.log('Seeding completed.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
