# 🎮 GameStore — Full Stack Web Application

> **Course:** Full Stack – Back End Web Technology Lab (CI4392)  
> **Institute:** Rajarambapu Institute of Technology, Rajaramnagar  
> **Academic Year:** 2026–27

---

## 📋 Experiment Coverage

| Exp | Title | Where Covered |
|-----|-------|--------------|
| 1 | Demonstrate the Use of Node.js | `backend/server.js` — HTTP server, dotenv, process |
| 2 | Implementation of Express.js | `backend/server.js`, `routes/*`, `middleware/*` |
| 3 | Connecting to MongoDB | `backend/config/db.js`, `backend/models/*` |
| 4 | Building RESTful APIs | `backend/controllers/*`, `backend/routes/*` |
| 5 | Integrating React.js | `frontend/src/main.jsx`, `frontend/src/App.jsx` |
| 6 | User Authentication & Authorization | JWT — `authController.js`, `authMiddleware.js`, `AuthContext.jsx` |
| 7 | React State Management | `useState`, `useReducer` in `CartContext.jsx`, all pages |
| 8 | Context API in React.js | `AuthContext.jsx`, `CartContext.jsx` |
| 9 | Data Fetching in React.js | `services/api.js` (axios), all pages using `useEffect` |
| 10 | Integrating React with Express | `vite.config.js` proxy, full frontend↔backend integration |
| 11 | Full Stack Application Deployment | See Deployment section below |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Styling | Plain CSS (custom, responsive) |

---

## 🎮 Features

### User Features
- Browse 25+ games across 15 genres
- Search by title, description, tags
- Filter by genre, platform, price range
- Sort by newest, price, rating
- Game detail page with reviews and ratings
- Add to cart, update quantity, remove items
- Wishlist (add/remove games)
- User registration and login (JWT)
- Place orders with shipping and payment method
- View order history and order details
- Cancel pending orders
- Edit profile and change password
- Write, delete, and mark reviews as helpful

### Admin Features
- Dashboard with stats (users, games, orders, revenue)
- Add, edit, soft-delete games
- Manage all orders and update status
- View all users and change roles

---

## 📁 Project Structure

```
FSBT project/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── controllers/    # Business logic
│   ├── middleware/     # Auth & error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── seed/           # Database seeder
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── context/    # AuthContext, CartContext
    │   ├── pages/      # All page components
    │   │   └── admin/  # Admin panel pages
    │   ├── services/   # Axios API layer
    │   ├── styles/     # global.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js v18+
- MongoDB running locally on port 27017
- npm

### Step 1 — Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2 — Configure Environment
Edit `backend/.env` if needed:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/gamestore
JWT_SECRET=gamestore_super_secret_key_2026
NODE_ENV=development
```

### Step 3 — Seed the Database
```bash
cd backend
npm run seed
```
This creates 25 games and a default admin account:
- **Email:** admin@gamestore.com  
- **Password:** admin123

### Step 4 — Start the Backend
```bash
cd backend
npm run dev
```
Backend runs at: `http://localhost:5000`

### Step 5 — Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Step 6 — Start the Frontend
```bash
cd frontend
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## 🌐 Deployment (Experiment 11)

### Option A — Deploy to Render + MongoDB Atlas

**Backend (Render):**
1. Push code to GitHub
2. Create a new Web Service on [render.com](https://render.com)
3. Set root directory to `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = your secret key
   - `NODE_ENV` = production

**Frontend (Vercel or Netlify):**
1. Update `frontend/vite.config.js` proxy target to your Render backend URL
2. Build: `npm run build` (outputs to `dist/`)
3. Deploy the `dist/` folder to [vercel.com](https://vercel.com) or [netlify.com](https://netlify.com)

**MongoDB Atlas:**
1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a database user
3. Whitelist IP `0.0.0.0/0` for access
4. Copy connection string into `MONGO_URI`

### Option B — Deploy with PM2 on a VPS

```bash
# Install PM2
npm install -g pm2

# Start backend
cd backend
pm2 start server.js --name gamestore-api

# Build frontend and serve with nginx
cd frontend
npm run build
# copy dist/ to nginx web root
```

---

## 🔑 API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register user |
| POST | /api/auth/login | Public | Login user |
| GET | /api/auth/profile | Private | Get profile |
| PUT | /api/auth/profile | Private | Update profile |
| PUT | /api/auth/wishlist/:id | Private | Toggle wishlist |
| GET | /api/games | Public | Get all games (filter/search/page) |
| GET | /api/games/:id | Public | Get single game |
| GET | /api/games/featured | Public | Get featured games |
| POST | /api/games | Admin | Create game |
| PUT | /api/games/:id | Admin | Update game |
| DELETE | /api/games/:id | Admin | Delete game |
| GET | /api/cart | Private | Get cart |
| POST | /api/cart | Private | Add to cart |
| PUT | /api/cart/:gameId | Private | Update quantity |
| DELETE | /api/cart/:gameId | Private | Remove item |
| POST | /api/orders | Private | Place order |
| GET | /api/orders/myorders | Private | Get my orders |
| GET | /api/orders | Admin | Get all orders |
| PUT | /api/orders/:id/status | Admin | Update order status |
| POST | /api/reviews/:gameId | Private | Add review |
| GET | /api/reviews/:gameId | Public | Get reviews |
| GET | /api/users | Admin | Get all users |
| GET | /api/users/stats | Admin | Dashboard stats |

