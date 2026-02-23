// Vercel serverless entry - exports Express app for /api and /health
const app = require('../server-supabase');
module.exports = app;
