# 🚀 GigFlow Deployment Guide

## Overview
This guide will help you deploy:
- **Frontend** → Vercel
- **Backend** → Render

---

## 📦 Part 1: Deploy Backend to Render

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended)
3. Authorize Render to access your repositories

### Step 2: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `abhassj/GigFlow`
3. Configure the service:

**Basic Settings:**
- **Name**: `gigflow-backend` (or any name you prefer)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `server`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select **"Free"** (for testing) or **"Starter"** (for production)

### Step 3: Set Environment Variables
Click **"Advanced"** → **"Add Environment Variable"** and add:

```
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=30d
JWT_COOKIE_EXPIRES_IN=30
CLIENT_URL=https://your-frontend-url.vercel.app
```

**Important:**
- Replace `MONGO_URI` with your MongoDB Atlas connection string
- Replace `JWT_SECRET` with a strong random string
- You'll update `CLIENT_URL` after deploying the frontend

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, you'll get a URL like: `https://gigflow-backend.onrender.com`
4. **Save this URL** - you'll need it for the frontend!

### Step 5: Test Backend
Visit: `https://your-backend-url.onrender.com/api/gigs`
You should see an empty array `[]` or gigs data.

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Update API URL in Frontend
Before deploying, update the API base URL:

1. Open `client/src/utils/api.js`
2. Update the `baseURL`:
```javascript
const api = axios.create({
  baseURL: 'https://your-backend-url.onrender.com/api',
  withCredentials: true
});
```

3. Commit and push:
```bash
git add .
git commit -m "Update API URL for production"
git push origin main
```

### Step 2: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### Step 3: Import Project
1. Click **"Add New..."** → **"Project"**
2. Import `abhassj/GigFlow`
3. Configure:

**Framework Preset:** Vite
**Root Directory:** `client`
**Build Command:** `npm run build`
**Output Directory:** `dist`

### Step 4: Set Environment Variables
Click **"Environment Variables"** and add:

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. You'll get a URL like: `https://gigflow-xyz123.vercel.app`

### Step 6: Update Backend CORS
1. Go back to Render dashboard
2. Open your backend service
3. Update environment variable:
   - `CLIENT_URL=https://your-frontend-url.vercel.app`
4. Click **"Save Changes"** (this will redeploy)

---

## ✅ Part 3: Verify Deployment

### Test the Application:
1. Visit your Vercel URL: `https://your-frontend-url.vercel.app`
2. Try logging in with demo credentials:
   - Email: `alice@example.com`
   - Password: `123456`
3. Test creating a gig, browsing, and submitting proposals

### Common Issues:

**Issue: "Network Error" or CORS Error**
- Solution: Make sure `CLIENT_URL` in Render matches your Vercel URL exactly

**Issue: "Cannot connect to database"**
- Solution: Check MongoDB Atlas connection string in Render environment variables
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

**Issue: Frontend shows blank page**
- Solution: Check browser console for errors
- Verify `VITE_API_URL` is set correctly in Vercel

---

## 🔄 Part 4: Reseed Database (Optional)

If you want to add demo data to production:

1. Go to Render dashboard
2. Open your backend service
3. Click **"Shell"** tab
4. Run: `npm run seed`

---

## 📝 Part 5: Custom Domain (Optional)

### For Frontend (Vercel):
1. Go to Vercel project settings
2. Click **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

### For Backend (Render):
1. Upgrade to paid plan
2. Go to service settings
3. Add custom domain under **"Custom Domains"**

---

## 🎉 You're Live!

Your GigFlow application is now deployed and accessible worldwide!

**Frontend:** https://your-frontend-url.vercel.app
**Backend:** https://your-backend-url.onrender.com

Share your live link and enjoy! 🚀
