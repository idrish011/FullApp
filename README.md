# CampusLink Deploy Guide for Render.com

This guide explains how to deploy both the backend (API) and frontend (admin dashboard) to Render.com using the `deploy/` folder structure.

---

## Folder Structure

```
deploy/
  frontend/   # React admin dashboard (Vite)
  backend/    # Node.js/Express API
```

---

## Backend (Node.js/Express)

1. **Create a new Web Service on Render.com**
   - **Root Directory:** `deploy/backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node 18+ (set in Render settings)
   - **Environment Variables:**
     - Add all required variables from `env.example` or `env.production`.
   - **Persistent Directories:**
     - Add `/app/uploads` and `/app/logs` as persistent directories in Render settings if you want to retain uploads/logs between deploys.
   - **Port:** 3000 (default)

2. **Optional: Docker**
   - If you want to use Docker, set the root to `deploy/backend` and Render will auto-detect the `Dockerfile`.

---

## Frontend (React/Vite)

1. **Create a new Static Site on Render.com**
   - **Root Directory:** `deploy/frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

2. **Environment Variables:**
   - Add any required variables (e.g., API base URL) in Render's environment settings.

---

## General Tips
- Make sure your backend API URL is set correctly in the frontend for production (e.g., using an environment variable).
- If you use custom domains, configure them in Render's dashboard.
- For database or file storage, use Render's persistent disks or external services as needed.

---

For more details, see [Render.com documentation](https://render.com/docs/deploy-node-express-app) and [Vite deployment guide](https://vitejs.dev/guide/static-deploy.html). 