const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 8080;
const GATEWAY_KEY = 'moltperp-secret-123';

// 1. Auth Middleware
const authenticate = (req, res, next) => {
    if (req.headers['x-api-key'] === GATEWAY_KEY) return next();
    res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
};

// 2. Health Check
app.get('/health', (req, res) => res.json({ status: 'Online', service: 'Moltperp-Gateway' }));

// 3. The Proxy Bridge
// This maps localhost:8080/data/posts/1 -> jsonplaceholder.typicode.com/posts/1
app.use('/data', authenticate, createProxyMiddleware({
    target: 'https://jsonplaceholder.typicode.com',
    changeOrigin: true,
    pathRewrite: {
        '^/data': '', 
    },
}));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🌉 Moltperp Gateway: ACTIVE`);
    console.log(`🔐 Security: API Key Required`);
    console.log(`🚀 Test URL: http://localhost:${PORT}/data/posts/1`);
});
