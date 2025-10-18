# Backend API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 📋 API Endpoints

### 🔐 Authentication (`/auth`)

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Google OAuth Login
```http
GET /auth/google
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John Updated",
  "phone": "9876543210"
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

---

### 🛍️ Products (`/products`)

#### Get All Products
```http
GET /products?page=1&limit=12&category=tshirts&search=cool&minPrice=200&maxPrice=1000&sort=price&featured=true
```

Query Parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `category` - Filter by category slug
- `search` - Search in name and description
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `sort` - Sort by: `price`, `-price`, `name`, `-name`, `createdAt`, `-createdAt`
- `featured` - Filter featured products (true/false)

#### Get Featured Products
```http
GET /products/featured?limit=8
```

#### Get Products by Category
```http
GET /products/category/:categoryId?page=1&limit=12
```

#### Get Product by ID/Slug
```http
GET /products/:slug
```

#### Create Product (Admin)
```http
POST /products
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Cool T-Shirt",
  "description": "Awesome t-shirt",
  "category": "categoryId",
  "basePrice": 499,
  "salePrice": 399,
  "specifications": {
    "material": "Cotton",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["#000000", "#FFFFFF", "#FF0000"]
  },
  "designArea": {
    "front": { "width": 300, "height": 400, "x": 50, "y": 100 },
    "back": { "width": 300, "height": 400, "x": 50, "y": 100 }
  },
  "isFeatured": true,
  "inStock": true
}
```

#### Update Product (Admin)
```http
PUT /products/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "basePrice": 449,
  "salePrice": 349
}
```

#### Delete Product (Admin)
```http
DELETE /products/:id
Authorization: Bearer <admin-token>
```

#### Upload Product Mockup (Admin)
```http
POST /products/:id/mockup
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data

position=front&mockup=<file>
```

---

### 📁 Categories (`/categories`)

#### Get All Categories
```http
GET /categories
```

#### Get Category by ID
```http
GET /categories/:id
```

#### Create Category (Admin)
```http
POST /categories
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "T-Shirts",
  "description": "Custom printed t-shirts",
  "icon": "👕"
}
```

#### Update Category (Admin)
```http
PUT /categories/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Premium T-Shirts"
}
```

#### Delete Category (Admin)
```http
DELETE /categories/:id
Authorization: Bearer <admin-token>
```

---

### 🎨 Designs (`/designs`)

#### Save Design
```http
POST /designs
Authorization: Bearer <token>
Content-Type: application/json

{
  "product": "productId",
  "name": "My Awesome Design",
  "canvasData": { "objects": [...] },
  "previews": {
    "front": { "url": "cloudinary-url", "publicId": "public-id" }
  },
  "uploadedImages": [
    { "url": "image-url", "publicId": "public-id" }
  ],
  "isDraft": false
}
```

#### Get Design
```http
GET /designs/:id
Authorization: Bearer <token>
```

#### Update Design
```http
PUT /designs/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Design Name",
  "canvasData": { "objects": [...] },
  "isDraft": false
}
```

#### Delete Design
```http
DELETE /designs/:id
Authorization: Bearer <token>
```

#### Get User Designs
```http
GET /designs/user/:userId?
Authorization: Bearer <token>
```

---

### 🛒 Cart (`/cart`)

#### Get Cart
```http
GET /cart
Authorization: Bearer <token>
```

#### Add to Cart
```http
POST /cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "productId",
  "designId": "designId",
  "quantity": 2,
  "selectedSize": "L",
  "selectedColor": "#000000",
  "customizations": {
    "text": "Custom text"
  }
}
```

#### Update Cart Item
```http
PUT /cart/item/:itemId
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove from Cart
```http
DELETE /cart/item/:itemId
Authorization: Bearer <token>
```

#### Apply Coupon
```http
POST /cart/coupon/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "SAVE20"
}
```

#### Remove Coupon
```http
DELETE /cart/coupon
Authorization: Bearer <token>
```

#### Clear Cart
```http
DELETE /cart/clear
Authorization: Bearer <token>
```

---

### 📦 Orders (`/orders`)

#### Create Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com",
    "address": "123 Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "paymentMethod": "razorpay"
}
```

Response for Razorpay:
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": { ... },
    "razorpayOrderId": "order_xxx",
    "razorpayKey": "rzp_xxx"
  }
}
```

#### Verify Payment
```http
POST /orders/verify-payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "signature_xxx"
}
```

#### Get Orders
```http
GET /orders?status=delivered&page=1&limit=10
Authorization: Bearer <token>
```

#### Get Order by ID
```http
GET /orders/:orderId
Authorization: Bearer <token>
```

#### Cancel Order
```http
PUT /orders/:orderId/cancel
Authorization: Bearer <token>
```

---

### 📤 Upload (`/upload`)

#### Upload Design Image
```http
POST /upload/design
Authorization: Bearer <token>
Content-Type: multipart/form-data

image=<file>
```

#### Upload Profile Picture
```http
POST /upload/profile
Authorization: Bearer <token>
Content-Type: multipart/form-data

image=<file>
```

#### Delete Upload
```http
DELETE /upload/:publicId
Authorization: Bearer <token>
```

---

### 👨‍💼 Admin (`/admin`)

All admin endpoints require admin role.

#### Get Dashboard Stats
```http
GET /admin/dashboard?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <admin-token>
```

#### Get All Orders
```http
GET /admin/orders?status=pending&page=1&limit=20&search=ORD123
Authorization: Bearer <admin-token>
```

#### Update Order Status
```http
PUT /admin/orders/:orderId/status
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "orderStatus": "shipped",
  "trackingId": "TRACK123",
  "shippingProvider": "Shiprocket"
}
```

#### Get All Users
```http
GET /admin/users?page=1&limit=20&search=john
Authorization: Bearer <admin-token>
```

#### Update User Role
```http
PUT /admin/users/:userId/role
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "role": "admin"
}
```

#### Get All Coupons
```http
GET /admin/coupons
Authorization: Bearer <admin-token>
```

#### Create Coupon
```http
POST /admin/coupons
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "code": "SAVE20",
  "discountType": "percentage",
  "discountValue": 20,
  "maxDiscountAmount": 500,
  "minOrderValue": 1000,
  "validFrom": "2024-01-01",
  "validUntil": "2024-12-31",
  "maxUses": 100,
  "isActive": true
}
```

#### Update Coupon
```http
PUT /admin/coupons/:couponId
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "isActive": false
}
```

#### Delete Coupon
```http
DELETE /admin/coupons/:couponId
Authorization: Bearer <admin-token>
```

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (dev mode only)"
}
```

### Pagination Response
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 100,
      "pages": 9
    }
  }
}
```

---

## 🔒 Authorization Levels

1. **Public** - No authentication required
   - GET /products
   - GET /categories
   - POST /auth/register
   - POST /auth/login

2. **Authenticated** - Requires valid JWT token
   - All /designs endpoints
   - All /cart endpoints
   - All /orders endpoints (user)
   - All /upload endpoints

3. **Admin** - Requires admin role
   - POST/PUT/DELETE /products
   - POST/PUT/DELETE /categories
   - All /admin endpoints

---

## 🚀 Rate Limiting

- Default: 100 requests per 15 minutes per IP
- Configurable via environment variables

---

## 📝 Notes

1. All file uploads have a 5MB size limit
2. Images are automatically optimized and stored on Cloudinary
3. Orders generate unique order IDs in format: `ORD-YYYYMMDD-XXXX`
4. Payment integration uses Razorpay for online payments
5. Email notifications are sent for order confirmations and status updates
