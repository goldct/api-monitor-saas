// In-memory storage (shared across requests in same instance)
let endpoints = [];
let monitors = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query;
    const userEndpoints = endpoints.filter(e => e.userId === userId);
    const stats = {
      totalEndpoints: userEndpoints.length,
      totalChecks: monitors.length,
      successfulChecks: monitors.filter(m => m.status === 'success').length,
      failedChecks: monitors.filter(m => m.status === 'failed').length,
      avgResponseTime: monitors.length > 0
        ? monitors.reduce((sum, m) => sum + m.responseTime, 0) / monitors.length
        : 0
    };
    res.status(200).json({ success: true, data: stats });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
