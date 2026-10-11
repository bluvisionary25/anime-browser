# AniSphere 🍿✨
> **INTECH 3112 – Project 2: Laravel Backend Integration**  
> *React + Tailwind CSS + AJAX/Fetch + Laravel 11/13 + MySQL*

AniSphere is a full-stack anime tracking and catalog management application built as part of INTECH 3112 Project 2. It integrates a responsive React frontend with a normalized relational Laravel REST API backend and MySQL database.

---

## 🚀 Key Features

* **Relational Database Design (MySQL):** Normalized schema containing 4 related tables (`users`, `genres`, `animes`, `watchlists`) with primary keys, foreign keys (`cascadeOnDelete`), and timestamps.
* **Eloquent Models & Relationships:** Complete relationships defined across models (`belongsTo`, `hasMany`) utilizing eager loading to eliminate N+1 queries.
* **Full CRUD Functionality:**
  * **Watchlist:** Create, Read, Update progress, and Delete entries.
  * **Catalog (Admin):** Create new anime, edit anime records, and remove anime from database.
* **Authentication & Role-Based Authorization:**
  * Laravel Sanctum token-based authentication (`/api/register`, `/api/login`, `/api/logout`).
  * Custom `EnsureUserIsAdmin` middleware protecting administrative catalog routes.
  * React interface conditionally displays actions based on authenticated user access (`admin` vs `user` vs `guest`).
* **Server-Side Validation:** All incoming data strictly validated on Laravel before database insertion, with error feedback displayed in React.
* **Modern UI/UX:** Built with React and Tailwind CSS, featuring dark mode aesthetic, micro-animations, loading skeletons, error states, and confirmation dialogs.

---

## 🔑 Demo Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password` | Full catalog management (Admin Panel, Add/Edit/Delete anime) + Watchlist |
| **Regular User** | `test@example.com` | `password` | Watchlist tracking (Add, update episode count, remove) |

---

## 🛠️ Getting Started / Local Setup

### 1. Prerequisites
* **PHP** >= 8.2 with `pdo_mysql` extension enabled
* **Composer**
* **Node.js** & **npm**
* **MySQL** (via XAMPP or standalone service)

### 2. Backend Setup (Laravel)
```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not cloned with vendor)
composer install

# Copy environment configuration
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations and seed demonstration data
php artisan migrate --seed

# Start Laravel development server
php artisan serve
```
The API server will run at `http://127.0.0.1:8000`.

### 3. Frontend Setup (React)
```bash
# In the project root directory
npm install

# Start Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📋 API Endpoints Summary

### Public Routes
* `GET /api/animes` — Retrieve anime catalog (supports `?genre=`, `?search=`, `?sort=`)
* `GET /api/animes/{id}` — Retrieve single anime details
* `GET /api/genres` — Retrieve all genres with anime count
* `POST /api/login` — Authenticate and receive Sanctum token
* `POST /api/register` — Create new user account

### Protected Routes (`auth:sanctum`)
* `GET /api/user` — Get authenticated user profile
* `POST /api/logout` — Revoke active token
* `GET /api/watchlist` — Get user's personal watchlist
* `POST /api/watchlist` — Add anime to watchlist
* `PUT/PATCH /api/watchlist/{id}` — Update progress / status
* `DELETE /api/watchlist/{id}` — Remove anime from watchlist

### Admin Only Routes (`admin` middleware)
* `POST /api/admin/animes` — Create anime in database
* `PUT /api/admin/animes/{id}` — Update existing anime record
* `DELETE /api/admin/animes/{id}` — Delete anime record from database
