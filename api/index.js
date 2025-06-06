export default function handler(req, res) {
  const { method, url } = req;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Parse URL
  const urlPath = new URL(url, `http://${req.headers.host}`).pathname;

  // Health check endpoint
  if (urlPath === '/' || urlPath === '/api') {
    res.status(200).json({
      message: 'Promotional Banner App is running!',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      url: req.headers.host
    });
    return;
  }

  // Banner configuration endpoint
  if (urlPath === '/api/banner/config') {
    res.status(200).json({
      enabled: true,
      text: '🎉 Free Shipping on All Orders! 🎉',
      backgroundColor: '#667eea',
      textColor: '#FFFFFF',
      fontSize: '16px',
      position: 'top'
    });
    return;
  }

  // App proxy endpoint (for stores to fetch banner content)
  if (urlPath === '/app_proxy/banner') {
    const urlObj = new URL(url, `http://${req.headers.host}`);
    const shop = urlObj.searchParams.get('shop');
    
    if (!shop) {
      res.status(400).json({ error: 'Shop parameter required' });
      return;
    }

    const bannerHtml = `
      <div id="promotional-banner" style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-align: center;
        padding: 15px 20px;
        font-size: 16px;
        font-weight: bold;
        position: relative;
        z-index: 1000;
        width: 100%;
        box-sizing: border-box;
        animation: slideDown 0.5s ease-out, shimmer 2s infinite;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      ">
        <span style="animation: bounce 2s infinite;">🎉</span>
        <span style="margin: 0 10px;">Free Shipping on All Orders!</span>
        <span style="animation: bounce 2s infinite 0.1s;">🎉</span>
        <button onclick="this.parentElement.style.display='none'" style="
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          float: right;
          padding: 5px 8px;
          margin: -5px 0;
          border-radius: 3px;
          transition: background 0.3s;
        " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">×</button>
      </div>
      <style>
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        #promotional-banner {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          background-size: 200% 200%;
          animation: slideDown 0.5s ease-out, shimmer 3s ease-in-out infinite;
        }
        #promotional-banner:hover {
          transform: scale(1.02);
          transition: transform 0.3s ease;
        }
      </style>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(bannerHtml);
    return;
  }

  // Test page for banner
  if (urlPath === '/test') {
    const testPageHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Banner Test - Promotional Banner App</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background: #f8f9fa;
          }
          .test-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .controls {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .banner-frame {
            border: 2px dashed #ccc;
            margin: 20px 0;
            background: white;
          }
          button {
            background: #007cba;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
            font-size: 14px;
          }
          button:hover {
            background: #005a87;
          }
          .status {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 4px;
            margin: 10px 0;
          }
          .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 4px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
            word-wrap: break-word;
          }
        </style>
      </head>
      <body>
        <div class="test-container">
          <h1>🎉 Promotional Banner Test Page</h1>
          
          <div class="status">
            ✅ App is running successfully on Vercel!
          </div>
          
          <div class="controls">
            <h3>Banner Controls</h3>
            <button onclick="loadBanner()">Load Banner</button>
            <button onclick="removeBanner()">Remove Banner</button>
            <button onclick="toggleBanner()">Toggle Banner</button>
          </div>
          
          <div class="banner-frame" id="banner-container">
            <!-- Banner will appear here -->
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Sample Store Content</h3>
            <p>This simulates your Shopify store content. The promotional banner appears above this content.</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0;">
              <div style="border: 1px solid #ddd; padding: 15px; border-radius: 4px;">
                <h4>Product 1</h4>
                <p>Sample product with free shipping!</p>
              </div>
              <div style="border: 1px solid #ddd; padding: 15px; border-radius: 4px;">
                <h4>Product 2</h4>
                <p>Another great product with free shipping!</p>
              </div>
              <div style="border: 1px solid #ddd; padding: 15px; border-radius: 4px;">
                <h4>Product 3</h4>
                <p>Amazing product with free shipping!</p>
              </div>
            </div>
          </div>
        </div>
        
        <script>
          function loadBanner() {
            fetch('/app_proxy/banner?shop=test-shop.myshopify.com')
              .then(response => response.text())
              .then(html => {
                document.getElementById('banner-container').innerHTML = html;
                showNotification('Banner loaded successfully!', 'success');
              })
              .catch(error => {
                console.error('Error:', error);
                showNotification('Error loading banner', 'error');
              });
          }
          
          function removeBanner() {
            document.getElementById('banner-container').innerHTML = '';
            showNotification('Banner removed', 'info');
          }
          
          function toggleBanner() {
            const container = document.getElementById('banner-container');
            if (container.innerHTML.trim() === '') {
              loadBanner();
            } else {
              removeBanner();
            }
          }
          
          function showNotification(message, type) {
            // Remove any existing notifications
            const existingNotifications = document.querySelectorAll('.notification');
            existingNotifications.forEach(notification => notification.remove());
            
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            
            // Set background color based on type
            const colors = {
              success: '#28a745',
              error: '#dc3545',
              info: '#007cba'
            };
            notification.style.backgroundColor = colors[type] || colors.info;
            
            document.body.appendChild(notification);
            
            // Auto-remove after 3 seconds
            setTimeout(() => {
              if (notification.parentNode) {
                notification.remove();
              }
            }, 3000);
          }
          
          // Auto-load banner on page load
          loadBanner();
        </script>
        
        <style>
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        </style>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(testPageHtml);
    return;
  }

  // Embedded app interface
  if (urlPath === '/app') {
    const appHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Promotional Banner App</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f9f9fa;
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 15px 20px;
            font-size: 16px;
            font-weight: bold;
            border-radius: 4px;
            margin: 20px 0;
            animation: shimmer 3s ease-in-out infinite;
          }
          .status {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Promotional Banner App</h1>
            <p>Beautiful promotional banners for your Shopify store</p>
          </div>
          
          <div class="status">
            ✅ Your promotional banner app is active and ready!
          </div>
          
          <div class="banner-preview">
            <span>🎉</span> Free Shipping on All Orders! <span>🎉</span>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p><strong>The banner is now active on your store!</strong></p>
            <p>Visit your store to see the promotional banner in action.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(appHtml);
    return;
  }

  // 404 for unknown routes
  res.status(404).json({ error: 'Not found' });
} 