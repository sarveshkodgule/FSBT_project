# Backend and MongoDB Atlas

The application flow is **React → Express API → Mongoose → MongoDB Atlas**. Atlas hosts your MongoDB database; Express still runs on your computer or your application host. React never needs the database password.

## What the backend already does

- `backend/server.js`: Express server on port 5000 and API route registration.
- `backend/config/db.js`: connects Mongoose using `MONGO_URI`.
- `backend/models/`: schemas for users, games, carts, orders, and reviews. Wishlists are stored on users.
- `backend/controllers/` and `backend/routes/`: authentication, catalogue, cart, orders, reviews, and admin operations.
- `backend/middleware/authMiddleware.js`: JWT authentication and admin access checks.
- `frontend/vite.config.js`: forwards `/api` requests from Vite to port 5000 during development.

## Connect Atlas

1. Create a project and cluster in MongoDB Atlas.
2. Create a **database user** with read/write access to the `gamestore` database. This is separate from your Atlas website login.
3. In Network Access, add the public IP of the computer running the backend. For deployment, allow the backend host's outbound IP.
4. Select your cluster's **Connect → Drivers → Node.js** option and copy its connection string.
5. Edit your existing `backend/.env` locally. Keep its other settings and set:

```dotenv
PORT=5000
MONGO_URI=mongodb+srv://YOUR_DB_USER:YOUR_ENCODED_PASSWORD@YOUR_CLUSTER.mongodb.net/gamestore?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret
NODE_ENV=development
```

Use your actual cluster hostname. URL-encode special characters in the database username/password. Keep `.env` private and never place `MONGO_URI` or `JWT_SECRET` in the frontend.

6. From `backend`, run `npm install` if needed, then `npm run dev`. A successful connection prints `MongoDB Connected`.
7. In another terminal, from `frontend`, run `npm install` if needed, then `npm run dev`. Open `http://localhost:5173`.
8. Register a user and check the `gamestore` database in Atlas's data explorer. Collections appear as data is written.

## Optional demo data

`npm run seed` from `backend` inserts sample games and creates the demo admin if it does not exist. **The existing script deletes every existing game first. Only run it against a disposable demo database.** It also creates an admin with publicly documented demo credentials; change that password before exposing the project publicly. This UI update did not run the seed script.

## Troubleshooting

- Authentication failed: use the database user's credentials, check its permissions, and encode special characters.
- Connection timeout: check the Atlas IP access list, cluster availability, and your network.
- DNS/SRV error: verify the cluster hostname and that your network can resolve MongoDB SRV records.
- Empty catalogue: a fresh database has no games. Add games through the admin interface or seed a disposable demo database.
- Frontend cannot reach the API: run both servers; the current Vite proxy targets port 5000.

For deployment, configure the frontend API URL/reverse proxy and Express CORS origin for your deployed domains; the current configuration targets local development.

Official guides: [Connect to Atlas](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/) and [Troubleshoot connections](https://www.mongodb.com/docs/atlas/troubleshoot-connection/).

Atlas connectivity has not been verified as part of this UI update.
