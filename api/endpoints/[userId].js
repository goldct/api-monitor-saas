// In-memory storage (shared across requests in same instance)
let endpoints = [];

export default function handler(req, res) {
  const { userId } = req.query;
  const { method } = req;

  // GET /api/endpoints/:userId - Get all endpoints for a user
  if (method === 'GET') {
    const userEndpoints = endpoints.filter(e => e.userId === userId);
    res.status(200).json({ success: true, data: userEndpoints });
    return;
  }

  // DELETE /api/endpoints/:id - Delete an endpoint
  if (method === 'DELETE') {
    const { id } = req.query;
    endpoints = endpoints.filter(e => e.id !== parseInt(id));
    res.status(200).json({ success: true });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
