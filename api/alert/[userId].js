// In-memory storage (shared across requests in same instance)
let alerts = [];

export default function handler(req, res) {
  const { userId } = req.query;
  const { method } = req;

  // GET /api/alert/:userId - Get all alerts for a user
  if (method === 'GET') {
    const userAlerts = alerts.filter(a => a.userId === userId);
    res.status(200).json({ success: true, data: userAlerts });
    return;
  }

  // PUT /api/alert/:id - Update an alert (toggle enabled)
  if (method === 'PUT') {
    const { id } = req.query;
    const { enabled } = req.body;
    const alert = alerts.find(a => a.id === parseInt(id));
    if (!alert) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }
    if (typeof enabled === 'boolean') {
      alert.enabled = enabled;
    }
    res.status(200).json({ success: true, data: alert });
    return;
  }

  // DELETE /api/alert/:id - Delete an alert
  if (method === 'DELETE') {
    const { id } = req.query;
    alerts = alerts.filter(a => a.id !== parseInt(id));
    res.status(200).json({ success: true });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
