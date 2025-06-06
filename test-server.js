// Simple test server for the promotional banner
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static('.'));

// Test endpoint for banner configuration
app.get('/api/banner/config', (req, res) => {
  res.json({
    enabled: true,
    text: '🎉 Free Shipping on All Orders! 🎉',
    backgroundColor: '#4CAF50',
    textColor: '#FFFFFF',
    fontSize: '16px',
    position: 'top'
  });
});

// App proxy endpoint (simulated)
app.get('/app_proxy/banner', (req, res) => {
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
    </style>
  `;

  res.set('Content-Type', 'text/html');
  res.send(bannerHtml);
});

// Serve test page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'banner-test.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
  console.log(`📱 Banner test: http://localhost:${PORT}/banner-test.html`);
  console.log(`🔧 API test: http://localhost:${PORT}/api/banner/config`);
});

module.exports = app; 