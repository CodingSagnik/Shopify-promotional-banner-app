# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Prerequisites
- Create a [Shopify Partner Account](https://partners.shopify.com/signup)
- Create a development store in your Partner Dashboard
- Install Node.js v18+ and npm

### Step 2: Environment Setup
1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Update `.env` with your values:
   ```env
   SHOPIFY_API_KEY=your_api_key_from_partner_dashboard
   SHOPIFY_API_SECRET=your_api_secret_from_partner_dashboard
   SHOPIFY_APP_URL=https://your-deployed-app.vercel.app
   SHOPIFY_DEV_STORE_URL=your-store.myshopify.com
   ```

### Step 3: Deploy to Vercel
1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Set environment variables in Vercel dashboard
4. Update `shopify.app.toml` with your Vercel URL

### Step 4: Install App
1. Run: `shopify app dev` (if using CLI)
2. Or manually install via Partner Dashboard
3. Visit your development store
4. See the banner at the top! 🎉

### Test Your Banner
Open `banner-test.html` in a browser to preview the banner design.

## 📚 Full Documentation
See `README.md` for complete setup instructions and troubleshooting. 