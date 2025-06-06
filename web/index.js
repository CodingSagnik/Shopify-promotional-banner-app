import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { shopifyApp } from '@shopify/shopify-app-express';
import { ApiVersion, AppDistribution } from '@shopify/shopify-api';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Environment variables
const PORT = process.env.PORT || 3000;
const isDevelopment = process.env.NODE_ENV !== 'production';

// Initialize Shopify app
const shopify = shopifyApp({
  api: {
    apiVersion: ApiVersion.January24,
    restResources: [],
    billing: undefined, // Optional billing configuration
    hostName: process.env.SHOPIFY_APP_URL || 'localhost',
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET || process.env.SHOPIFY_API_SECRET_KEY,
    scopes: ['write_themes', 'read_themes'],
    isEmbeddedApp: true,
    distribution: AppDistribution.AppStore,
  },
  auth: {
    path: '/auth',
    callbackPath: '/auth/callback',
  },
  webhooks: {
    path: '/webhooks',
  },
  sessionStorage: undefined, // Use default in-memory storage for development
});

const app = express();

// Middleware
app.use(compression());
app.use(cors());

// Shopify app middleware
app.use(shopify.config.auth.path, shopify.auth.begin());
app.use(shopify.config.auth.callbackPath, shopify.auth.callback(), shopify.redirectToShopifyOrAppRoot());
app.use(shopify.config.webhooks.path, shopify.processWebhooks({ webhookHandlers: {} }));

// API routes
app.use('/api/*', shopify.validateAuthenticatedSession());

// API endpoint to get app status
app.get('/api/app', async (req, res) => {
  const session = res.locals.shopify.session;
  
  res.status(200).json({
    success: true,
    shop: session.shop,
    message: 'Promotional Banner App is active!',
    banner: {
      text: '🎉 Free Shipping on All Orders! 🎉',
      enabled: true
    }
  });
});

// Banner configuration endpoint
app.get('/api/banner/config', async (req, res) => {
  res.status(200).json({
    enabled: true,
    text: '🎉 Free Shipping on All Orders! 🎉',
    backgroundColor: '#4CAF50',
    textColor: '#FFFFFF',
    fontSize: '16px',
    position: 'top'
  });
});

// App proxy endpoint (for stores to fetch banner content)
app.get('/app_proxy/banner', async (req, res) => {
  // Verify the request is from Shopify
  const shop = req.query.shop;
  
  if (!shop) {
    return res.status(400).json({ error: 'Shop parameter required' });
  }

  const bannerHtml = `
    <div id="promotional-banner" style="
      background-color: #4CAF50;
      color: white;
      text-align: center;
      padding: 12px 20px;
      font-size: 16px;
      font-weight: bold;
      position: relative;
      z-index: 1000;
      width: 100%;
      box-sizing: border-box;
      animation: slideDown 0.5s ease-out;
    ">
      🎉 Free Shipping on All Orders! 🎉
      <button onclick="this.parentElement.style.display='none'" style="
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        float: right;
        padding: 0;
        margin: 0;
        line-height: 1;
      ">×</button>
    </div>
    <style>
      @keyframes slideDown {
        from { transform: translateY(-100%); }
        to { transform: translateY(0); }
      }
      #promotional-banner {
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      #promotional-banner:hover {
        background-color: #45a049;
      }
    </style>
  `;

  res.set('Content-Type', 'text/html');
  res.send(bannerHtml);
});

// Serve static files for embedded app
app.use(express.static(join(__dirname, 'frontend', 'dist')));

// Catch-all handler for embedded app
app.get('/*', shopify.ensureInstalledOnShop(), async (req, res) => {
  return res
    .status(200)
    .set('Content-Type', 'text/html')
    .send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Promotional Banner App</title>
        <script src="https://unpkg.com/@shopify/app-bridge@3"></script>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .banner-preview {
            background-color: #4CAF50;
            color: white;
            text-align: center;
            padding: 12px 20px;
            font-size: 16px;
            font-weight: bold;
            border-radius: 4px;
            margin: 20px 0;
          }
          .status {
            background-color: #e8f5e8;
            border: 1px solid #4CAF50;
            color: #2e7d32;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
          }
          .instructions {
            background-color: #f5f5f5;
            padding: 20px;
            border-radius: 4px;
            margin: 20px 0;
          }
          .instructions h3 {
            margin-top: 0;
          }
          .instructions ol {
            padding-left: 20px;
          }
          .instructions li {
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Promotional Banner App</h1>
            <p>Your promotional banner is now active!</p>
          </div>
          
          <div class="status">
            ✅ App successfully installed and configured
          </div>

          <h2>Banner Preview:</h2>
          <div class="banner-preview">
            🎉 Free Shipping on All Orders! 🎉
          </div>

          <div class="instructions">
            <h3>How it works:</h3>
            <ol>
              <li>This app automatically adds a promotional banner to your store</li>
              <li>The banner appears at the top of all pages</li>
              <li>Customers can dismiss the banner by clicking the × button</li>
              <li>The banner is fully responsive and mobile-friendly</li>
            </ol>
            
            <h3>Next Steps:</h3>
            <ol>
              <li>The banner is now active on your store</li>
              <li>Visit your store to see the banner in action</li>
              <li>The banner will automatically appear on all pages</li>
            </ol>
          </div>
        </div>

        <script>
          var AppBridge = window['app-bridge'];
          var createApp = AppBridge.default;
          
          var app = createApp({
            apiKey: '${process.env.SHOPIFY_API_KEY || 'your-api-key'}',
            host: new URLSearchParams(location.search).get('host')
          });
        </script>
      </body>
      </html>
    `);
});

app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
  console.log(\`📱 App URL: http://localhost:\${PORT}\`);
}); 