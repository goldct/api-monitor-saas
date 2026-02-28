// In-memory storage (shared across requests in same instance)
let endpoints = [];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, url, name, method } = req.body;
    if (!userId || !url || !name) {
      return res.status(400).json({ success: false, error: 'Missing required fields: userId, url, name' });
    }
    const endpoint = {
      id: Date.now(),
      userId,
      url,
      name,
      method: method || 'GET',
      createdAt: new Date().toISOString()
    };
    endpoints.push(endpoint);
    res.status(200).json({ success: true, data: endpoint });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
