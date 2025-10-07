# EcoVerse Dashboard - Render Deployment Guide

This guide will help you deploy the EcoVerse Environmental Dashboard to Render.

## Prerequisites

1. A [Render](https://render.com) account
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. Environment variables ready (API keys, etc.)

## Deployment Methods

### Method 1: Using render.yaml (Recommended)

The project includes a `render.yaml` file that defines both services (backend and frontend).

1. **Connect Repository to Render:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" > "Blueprint"
   - Connect your GitHub/GitLab/Bitbucket repository
   - Select the repository containing this project

2. **Configure Environment Variables:**
   The backend service requires these environment variables:
   - `GEMINI_API_KEY` - Your Google Gemini API key (optional, for AI features)
   - `NODE_ENV` - Set to "production"
   - `PORT` - Will be set automatically by Render to 5000

   Set these in the Render dashboard under your backend service > Environment.

3. **Deploy:**
   - Render will automatically deploy both services
   - Backend will be available at: `https://ecoverse-backend.onrender.com`
   - Frontend will be available at: `https://ecoverse-frontend.onrender.com`

### Method 2: Manual Service Creation

#### Deploy Backend API

1. **Create Web Service:**
   - In Render dashboard, click "New" > "Web Service"
   - Connect your repository
   - Configure:
     - **Build Command:** `cd backend && npm install`
     - **Start Command:** `cd backend && npm start`
     - **Health Check Path:** `/api/health`
     - **Environment:** Node

2. **Set Environment Variables:**
   - `NODE_ENV=production`
   - `PORT=5000` (auto-set by Render)
   - `GEMINI_API_KEY=your_api_key_here` (optional)

#### Deploy Frontend

1. **Create Static Site:**
   - Click "New" > "Static Site"
   - Connect your repository
   - Configure:
     - **Build Command:** `cd frontend && npm install && npm run build`
     - **Publish Directory:** `frontend/build`

## Environment Variables Setup

### Required for Backend:
- `NODE_ENV=production`
- `GEMINI_API_KEY` - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Frontend Environment Variables:
The frontend will automatically use:
- `REACT_APP_API_BASE_URL=https://ecoverse-backend.onrender.com` (set in .env.production)

## Post-Deployment Steps

1. **Verify Backend Health:**
   Visit: `https://your-backend-url.onrender.com/api/health`
   Should return: `{"status":"OK","timestamp":"..."}`

2. **Test API Endpoints:**
   - Cities data: `https://your-backend-url.onrender.com/api/cities`
   - Dashboard: `https://your-backend-url.onrender.com/api/environmental/dashboard`

3. **Verify Frontend:**
   Visit your frontend URL and test:
   - City search functionality
   - Dashboard data loading
   - AI chat (if Gemini API key is configured)

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Ensure backend CORS is configured for your frontend URL
   - Check that frontend uses correct API base URL

2. **Build Failures:**
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   - Check build logs in Render dashboard

3. **API Connection Issues:**
   - Verify environment variables are set correctly
   - Check that frontend `.env.production` has correct backend URL
   - Ensure backend service is running

### Performance Optimization:

1. **Frontend:**
   - Uses static site hosting for optimal performance
   - Automatic CDN distribution
   - Gzip compression enabled

2. **Backend:**
   - Health checks ensure service availability
   - Automatic restarts on failures
   - Environment-based configuration

## Updating the Deployment

1. **Push changes to your Git repository**
2. **Render will automatically redeploy** both services
3. **Monitor deployment logs** in the Render dashboard

## Custom Domain (Optional)

1. **For Frontend:** Go to Static Site settings > Custom Domains
2. **For Backend:** Go to Web Service settings > Custom Domains
3. **Add your domain** and follow Render's DNS configuration guide

## Monitoring

- **Render Dashboard:** View logs, metrics, and deployment status
- **Health Checks:** Backend includes `/api/health` endpoint
- **Error Tracking:** Check service logs for any issues

## Support

If you encounter issues:
1. Check Render documentation: https://render.com/docs
2. Review deployment logs in Render dashboard
3. Verify environment variables and build commands
4. Test API endpoints directly

---

**Note:** Free tier services on Render may experience cold starts. Consider upgrading to a paid plan for production workloads.