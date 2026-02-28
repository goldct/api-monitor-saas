// In-memory storage (shared across requests in same instance)
let alerts = [];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, endpointId, type, threshold, notificationMethod, notificationTarget } = req.body;
    if (!userId || !endpointId || !type || !threshold || !notificationMethod) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const alert = {
      id: Date.now(),
      userId,
      endpointId,
      type,
      threshold,
      notificationMethod,
      notificationTarget: notificationTarget || '',
      enabled: true,
      triggeredCount: 0,
      createdAt: new Date().toISOString()
    };
    alerts.push(alert);
    res.status(200).json({ success: true, data: alert });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
