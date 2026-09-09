# 🌱 Smart Agriculture Marketplace Backend

A scalable and secure REST API backend for a **Smart Agriculture Marketplace & Farm Support Platform**. The system connects farmers, customers, agricultural experts, and administrators through a role-based marketplace and agricultural support platform.

The backend is built with **Node.js, Express.js, TypeScript, Prisma ORM, and PostgreSQL**, following a modular and maintainable architecture.

---

## 📌 About

The Smart Agriculture Marketplace is designed to provide farmers and customers with a complete digital platform for:

- 🛒 Buying and selling agricultural products
- 🌾 Managing farm-related products
- 👨‍🌾 Connecting farmers with customers
- 👨‍🔬 Getting agricultural expert consultations
- 💬 Receiving expert recommendations
- ⭐ Managing product and service reviews
- 📋 Tracking important platform activities
- 🛡️ Managing users and platform resources through an admin panel

The backend follows a **role-based architecture** with secure authentication and authorization.

### 👥 Primary Roles

- 👤 **Customer** — Browse agricultural products, place orders, review products, and request consultations.
- 👨‍🌾 **Farmer** — Manage agricultural products, orders, and farmer-related activities.
- 👨‍🔬 **Expert** — Manage agricultural consultations and provide expert advice.
- 🛡️ **Admin** — Manage users, products, categories, orders, experts, reviews, and platform activities.

---

# ✨ Features

## 🔐 Authentication & Authorization

- User registration
- User login
- JWT-based authentication
- Password hashing
- Role-based access control
- Protected routes
- Admin authorization
- Farmer authorization
- Expert authorization
- Customer authorization

---

## 👤 User Management

- Create users
- Get user profile
- Update user profile
- Manage user status
- Manage user roles
- Admin user management
- Block/unblock users
- Soft delete users

---

## 🌾 Farmer Management

- Farmer profile management
- Farmer product management
- Create agricultural products
- Update agricultural products
- Delete agricultural products
- View farmer products
- Manage farmer-related information

---

## 🛒 Product Marketplace

- Create agricultural products
- Update products
- Delete products
- View product details
- Get all products
- Search products
- Filter products
- Sort products
- Pagination
- Category-based filtering
- Farmer-based filtering
- Price-based filtering
- Product status management

### Example Product Categories

- 🌱 Seeds
- 🧪 Fertilizers
- 🐛 Pesticides
- 🌾 Crops
- 🛠️ Agricultural Equipment
- 🌿 Plants
- 🧺 Farm Supplies

---

## 📦 Order Management

Customers can purchase agricultural products through the marketplace.

### Customer Features

- Create orders
- View own orders
- View order details
- Track order status
- Cancel orders

### Farmer Features

- View received orders
- Update order status
- Manage order fulfillment

### Admin Features

- View all orders
- Manage orders
- Update order status
- Monitor marketplace activities

---

## 👨‍🔬 Expert Consultation

The platform provides agricultural consultation services for farmers and customers.

### Consultation Features

- Request agricultural consultation
- View consultation history
- Manage consultation status
- Assign agricultural experts
- Expert consultation management
- Expert recommendations

---

## 🧑‍🔬 Expert Advice

Experts can provide professional agricultural recommendations.

Expert advice can include:

- 🩺 Diagnosis
- 💡 Recommendations
- 🧪 Fertilizer suggestions
- 🐛 Pesticide suggestions
- 🌱 Crop-related guidance

---

## ⭐ Review Management

Users can review agricultural products and services.

### Features

- Create reviews
- View reviews
- Update reviews
- Delete reviews
- Admin review management
- Product rating system
- Review validation

---

## 📋 Audit Logs / Activity Tracking

The system tracks important administrative and security-related activities.

Examples:

- User role changes
- User status changes
- Product status updates
- Order status changes
- Admin actions
- Important resource modifications

### 📋 Audit Logs / Activity Tracking
- **Who** performed the action?
- **What** action was performed?
- **Which** resource was affected?
- **When** was the action performed?

# 🛠️ Tech Stack

## Backend

* **Node.js** — JavaScript runtime environment
* **Express.js** — Web application framework for building REST APIs
* **TypeScript** — Type-safe JavaScript development

## Database

* **PostgreSQL** — Relational database
* **Prisma ORM** — Type-safe database ORM and query builder

## Authentication

* **JWT (JSON Web Token)** — Secure user authentication and authorization
* **bcrypt** — Password hashing and security

## Validation

* **Zod** — Schema-based request validation and type-safe data validation

## API

* **REST API** — RESTful API architecture
* **JSON** — Data exchange format
* **HTTP Status Codes** — Standardized API response status handling

## Development Tools

* **Git** — Version control
* **GitHub** — Source code hosting and collaboration
* **npm** — Package management
* **ESLint** — Code quality and linting
* **Biome** — Fast formatting and linting
* **TypeScript** — Static type checking
* **tsup** — TypeScript/Node.js build and bundling

# Project Structure

```text
Smart-Agriculture-Marketplace-Backend/
│
├── prisma/
│   └── schema.prisma
│
├── src/
├── ├── config/
│   ├── interfaces/
│   ├── lib/
│   ├── middlewares/
│   ├── modules/
│   │   ├── admin/
│   │   ├── auditLog/
│   │   ├── auth/
│   │   ├── category/
│   │   ├── consultation/
│   │   ├── crop/
│   │   ├── expert/
│   │   ├── farm/
│   │   ├── order/
│   │   ├── payment/
│   │   ├── product/
│   │   ├── review/
│   │   ├── user/
│   │   └── ...
│   ├── app.ts
│   └── server.ts
│
├── dist/
├── .env.example
├── .gitignore
├── package.json
├── prisma.config.ts
├── tsconfig.json
├── tsup.config.ts
└── README.md

---

# 🔑 API Modules

The backend is divided into independent modules.

| Module        | Description                            |
| ------------- | -------------------------------------- |
| Auth          | Registration, login and authentication |
| User          | User profile and account management    |
| Farmer        | Farmer management                      |
| Expert        | Agricultural expert management         |
| Product       | Agricultural marketplace products      |
| Category      | Product category management            |
| Order         | Product ordering and order management  |
| Consultation  | Agricultural consultation              |
| Expert Advice | Expert recommendations                 |
| Review        | Product/service reviews                |
| Audit Log     | Platform activity tracking             |
