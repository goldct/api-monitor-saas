export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      message: 'API Monitor - Health Check',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
