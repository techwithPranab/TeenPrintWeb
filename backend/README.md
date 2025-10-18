# TeenPrint Backend

Backend API for TeenPrint - Custom Product Printing Platform

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT + Passport (Google OAuth)
- **File Storage**: Cloudinary
- **Payment**: Razorpay
- **Email**: SendGrid
- **SMS**: Twilio / MSG91
- **Shipping**: Shiprocket API

## Getting Started

### Prerequisites

- Node.js >= 18.x
- MongoDB (local or MongoDB Atlas)
- Cloudinary account
- Razorpay account (test mode)
- SendGrid account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`

4. Start development server:
```bash
npm run dev
```

5. Server will run at: `http://localhost:5000`

## API Endpoints

### Authentication (`/api/v1/auth`)

- `POST /register` - Register with email/password
- `POST /login` - Login with email/password
- `GET /google` - Initiate Google OAuth
- `GET /google/callback` - Google OAuth callback
- `POST /refresh` - Refresh access token
- `GET /me` - Get current user (protected)
- `PUT /profile` - Update profile (protected)
- `POST /logout` - Logout (protected)

### Products (`/api/v1/products`)

- `GET /` - List products (with filters)
- `GET /:id` - Get product details
- `POST /` - Create product (admin)
- `PUT /:id` - Update product (admin)
- `DELETE /:id` - Delete product (admin)

### Design Editor (`/api/v1/designs`)

- `POST /` - Save design
- `GET /:id` - Load design
- `PUT /:id` - Update design
- `DELETE /:id` - Delete design
- `GET /user/:userId` - User's designs

### Cart (`/api/v1/cart`)

- `GET /` - Get cart
- `POST /add` - Add item to cart
- `PUT /item/:itemId` - Update item quantity
- `DELETE /item/:itemId` - Remove item
- `POST /apply-coupon` - Apply coupon
- `DELETE /clear` - Clear cart

### Orders (`/api/v1/orders`)

- `POST /create` - Create order
- `POST /verify-payment` - Verify Razorpay payment
- `GET /` - Order history
- `GET /:id` - Order details
- `GET /:id/invoice` - Download invoice
- `POST /:id/reorder` - Reorder
- `GET /:id/track` - Track order

### Admin (`/api/v1/admin`)

- `GET /dashboard` - Dashboard analytics
- `GET /orders` - All orders
- `PUT /orders/:id/status` - Update order status
- `GET /users` - All users
- `POST /coupons` - Create coupon
- `GET /coupons` - List coupons

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   └── app.js           # Express app setup
├── server.js            # Entry point
├── package.json
└── .env
```

## Development

```bash
# Run development server with auto-reload
npm run dev

# Run production server
npm start

# Run tests
npm test
```

## Deployment

The backend is designed to be deployed on **Render** or similar platforms.

### Environment Variables to Set

All variables from `.env.example` must be configured in production.

## Security Features

- Helmet.js for security headers
- CORS configured
- Rate limiting
- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- MongoDB injection prevention

## License

MIT
