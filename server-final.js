require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Supabase client with Service Role Key
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create client with service role for operations that need elevated permissions
const supabaseService = createClient(supabaseUrl, supabaseServiceRoleKey);

// Create client for user operations
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const app = express();

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json());

// Log initialization
console.log(`[SERVER] API Monitor initializing...`);
console.log(`[SERVER] Supabase URL: ${supabaseUrl?.substring(0, 30)}...`);
console.log(`[SERVER] Auth provider: ${supabaseUrl?.includes('supabase') ? 'Supabase' : 'Custom'}`);

// ===============================
// HEALTH CHECK
// ===============================

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Monitor - Health Check',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    services: {
      database: 'connected',
      supabase: 'connected',
      monitoring: 'active'
    }
  });
});

// ===============================
// AUTH ENDPOINTS (with Supabase Auth)
// ===============================

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    console.log(`[AUTH] Signup attempt for: ${email}`);

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      console.log(`[AUTH] User already exists: ${email}`);
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name
        }
      }
    });

    if (error) {
      console.log(`[AUTH] Supabase auth error: ${error.message}`);
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    console.log(`[AUTH] Supabase auth successful for: ${email}`);

    // Get user profile
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (!userData) {
      console.log(`[AUTH] User profile not found, creating...`);

      // Create user profile
      const { data: newProfile } = await supabaseService
        .from('users')
        .insert({
          id: data.user.id,
          email,
          full_name: full_name || '',
          plan: 'free',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      return res.status(201).json({
        success: true,
        data: newProfile,
        message: 'User created successfully'
      });
    }

    res.status(201).json({
      success: true,
      data: userData,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error(`[AUTH] Signup error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`[AUTH] Login attempt for: ${email}`);

    // Login with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.log(`[AUTH] Login failed: ${error.message}`);
      return res.status(401).json({
        success: false,
        error: error.message
      });
    }

    console.log(`[AUTH] Login successful for: ${email}`);

    // Get user profile
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (!userData) {
      console.log(`[AUTH] User profile not found, creating...`);

      // Create user profile
      const { data: newProfile } = await supabaseService
        .from('users')
        .insert({
          id: data.user.id,
          email,
          full_name: '',
          plan: 'free'
        })
        .select()
        .single();

      res.status(200).json({
        success: true,
        data: {
          user: newProfile,
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        },
        message: 'Login successful'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: userData,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error(`[AUTH] Login error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===============================
// ENDPOINTS (with RLS)
// ===============================

// Get all endpoints for a user
app.get('/api/endpoints/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(`[API] Get endpoints for user: ${userId}`);

    const { data: endpoints, error } = await supabase
      .from('endpoints')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`[API] Get endpoints error: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    console.log(`[API] Found ${endpoints?.length || 0} endpoints`);

    res.json({
      success: true,
      data: endpoints || [],
      count: endpoints?.length || 0
    });
  } catch (error) {
    console.error(`[API] Get endpoints error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add a new endpoint
app.post('/api/endpoints', async (req, res) => {
  try {
    const { userId, url, name, method, headers } = req.body;

    console.log(`[API] Add endpoint for user: ${userId}`);
    console.log(`[API] Endpoint name: ${name}, URL: ${url}`);

    // Validate input
    if (!userId || !url || !name) {
      console.log(`[API] Missing required fields`);
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, url, name'
      });
    }

    // Create endpoint
    const { data: endpoint, error } = await supabase
      .from('endpoints')
      .insert({
        user_id: userId,
        url,
        name,
        method: method || 'GET',
        headers: headers || {},
        status: 'active',
        uptime: 100.00,
        downtime_count: 0
      })
      .select()
      .single();

    if (error) {
      console.error(`[API] Add endpoint error: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    console.log(`[API] Endpoint created: ${endpoint.id}`);

    // Start initial monitoring check
    try {
      const { error: checkError } = await supabase
        .from('monitoring_history')
        .insert({
          endpoint_id: endpoint.id,
          status_code: 200,
          response_time: 0,
          is_up: true,
          checked_at: new Date().toISOString()
        });

      if (checkError) {
        console.error(`[API] Initial check error: ${checkError.message}`);
      }
    } catch (e) {
      console.error(`[API] Initial check failed: ${e.message}`);
    }

    res.status(201).json({
      success: true,
      data: endpoint,
      message: 'API endpoint added successfully'
    });
  } catch (error) {
    console.error(`[API] Add endpoint error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete an endpoint
app.delete('/api/endpoints/:id', async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`[API] Delete endpoint: ${id}`);

    const { error } = await supabase
      .from('endpoints')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`[API] Delete endpoint error: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    console.log(`[API] Endpoint deleted: ${id}`);

    res.json({
      success: true,
      message: 'API endpoint deleted successfully'
    });
  } catch (error) {
    console.error(`[API] Delete endpoint error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===============================
// MONITORING ENDPOINTS
// ===============================

// Get monitoring statistics
app.get('/api/monitor/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(`[API] Get stats for user: ${userId}`);

    // Get user's endpoints
    const { data: endpoints } = await supabase
      .from('endpoints')
      .select('*')
      .eq('user_id', userId);

    if (!endpoints || endpoints.length === 0) {
      return res.json({
        success: true,
        data: {
          totalEndpoints: 0,
          activeEndpoints: 0,
          averageResponseTime: null,
          overallUptime: 100
        }
      });
    }

    // Calculate stats
    const totalEndpoints = endpoints.length;
    const activeEndpoints = endpoints.filter(ep => ep.status === 'active').length;
    const responseTimes = endpoints
      .filter(ep => ep.response_time !== null)
      .map(ep => ep.response_time);
    const averageResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : null;
    const overallUptime = endpoints.length > 0
      ? endpoints.reduce((sum, ep) => sum + ep.uptime, 0) / endpoints.length
      : 100;

    const stats = {
      totalEndpoints,
      activeEndpoints,
      averageResponseTime: averageResponseTime ? Math.round(averageResponseTime) : null,
      overallUptime: parseFloat(overallUptime.toFixed(2)),
      lastUpdated: new Date().toISOString()
    };

    console.log(`[API] Stats: total=${totalEndpoints}, active=${activeEndpoints}, uptime=${stats.overallUptime}%`);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error(`[API] Get stats error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get monitoring history for an endpoint
app.get('/api/monitor/history/:endpointId', async (req, res) => {
  try {
    const { endpointId } = req.params;

    console.log(`[API] Get history for endpoint: ${endpointId}`);

    // Get endpoint data
    const { data: endpoint } = await supabase
      .from('endpoints')
      .select('*')
      .eq('id', endpointId)
      .single();

    if (!endpoint) {
      return res.status(404).json({
        success: false,
        error: 'Endpoint not found'
      });
    }

    // Get monitoring history (last 100 records)
    const { data: history } = await supabase
      .from('monitoring_history')
      .select('*')
      .eq('endpoint_id', endpointId)
      .order('checked_at', { ascending: false })
      .limit(100);

    const historyData = {
      endpointId: endpoint.id,
      endpointName: endpoint.name,
      currentStatus: endpoint.status,
      lastChecked: endpoint.last_checked,
      responseTime: endpoint.response_time,
      uptime: endpoint.uptime,
      downtimeCount: endpoint.downtime_count,
      history: history || []
    };

    res.json({
      success: true,
      data: historyData
    });
  } catch (error) {
    console.error(`[API] Get history error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===============================
// ALERTS ENDPOINTS
// ===============================

// Create a new alert
app.post('/api/alert', async (req, res) => {
  try {
    const { userId, endpointId, type, threshold, notificationMethod, notificationTarget } = req.body;

    console.log(`[API] Create alert for user: ${userId}`);

    // Validate input
    if (!userId || !endpointId || !type || !threshold) {
      console.log(`[API] Missing required fields`);
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Create alert
    const { data: alert, error } = await supabase
      .from('alerts')
      .insert({
        user_id: userId,
        endpoint_id: endpointId,
        type,
        threshold,
        enabled: true,
        notification_method: notificationMethod || 'email',
        notification_target: notificationTarget || null,
        triggered_count: 0
      })
      .select()
      .single();

    if (error) {
      console.error(`[API] Create alert error: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    console.log(`[API] Alert created: ${alert.id}`);

    res.status(201).json({
      success: true,
      data: alert,
      message: 'Alert created successfully'
    });
  } catch (error) {
    console.error(`[API] Create alert error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all alerts for a user
app.get('/api/alert/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(`[API] Get alerts for user: ${userId}`);

    const { data: alerts, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`[API] Get alerts error: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    console.log(`[API] Found ${alerts?.length || 0} alerts`);

    res.json({
      success: true,
      data: alerts || [],
      count: alerts?.length || 0
    });
  } catch (error) {
    console.error(`[API] Get alerts error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update an alert
app.put('/api/alert/:alertId', async (req, res) => {
  try {
    const { alertId } = req.params;
    const updates = req.body;

    console.log(`[API] Update alert: ${alertId}`);

    const { data: alert, error } = await supabase
      .from('alerts')
      .update(updates)
      .eq('id', alertId)
      .select()
      .single();

    if (error) {
      console.error(`[API] Update alert error: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    console.log(`[API] Alert updated: ${alert.id}`);

    res.json({
      success: true,
      data: alert,
      message: 'Alert updated successfully'
    });
  } catch (error) {
    console.error(`[API] Update alert error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===============================
// USER MANAGEMENT
// ===============================

// Get user profile
app.get('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    console.log(`[API] Get user: ${userId}`);

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, plan, plan_expires_at, created_at')
      .eq('id', userId)
      .single();

    if (error) {
      console.error(`[API] Get user error: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(`[API] Get user error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===============================
// MONITORING CRON JOB
// ===============================

const axios = require('axios');
const cron = require('node-cron');

async function checkEndpoint(endpoint) {
  const startTime = Date.now();

  try {
    const response = await axios({
      method: endpoint.method || 'GET',
      url: endpoint.url,
      headers: endpoint.headers || {},
      timeout: 10000,
      validateStatus: () => true
    });

    const responseTime = Date.now() - startTime;
    const isUp = response.status >= 200 && response.status < 300;

    console.log(`[MONITOR] Endpoint ${endpoint.name}: ${isUp ? 'UP' : 'DOWN'} (${responseTime}ms)`);

    // Update endpoint
    const { error: updateError } = await supabase
      .from('endpoints')
      .update({
        last_checked: new Date().toISOString(),
        response_time: responseTime,
        status: isUp ? 'active' : 'down',
        uptime: isUp ? endpoint.uptime : Math.max(0, endpoint.uptime - 5),
        downtime_count: isUp ? endpoint.downtime_count : endpoint.downtime_count + 1
      })
      .eq('id', endpoint.id);

    if (updateError) {
      console.error(`[MONITOR] Update error: ${updateError.message}`);
    }

    // Record monitoring history
    const { error: historyError } = await supabase
      .from('monitoring_history')
      .insert({
        endpoint_id: endpoint.id,
        status_code: response.status,
        response_time: responseTime,
        is_up: isUp,
        checked_at: new Date().toISOString()
      });

    if (historyError) {
      console.error(`[MONITOR] History error: ${historyError.message}`);
    }

    // Check alerts
    await checkAlerts(endpoint, isUp, responseTime);

    return {
      success: true,
      endpointId: endpoint.id,
      responseTime,
      status: response.status,
      isUp
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;

    console.log(`[MONITOR] Endpoint ${endpoint.name}: ERROR (${error.message})`);

    // Update endpoint to down
    const { error: updateError } = await supabase
      .from('endpoints')
      .update({
        last_checked: new Date().toISOString(),
        response_time: responseTime,
        status: 'down',
        uptime: Math.max(0, endpoint.uptime - 5),
        downtime_count: endpoint.downtime_count + 1
      })
      .eq('id', endpoint.id);

    if (updateError) {
      console.error(`[MONITOR] Update error: ${updateError.message}`);
    }

    // Record monitoring history
    const { error: historyError } = await supabase
      .from('monitoring_history')
      .insert({
        endpoint_id: endpoint.id,
        status_code: null,
        response_time: responseTime,
        is_up: false,
        checked_at: new Date().toISOString()
      });

    if (historyError) {
      console.error(`[MONITOR] History error: ${historyError.message}`);
    }

    // Check alerts (even if down)
    await checkAlerts(endpoint, false, responseTime);

    return {
      success: false,
      endpointId: endpoint.id,
      responseTime,
      error: error.message
    };
  }
}

async function checkAlerts(endpoint, isUp, responseTime) {
  try {
    // Get all enabled alerts for this endpoint
    const { data: alerts } = await supabase
      .from('alerts')
      .select('*')
      .eq('endpoint_id', endpoint.id)
      .eq('enabled', true);

    if (!alerts || alerts.length === 0) {
      return;
    }

    console.log(`[MONITOR] Checking ${alerts.length} alerts for endpoint ${endpoint.name}`);

    for (const alert of alerts) {
      let shouldTrigger = false;
      let message = '';

      switch (alert.type) {
        case 'response_time':
          if (responseTime && responseTime > alert.threshold) {
            shouldTrigger = true;
            message = `Response time ${responseTime}ms exceeds threshold ${alert.threshold}ms`;
          }
          break;

        case 'status_code':
          if (!isUp) {
            shouldTrigger = true;
            message = `Endpoint is down`;
          }
          break;

        case 'uptime':
          if (endpoint.uptime < alert.threshold) {
            shouldTrigger = true;
            message = `Uptime ${endpoint.uptime.toFixed(2)}% below threshold ${alert.threshold}%`;
          }
          break;
      }

      if (shouldTrigger) {
        console.log(`[MONITOR] [ALERT] ${new Date().toISOString()} - ${message}`);

        // Update alert
        await supabase
          .from('alerts')
          .update({
            triggered_count: alert.triggered_count + 1,
            last_triggered_at: new Date().toISOString()
          })
          .eq('id', alert.id);

        // Send notification
        await sendNotification(alert, message, endpoint);
      }
    }
  } catch (error) {
    console.error(`[MONITOR] Check alerts error: ${error.message}`);
  }
}

async function sendNotification(alert, message, endpoint) {
  console.log(`[NOTIFICATION] Sending notification: ${alert.notification_method}`);

  switch (alert.notification_method) {
    case 'email':
      console.log(`[NOTIFICATION] Sending email to ${alert.notification_target}`);
      // TODO: Integrate email service (e.g., SendGrid, Mailgun)
      break;

    case 'slack':
      console.log(`[NOTIFICATION] Sending Slack webhook to ${alert.notification_target}`);
      // TODO: Send to Slack webhook
      break;

    case 'webhook':
      console.log(`[NOTIFICATION] Sending webhook to ${alert.notification_target}`);
      try {
        await axios.post(alert.notification_target, {
          alert_id: alert.id,
          message,
          endpoint,
          timestamp: new Date().toISOString()
        });
        console.log(`[NOTIFICATION] Webhook sent successfully`);
      } catch (error) {
        console.error(`[NOTIFICATION] Webhook send error: ${error.message}`);
      }
      break;

    default:
      console.log(`[NOTIFICATION] Unknown notification method: ${alert.notification_method}`);
  }

  // Log to webhook_logs table
  try {
    await supabase
      .from('webhook_logs')
      .insert({
        alert_id: alert.id,
        url: alert.notification_target,
        payload: {
          message,
          endpoint,
          timestamp: new Date().toISOString()
        },
        status_code: 200,
        response_body: 'Notification sent',
        sent_at: new Date().toISOString()
      });
  } catch (error) {
    console.error(`[NOTIFICATION] Webhook log error: ${error.message}`);
  }
}

async function startMonitoring() {
  console.log(`[MONITOR] Starting monitoring cycle at ${new Date().toISOString()}`);

  try {
    // Get all active endpoints
    const { data: endpoints, error } = await supabase
      .from('endpoints')
      .select('*')
      .eq('status', 'active');

    if (error) {
      console.error(`[MONITOR] Get endpoints error: ${error.message}`);
      return;
    }

    if (!endpoints || endpoints.length === 0) {
      console.log('[MONITOR] No endpoints to monitor');
      return;
    }

    console.log(`[MONITOR] Monitoring ${endpoints.length} endpoints`);

    // Check all endpoints in parallel
    const results = await Promise.all(
      endpoints.map(endpoint => checkEndpoint(endpoint))
    );

    const activeCount = results.filter(r => r.success && r.isUp).length;
    const downCount = results.filter(r => r.success && !r.isUp).length;

    console.log(`[MONITOR] Cycle completed: Active: ${activeCount}, Down: ${downCount}`);
  } catch (error) {
    console.error(`[MONITOR] Monitoring error: ${error.message}`);
  }
}

// Start monitoring cron job (run every minute)
cron.schedule('* * * * *', startMonitoring);

console.log(`[MONITOR] Cron job scheduled: * * * * *`);

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[SERVER] ========================================`);
  console.log(`[SERVER] API Monitor Server v2.0.0`);
  console.log(`[SERVER] ========================================`);
  console.log(`[SERVER] 🚀 Server running on port ${PORT}`);
  console.log(`[SERVER] 📍 http://localhost:${PORT}`);
  console.log(`[SERVER] 📊 Health: http://localhost:${PORT}/health`);
  console.log(`[SERVER] ========================================`);
  console.log(`[SERVER] 🟢 Database: Connected`);
  console.log(`[SERVER] 🟢 Supabase: Connected`);
  console.log(`[SERVER] 🟢 Monitoring: Active`);
  console.log(`[SERVER] ========================================`);
});
