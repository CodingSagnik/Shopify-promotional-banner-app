# 🎉 Promotional Banner Shopify App

A modern Shopify app that displays a customizable promotional banner at the top of any Shopify store. Built with Node.js, Express, and Theme App Extensions for optimal performance and user experience.

## ✨ Features

- **🎯 Theme App Extension**: Modern, native integration with Shopify themes
- **📱 Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **🎨 Customizable**: Change banner text, colors, and styling through the admin interface
- **⚡ Performance Optimized**: Lightweight and fast-loading
- **🔄 Dismissible**: Customers can close the banner with a smooth animation
- **💾 Smart Persistence**: Remembers when customers dismiss the banner
- **♿ Accessible**: Supports keyboard navigation and screen readers
- **🌙 Modern Standards**: Supports dark mode, reduced motion, and high contrast

## 🚀 Banner Features

- Displays: "🎉 Free Shipping on All Orders! 🎉"
- Smooth slide-down animation on page load
- Dismissible with close button
- Remembers dismissal state using localStorage
- 24-hour auto-reset for dismissed banners
- Fully responsive design
- Customizable colors and text

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v18.20.0 or higher)
2. **npm** or **yarn** package manager
3. **Shopify Partner Account** ([Sign up here](https://partners.shopify.com/signup))
4. **Shopify Development Store** (create one in your Partner Dashboard)
5. **Vercel Account** (for deployment)

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd promotional-banner-app
npm install
```

### 2. Set Up Shopify Partner Account

1. Go to [Shopify Partners](https://partners.shopify.com/)
2. Create a new app in your Partner Dashboard
3. Note your API Key and API Secret

### 3. Configure Environment Variables

1. Copy the example environment file:
```bash
cp env.example .env
```

2. Fill in your actual values in `.env`:
```env
SHOPIFY_API_KEY=your_actual_api_key
SHOPIFY_API_SECRET=your_actual_api_secret
SHOPIFY_APP_URL=https://your-app-url.vercel.app
SHOPIFY_DEV_STORE_URL=your-dev-store.myshopify.com
NODE_ENV=development
PORT=3000
SESSION_SECRET=your_super_secret_session_key
```

### 4. Update Configuration Files

Update `shopify.app.toml`:
```toml
client_id = "your_actual_api_key"
application_url = "https://your-app-url.vercel.app"
dev_store_url = "your-dev-store.myshopify.com"
```

## 🚀 Deployment to Vercel

### Quick Deploy

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Configure Environment Variables in Vercel**:
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add all environment variables from your `.env` file

4. **Update Shopify App Settings**:
   - In your Shopify Partner Dashboard
   - Update your app's URLs to use your Vercel domain
   - Add redirect URLs: `https://your-vercel-url.vercel.app/auth/callback`

### Manual Vercel Setup

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository
   - Configure build settings (should auto-detect)

2. **Set Environment Variables**:
   - In Vercel project settings
   - Add all variables from your `.env` file

3. **Deploy**:
   - Vercel will automatically deploy on push to main branch

## 💻 Local Development

1. **Start the development server**:
```bash
npm run dev
```

2. **Install the app on your development store**:
```bash
shopify app dev
```

3. **Test the banner**:
   - Visit your development store
   - The banner should appear at the top of all pages

## 🎨 How It Works

### Theme App Extension
The app uses Shopify's Theme App Extension API to inject the banner directly into the theme. This provides:

- **Native Performance**: No external scripts or iframes
- **Theme Integration**: Works with any theme
- **Customization**: Store owners can customize through the admin
- **No Code Required**: Automatic installation and setup

### Banner Behavior
- **Auto-Display**: Shows on all pages automatically
- **Smart Dismissal**: Remembers when customers close it
- **Responsive Design**: Adapts to all screen sizes
- **Accessibility**: Keyboard navigation and screen reader support

## 📱 Banner Customization

Store owners can customize the banner through their Shopify admin:

1. Go to **Online Store** > **Themes**
2. Click **Customize** on their active theme
3. Find the **Promotional Banner** section
4. Customize:
   - Enable/disable banner
   - Change banner text
   - Modify background color
   - Adjust text color

## 🔧 API Endpoints

The app provides several API endpoints:

- `GET /api/app` - App status and configuration
- `GET /api/banner/config` - Banner configuration
- `GET /app_proxy/banner` - Banner HTML for app proxy method
- `POST /auth/*` - Shopify OAuth handling
- `POST /webhooks/*` - Webhook handling

## 📂 Project Structure

```
promotional-banner-app/
├── web/                          # Backend application
│   ├── index.js                  # Main Express server
│   └── package.json              # Backend dependencies
├── extensions/                   # Theme App Extensions
│   └── promotional-banner/       # Banner extension
│       ├── blocks/
│       │   └── banner.liquid     # Banner template
│       ├── assets/
│       │   ├── banner.css        # Banner styles
│       │   └── banner.js         # Banner JavaScript
│       └── shopify.extension.toml # Extension config
├── shopify.app.toml              # Main app configuration
├── package.json                  # Root package.json
├── vercel.json                   # Vercel deployment config
├── env.example                   # Environment variables template
└── README.md                     # This file
```

## 🐛 Troubleshooting

### Common Issues

1. **"No Organization found" error**:
   - Make sure you have a Shopify Partner account
   - Confirm your account email is verified
   - Ensure you have the correct permissions

2. **Banner not showing**:
   - Check if the Theme App Extension is installed
   - Verify the banner is enabled in theme customization
   - Check browser console for JavaScript errors

3. **Authentication issues**:
   - Verify your API credentials are correct
   - Ensure redirect URLs match in Shopify Partner Dashboard
   - Check that SHOPIFY_APP_URL is set correctly

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## 📈 Analytics and Tracking

The banner system dispatches custom events for analytics:

```javascript
// Listen for banner events
document.addEventListener('banner-shown', (event) => {
  console.log('Banner shown:', event.detail);
  // Send to your analytics service
});

document.addEventListener('banner-dismissed', (event) => {
  console.log('Banner dismissed:', event.detail);
  // Send to your analytics service
});
```

## 🔄 Updates and Maintenance

### Updating the Banner Text
1. Modify the default text in `extensions/promotional-banner/blocks/banner.liquid`
2. Redeploy the app
3. Store owners can also change it through theme customization

### Adding Features
- Modify the Liquid template for structure changes
- Update CSS for styling changes
- Enhance JavaScript for new functionality

## 📜 License

MIT License - feel free to use this project for your own Shopify apps!
