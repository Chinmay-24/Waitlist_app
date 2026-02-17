# RestaurantHub - Restaurant Booking & Ordering Application

A full-stack web application where users can browse restaurants, view menus, place orders, and book tables.

## Tech Stack

- **Frontend**: React 18, React Router, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT

## Project Structure

```
Restoproject/
├── backend/
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Authentication middleware
│   ├── server.js         # Main server file
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── public/           # Static files
    ├── src/
    │   ├── pages/        # React pages
    │   ├── components/   # React components
    │   ├── services/     # API services
    │   ├── styles/       # CSS files
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── .env
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
MONGODB_URI=mongodb://localhost:27017/restaurant-booking
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Features

### User Authentication
- User registration and login
- JWT-based authentication
- Protected routes

### Restaurant Management
- Browse all restaurants
- View restaurant details
- Check opening hours and cuisine types

### Menu & Ordering
- View menu items by category
- Add items to cart
- Manage order quantity
- Place pre-orders before dining

### Table Booking
- Book tables for specific dates and times
- Specify number of guests
- Add special requests
- Cancel bookings

### Order Management
- View order history
- Track order status
- Cancel orders (if not prepared)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID

### Menu
- `GET /api/menu/:restaurantId` - Get menu items for a restaurant
- `POST /api/menu/:restaurantId` - Add menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

### Bookings (Protected)
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Orders (Protected)
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Cancel order

## Sample Data

To populate your database with sample restaurants and menu items, create a script or use MongoDB Compass to insert:

### Sample Restaurant
```json
{
  "_id": ObjectId(),
  "name": "The Italian Kitchen",
  "description": "Authentic Italian cuisine",
  "address": "123 Main St, Downtown",
  "phone": "555-0123",
  "email": "info@italiankit.com",
  "cuisine": ["Italian", "Pasta", "Pizza"],
  "openingHours": {
    "monday": { "open": "11:00", "close": "23:00" },
    "tuesday": { "open": "11:00", "close": "23:00" },
    "wednesday": { "open": "11:00", "close": "23:00" },
    "thursday": { "open": "11:00", "close": "23:00" },
    "friday": { "open": "11:00", "close": "00:00" },
    "saturday": { "open": "12:00", "close": "00:00" },
    "sunday": { "open": "12:00", "close": "23:00" }
  },
  "totalTables": 20
}
```

### Sample Menu Items
```json
{
  "restaurantId": ObjectId("from_above"),
  "name": "Spaghetti Carbonara",
  "description": "Classic Italian pasta with creamy egg sauce",
  "category": "Pasta",
  "price": 12.99,
  "available": true
}
```

## Usage

1. **Register/Login**: Create a new account or login with existing credentials
2. **Browse Restaurants**: View all available restaurants
3. **Select Restaurant**: Click on a restaurant to view menu and booking options
4. **Add to Cart**: Add menu items to your order
5. **Book Table**: Select date, time, and number of guests
6. **Confirm Order**: Review and confirm your order along with booking
7. **Track Order**: Monitor your orders and bookings in the respective pages

## Error Handling

The application includes error handling for:
- Network failures
- Authentication errors
- Validation errors
- Server errors

## Future Enhancements

- [ ] Payment integration
- [ ] Email notifications
- [ ] Rating and reviews
- [ ] Favorites/Wishlist
- [ ] Admin panel for restaurant management
- [ ] Real-time order tracking
- [ ] Mobile app
- [ ] Loyalty programs

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.
