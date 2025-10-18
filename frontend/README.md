# TeenPrint Frontend

React frontend for TeenPrint custom product printing platform.

## Tech Stack

- React 18
- Vite (Build tool)
- Redux Toolkit (State management)
- React Router (Routing)
- Tailwind CSS (Styling)
- Fabric.js (Design editor)
- Axios (API client)
- Formik + Yup (Forms)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Setup Environment

```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-name
```

### Start Development Server

```bash
npm run dev
```

App runs at: `http://localhost:5173`

## Project Structure

```
src/
├── app/                 # Redux store
├── assets/              # Images, icons
├── components/          # Reusable components
│   ├── layout/         # Header, Footer, Navbar
│   ├── common/         # Button, Input, Modal
│   ├── auth/           # Auth components
│   ├── products/       # Product components
│   ├── editor/         # Design editor components
│   ├── cart/           # Cart components
│   └── admin/          # Admin components
├── features/           # Redux slices
│   ├── auth/
│   ├── products/
│   ├── cart/
│   └── orders/
├── hooks/              # Custom hooks
├── pages/              # Route pages
├── routes/             # Route config
├── services/           # API services
├── styles/             # Global styles
└── utils/              # Helper functions
```

## Available Pages

### Implemented
- ✅ Login - `/login`

### To Implement
- [ ] Register - `/register`
- [ ] Home - `/`
- [ ] Products - `/products`
- [ ] Product Detail - `/products/:id`
- [ ] Design Editor - `/editor/:productId`
- [ ] Cart - `/cart`
- [ ] Checkout - `/checkout`
- [ ] Orders - `/orders`
- [ ] Order Detail - `/orders/:id`
- [ ] Profile - `/profile`
- [ ] Admin Dashboard - `/admin`

## Key Features

### 1. Design Editor

Built with Fabric.js for canvas-based design:

```javascript
import { fabric } from 'fabric';

// Initialize canvas
const canvas = new fabric.Canvas('design-canvas', {
  width: 500,
  height: 500
});

// Add image
fabric.Image.fromURL(imageUrl, (img) => {
  img.scaleToWidth(300);
  canvas.add(img);
});

// Add text
const text = new fabric.Text('Your Text', {
  fontSize: 40,
  fill: '#000000'
});
canvas.add(text);

// Save design
const json = canvas.toJSON();
```

### 2. State Management

Using Redux Toolkit:

```javascript
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';

const dispatch = useDispatch();
const { items } = useSelector(state => state.cart);

// Add item to cart
dispatch(addToCart({ product, design, quantity }));
```

### 3. API Calls

Using Axios with interceptors:

```javascript
import api from '../services/api';

// GET request
const products = await api.get('/products');

// POST request
const order = await api.post('/orders', orderData);
```

### 4. Forms

Using Formik + Yup:

```javascript
import { useFormik } from 'formik';
import * as Yup from 'yup';

const formik = useFormik({
  initialValues: { email: '', password: '' },
  validationSchema: Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().min(6).required(),
  }),
  onSubmit: async (values) => {
    await dispatch(login(values));
  }
});
```

## Components to Build

### High Priority

1. **Header Component** - Navigation with cart icon
2. **Product Card** - Display product with "Customize" button
3. **Product Filters** - Category, price, search
4. **Design Editor** - Main canvas with tools
5. **Cart Items** - List cart items with design preview
6. **Checkout Form** - Address, payment

### Medium Priority

7. **Order Timeline** - Visual status tracker
8. **Product Gallery** - Image carousel
9. **Admin Tables** - Orders, products management
10. **Dashboard Charts** - Analytics (Recharts)

### Low Priority

11. **Reviews** - Product reviews
12. **Wishlist** - Save favorites
13. **Notifications** - Toast messages

## Styling

Using Tailwind CSS with custom utilities:

```jsx
// Button classes
<button className="btn-primary">Primary</button>
<button className="btn-secondary">Secondary</button>
<button className="btn-outline">Outline</button>

// Input classes
<input className="input-field" />

// Card classes
<div className="card p-6">Content</div>

// Page container
<div className="page-container">Page content</div>
```

## Build for Production

```bash
npm run build
```

Output: `dist/` folder

## Preview Production Build

```bash
npm run preview
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to Vercel
3. Set environment variables
4. Deploy

```bash
# Or using Vercel CLI
npm i -g vercel
vercel
```

### Netlify

1. Build project: `npm run build`
2. Deploy `dist/` folder to Netlify
3. Set environment variables

## Environment Variables

Required for production:

```env
VITE_API_URL=https://your-backend.render.com/api/v1
VITE_GOOGLE_CLIENT_ID=production-client-id
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxx
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

## Best Practices

1. **Component Structure**: One component per file
2. **State Management**: Use Redux for global state, local state for UI
3. **API Calls**: Use Redux Toolkit's createAsyncThunk
4. **Styling**: Use Tailwind utility classes, extract common patterns
5. **Performance**: Use React.memo, useMemo, useCallback where needed
6. **Error Handling**: Show user-friendly error messages
7. **Loading States**: Always show loading indicators

## Common Issues

### Build fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Hot reload not working
```bash
# Restart dev server
npm run dev
```

### API requests failing
- Check VITE_API_URL in .env
- Make sure backend is running
- Check browser console for CORS errors

## Resources

- [React Docs](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Fabric.js](https://fabricjs.com)
- [React Router](https://reactrouter.com)

## License

MIT
