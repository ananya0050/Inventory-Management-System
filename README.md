Inventory Management System
📌 Overview

Inventory Management System is a full-stack web application designed to help businesses efficiently manage products, inventory, suppliers, orders, and users. The system provides role-based access control for administrators and users, real-time inventory updates, and secure authentication.

The application streamlines inventory operations by enabling businesses to track stock levels, manage suppliers, process orders, and monitor inventory performance through an intuitive dashboard.

✨ Features

🔐 Authentication & Authorization
WT-based authentication** with secure session management
- **Role-based access control** — three distinct user roles:
  - **Vendor** (Admin) — full system access with dashboard analytics
  - **Customer** (Employee) — order placement and tracking
  - **Supplier** — product management and order fulfillment
- Soft-delete user accounts with admin override protection
- Real-time account deletion notification via WebSocket

📊 Vendor (Admin) Dashboard
- **Analytics overview** — total products, categories, orders, revenue
- **Interactive charts** powered by Recharts (bar, pie, line)
- Product & category CRUD with image support
- Supplier management
- Order management with status tracking
- User management — promote/demote roles, delete accounts

🛒 Customer (Employee) Dashboard
- Browse available products
- Place and track orders with real-time status updates
- Profile management with avatar upload

🏭 Supplier Dashboard
- View and manage supplied products
- Process incoming orders
- Track order history and fulfillment

👤 Profile System
- **Modern profile UI** with hero banner and glassmorphism cards
- **Profile picture upload** — upload, change, and delete avatar (multer-based)
- Edit name and email
- Change password with current password verification
- Animated transitions and micro-interactions

⚡ Real-Time Features
- **Socket.IO integration** for live updates across all connected clients
- Instant order status sync
- Real-time user role change & deletion notifications

---

🛠️ Tech Stack

| Layer        | Technology                                                          |
| ------------ | ------------------------------------------------------------------- |
| **Frontend** | React 19, Vite, React Router v7, Axios, Recharts, React Icons      |
| **Backend**  | Node.js, Express 5, Mongoose (MongoDB ODM), JWT, bcryptjs, Multer  |
| **Database** | MongoDB                                                             |
| **Realtime** | Socket.IO                                                           |
| **Styling**  | Vanilla CSS with CSS Variables, Glassmorphism, Inter (Google Fonts) |

---

📁 Project Structure

```
IMS_Project/
├── backend/
│   ├── controllers/         # Business logic
│   │   ├── categoryController.js
│   │   ├── dashboardController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   ├── supplierController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT auth, role guards
│   ├── models/              # Mongoose schemas
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── Supplier.js
│   │   └── User.js
│   ├── routes/              # Express routes
│   │   ├── auth.js
│   │   ├── category.js
│   │   ├── order.js
│   │   ├── product.js
│   │   ├── supplier.js
│   │   └── user.js
│   ├── uploads/profiles/    # Profile picture storage
│   ├── server.js            # App entry point
│   └── .env                 # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── EmployeeSidebar.jsx
│   │   │   ├── SupplierSidebar.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── PopupMessage.jsx
│   │   ├── pages/           # Route-level pages
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── EmployeeDashboard.jsx
│   │   │   ├── SupplierDashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── Suppliers.jsx
│   │   │   ├── Profile.jsx / Profile.css
│   │   │   ├── Users.jsx
│   │   │   ├── AdminOrders.jsx
│   │   │   ├── AdminUserOrders.jsx
│   │   │   ├── EmployeeOrders.jsx
│   │   │   └── SupplierOrders.jsx
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   │   └── roleLabels.js
│   │   ├── App.jsx          # Routing & auth guards
│   │   ├── index.css        # Global design system
│   │   └── main.jsx         # React entry point
│   └── vite.config.js
│
└── README.md
```

🔑 User Roles

| Role         | Internal Value | Access Level                                            |
| ------------ | -------------- | ------------------------------------------------------- |
| **Vendor**   | `admin`        | Full access — dashboard, CRUD, user management, reports |
| **Customer** | `user`         | Browse products, place orders, track order status        |
| **Supplier** | `supplier`     | Manage supplied products, fulfill orders                 |

> **Note:** The first registered Vendor has full system control and can promote/demote other users.

---

 📸 Key Screens

| Screen               | Description                                       |
| -------------------- | ------------------------------------------------- |
| **Landing Page**     | Modern marketing page with features & CTA         |
| **Login / Register** | Clean auth forms with field validation             |
| **Vendor Dashboard** | Analytics cards, charts, quick-action panels       |
| **Products**         | CRUD table with search, category filter, modals    |
| **Orders**           | Order lifecycle management with status badges      |
| **Profile**          | Hero banner, avatar upload, account & security settings |

---

🔌 API Endpoints

# Auth
| Method | Endpoint                  | Description              |
| ------ | ------------------------- | ------------------------ |
| POST   | `/api/auth/register`      | Register a new user      |
| POST   | `/api/auth/login`         | Login & receive JWT      |
| GET    | `/api/auth/admin-exists`  | Check if any admin exists|

# Users
| Method | Endpoint                       | Description                |
| ------ | ------------------------------ | -------------------------- |
| GET    | `/api/users/profile`           | Get current user profile   |
| PUT    | `/api/users/profile`           | Update name & email        |
| PUT    | `/api/users/change-password`   | Change password            |
| POST   | `/api/users/profile/picture`   | Upload profile picture     |
| DELETE | `/api/users/profile/picture`   | Remove profile picture     |

# Products, Categories, Orders, Suppliers
> Standard RESTful CRUD endpoints under `/api/products`, `/api/categories`, `/api/orders`, and `/api/suppliers`.

---

🎨 Design System

The UI uses a custom CSS design system defined in `index.css`:

- **Color palette** — CSS custom properties (`--accent-primary`, `--bg-main`, etc.)
- **Typography** — Inter font (Google Fonts) with weight scale 300–900
- **Glass panels** — `backdrop-filter: blur()` with subtle borders
- **Animations** — Fade-in, slide, pulse, and shimmer keyframes
- **Responsive** — Collapsible sidebars, mobile-friendly grids

---

📝 Environment Variables

| Variable     | Description                    | Default                              |
| ------------ | ------------------------------ | ------------------------------------ |
| `PORT`       | Backend server port            | `5001`                               |
| `MONGO_URI`  | MongoDB connection string      | `mongodb://127.0.0.1:27017/IMS`      |
| `JWT_SECRET` | Secret key for JWT signing     | *(set your own secure key)*          |

---
