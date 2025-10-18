# TeenPrint Web - Full-Stack Product Printing Platform

A professional full-stack web application for custom product printing (T-shirts, mugs, photo gifts) with design editor, payment integration, and order management.

## 🎨 Features

- **User Authentication**: Email/password + Google OAuth 2.0
- **Product Catalog**: Browse, search, and filter products
- **Design Editor**: Fabric.js-based editor with image upload, text, and customization
- **Shopping Cart**: Add custom designs, apply coupons
- **Payment**: Razorpay integration for secure payments
- **Order Management**: Track orders with status updates
- **Notifications**: Email (SendGrid) and SMS (Twilio) notifications
- **Admin Dashboard**: Manage products, orders, users, and coupons
- **Shipping**: Shiprocket API integration for tracking
- **Invoice**: Auto-generate PDF invoices

## 🛠 Tech Stack

### Frontend
- React 18 + Vite
- Redux Toolkit (State Management)
- React Router (Routing)
- Tailwind CSS (Styling)
- Fabric.js (Design Editor)
- Formik + Yup (Forms & Validation)
- Axios (API Client)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Passport.js (Google OAuth)
- Cloudinary (Image Storage)
- Razorpay (Payments)
- SendGrid (Email)
- Twilio/MSG91 (SMS)
- Shiprocket (Shipping)
- PDFKit (Invoice Generation)

## 📁 Project Structure

```
TeenPrintWeb/
├── frontend/          # React frontend
├── backend/           # Node.js backend
├── PROJECT_TODO.md    # Detailed implementation checklist
├── FOLDER_STRUCTURE.md # Complete file structure
└── IMPLEMENTATION_GUIDE.md # Step-by-step guide
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- MongoDB (local or Atlas)
- Cloudinary account
- Razorpay account (test mode)
- SendGrid account
- Google OAuth credentials

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

Backend runs at: `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with API URL and keys
npm run dev
```

Frontend runs at: `http://localhost:5173`

## 📝 Implementation Status

### ✅ Completed
- Project structure and configurations
- Database models (User, Product, Design, Cart, Order, Coupon)
- Authentication system (JWT + Google OAuth)
- Cloudinary integration
- Email service setup
- Redux store and auth slice
- Tailwind CSS theming

### 🔄 In Progress
See `PROJECT_TODO.md` for detailed task breakdown:
- Week 2-3: Backend APIs (Products, Cart, Orders, Payment)
- Week 4-6: Frontend pages (Design Editor, Cart, Checkout)
- Week 7: Testing and integration
- Week 8: Deployment

## 🔑 Key Features Implementation

### 1. Design Editor
- Built with Fabric.js for canvas manipulation
- Upload images to Cloudinary
- Add/edit text with custom fonts
- Save designs with preview generation

### 2. Payment Flow
1. User completes cart → proceeds to checkout
2. Backend creates Razorpay order
3. Frontend opens Razorpay checkout
4. On success → verify payment signature
5. Create order → send confirmation emails

### 3. Order Tracking
- Real-time status updates (Processing → Printing → Shipped → Delivered)
- Shiprocket integration for tracking numbers
- Email + SMS notifications at each stage
- Downloadable PDF invoices

## 📚 Documentation

- **[PROJECT_TODO.md](./PROJECT_TODO.md)** - Complete checklist with component details
- **[FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)** - Full project structure
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Step-by-step implementation guide
- **[backend/README.md](./backend/README.md)** - Backend API documentation
- **[frontend/README.md](./frontend/README.md)** - Frontend documentation (to be created)

## 🎯 Development Roadmap

### Phase 1: MVP (Weeks 1-4)
- ✅ Setup and database design
- 🔄 Core backend APIs
- 🔄 Basic frontend pages
- 🔄 Design editor prototype

### Phase 2: Features (Weeks 5-6)
- Payment integration
- Cart and checkout flow
- Order management
- Email notifications

### Phase 3: Admin & Polish (Week 7)
- Admin dashboard
- Analytics
- Testing
- Bug fixes

### Phase 4: Deployment (Week 8)
- Backend → Render
- Frontend → Vercel
- Production setup
- Go live! 🚀

## 🔐 Security

- JWT-based authentication with refresh tokens
- Password hashing (bcrypt)
- Rate limiting
- CORS configuration
- Input validation
- XSS protection (Helmet.js)
- HTTPS in production

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Backend (Render)
1. Push to GitHub
2. Connect to Render
3. Set environment variables
4. Deploy

### Frontend (Vercel)
1. Push to GitHub
2. Import project to Vercel
3. Set environment variables
4. Deploy

## 🤝 Contributing

This is a professional implementation. Follow the coding standards:
- ESLint configuration
- Prettier formatting
- Meaningful commit messages
- Component documentation

## 📄 License

MIT License

## 📞 Support

For implementation help, refer to:
- `IMPLEMENTATION_GUIDE.md` for step-by-step instructions
- `PROJECT_TODO.md` for task checklist
- Individual README files in each folder

---

**Built with ❤️ using React, Node.js, and modern web technologies**
