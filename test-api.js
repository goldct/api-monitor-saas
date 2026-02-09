#!/usr/bin/env node

/**
 * API Test Script for API Monitor
 * Tests all endpoints without database
 */

const axios = require('axios');
const BASE_URL = 'http://localhost:3000';

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logSection(title) {
  console.log('');
  log('═'.repeat(60), 'cyan');
  log(`  ${title}`, 'bold');
  log('═'.repeat(60), 'cyan');
}

async function testHealthCheck() {
  logSection('Testing Health Check');

  try {
    const response = await axios.get(`${BASE_URL}/health`);
    logSuccess(`Health check passed`);
    log(`Message: ${response.data.message}`);
    log(`Version: ${response.data.version}`);
    log(`Services:`, 'blue');
    Object.entries(response.data.services).forEach(([key, value]) => {
      log(`  - ${key}: ${value}`, 'blue');
    });
    return true;
  } catch (error) {
    logError(`Health check failed: ${error.message}`);
    return false;
  }
}

async function testEndpointCreation() {
  logSection('Testing Endpoint Creation');

  const testUserId = 'test-user-api';
  const testData = {
    userId: testUserId,
    url: 'https://api.github.com',
    name: 'Test API',
    method: 'GET',
    headers: {}
  };

  try {
    const response = await axios.post(`${BASE_URL}/api/endpoints`, testData);
    logSuccess(`Endpoint created`);
    log(`ID: ${response.data.data.id}`);
    log(`Name: ${response.data.data.name}`);
    log(`URL: ${response.data.data.url}`);
    return response.data.data.id;
  } catch (error) {
    logError(`Endpoint creation failed: ${error.message}`);
    if (error.response) {
      logError(`Response: ${JSON.stringify(error.response.data)}`, 'red');
    }
    return null;
  }
}

async function testGetEndpoints() {
  logSection('Testing Get Endpoints');

  const testUserId = 'test-user-api';

  try {
    const response = await axios.get(`${BASE_URL}/api/endpoints/${testUserId}`);
    logSuccess(`Get endpoints passed`);
    log(`Count: ${response.data.data.length}`);

    if (response.data.data.length > 0) {
      const endpoint = response.data.data[0];
      log(`First endpoint:`, 'blue');
      log(`  ID: ${endpoint.id}`);
      log(`  Name: ${endpoint.name}`);
      log(`  URL: ${endpoint.url}`);
      log(`  Status: ${endpoint.status}`);
      log(`  Response Time: ${endpoint.response_time}ms`);
      log(`  Uptime: ${endpoint.uptime.toFixed(2)}%`);
    }

    return response.data.data;
  } catch (error) {
    logError(`Get endpoints failed: ${error.message}`);
    return [];
  }
}

async function testMonitorStats() {
  logSection('Testing Monitor Stats');

  const testUserId = 'test-user-api';

  try {
    const response = await axios.get(`${BASE_URL}/monitor/stats/${testUserId}`);
    logSuccess(`Monitor stats passed`);
    const stats = response.data.data;
    log(`Total Endpoints: ${stats.totalEndpoints}`);
    log(`Active Endpoints: ${stats.activeEndpoints}`);
    log(`Average Response Time: ${stats.averageResponseTime}ms`);
    log(`Overall Uptime: ${stats.overallUptime}%`);
    log(`Last Updated: ${new Date(stats.lastUpdated).toLocaleString()}`);
    return true;
  } catch (error) {
    logError(`Monitor stats failed: ${error.message}`);
    return false;
  }
}

async function testCreateAlert() {
  logSection('Testing Alert Creation');

  const testUserId = 'test-user-api';
  const testData = {
    userId: testUserId,
    endpointId: 1,
    type: 'response_time',
    threshold: 1000,
    notificationMethod: 'email',
    notificationTarget: 'test@example.com'
  };

  try {
    const response = await axios.post(`${BASE_URL}/alert`, testData);
    logSuccess(`Alert created`);
    log(`ID: ${response.data.data.id}`);
    log(`Type: ${response.data.data.type}`);
    log(`Threshold: ${response.data.data.threshold}`);
    return response.data.data.id;
  } catch (error) {
    logError(`Alert creation failed: ${error.message}`);
    if (error.response) {
      logError(`Response: ${JSON.stringify(error.response.data)}`, 'red');
    }
    return null;
  }
}

async function testGetAlerts() {
  logSection('Testing Get Alerts');

  const testUserId = 'test-user-api';

  try {
    const response = await axios.get(`${BASE_URL}/alert/${testUserId}`);
    logSuccess(`Get alerts passed`);
    log(`Count: ${response.data.data.length}`);

    if (response.data.data.length > 0) {
      const alert = response.data.data[0];
      log(`First alert:`, 'blue');
      log(`  ID: ${alert.id}`);
      log(`  Type: ${alert.type}`);
      log(`  Threshold: ${alert.threshold}`);
      log(`  Enabled: ${alert.enabled}`);
      log(`  Triggered Count: ${alert.triggered_count}`);
    }

    return response.data.data;
  } catch (error) {
    logError(`Get alerts failed: ${error.message}`);
    return [];
  }
}

async function testDeleteEndpoint() {
  logSection('Testing Endpoint Deletion');

  const testUserId = 'test-user-api';

  try {
    // First create an endpoint
    const createData = {
      userId: testUserId,
      url: 'https://api.github.com',
      name: 'Test Delete',
      method: 'GET'
    };

    const createResponse = await axios.post(`${BASE_URL}/api/endpoints`, createData);
    const endpointId = createResponse.data.data.id;
    logSuccess(`Created test endpoint (ID: ${endpointId})`);

    // Now delete it
    await axios.delete(`${BASE_URL}/api/endpoints/${endpointId}`);
    logSuccess(`Endpoint deleted`);
    return true;
  } catch (error) {
    logError(`Endpoint deletion failed: ${error.message}`);
    return false;
  }
}

async function testResponseTime() {
  logSection('Testing Response Time');

  const startTime = Date.now();

  try {
    const response = await axios.get(`${BASE_URL}/health`);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    if (responseTime < 100) {
      logSuccess(`Response time: ${responseTime}ms (Excellent)`, 'green');
    } else if (responseTime < 200) {
      logSuccess(`Response time: ${responseTime}ms (Good)`, 'yellow');
    } else {
      logWarning(`Response time: ${responseTime}ms (Needs optimization)`);
    }

    return responseTime;
  } catch (error) {
    logError(`Response time test failed: ${error.message}`);
    return null;
  }
}

async function testCORS() {
  logSection('Testing CORS');

  try {
    const response = await axios.get(`${BASE_URL}/health`, {
      headers: {
        'Origin': 'http://localhost:5173'
      }
    });

    const corsHeaders = response.headers['access-control-allow-origin'];

    if (corsHeaders) {
      logSuccess(`CORS enabled: ${corsHeaders}`);
    } else {
      logWarning(`CORS headers not found`);
    }

    return true;
  } catch (error) {
    logError(`CORS test failed: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  logSection('Starting API Monitor Tests', 'bold');
  log(`Base URL: ${BASE_URL}`, 'blue');
  log(`Start Time: ${new Date().toLocaleString()}`, 'blue');
  log('');

  const results = {
    healthCheck: false,
    endpointCreation: false,
    getEndpoints: false,
    monitorStats: false,
    alertCreation: false,
    getAlerts: false,
    endpointDeletion: false,
    responseTime: null,
    cors: false
  };

  // Run tests
  results.healthCheck = await testHealthCheck();
  results.endpointCreation = await testEndpointCreation();
  results.getEndpoints = await testGetEndpoints();
  results.monitorStats = await testMonitorStats();
  results.alertCreation = await testCreateAlert();
  results.getAlerts = await testGetAlerts();
  results.endpointDeletion = await testDeleteEndpoint();
  results.responseTime = await testResponseTime();
  results.cors = await testCORS();

  // Summary
  logSection('Test Summary');
  const passedTests = Object.values(results).filter(v => v === true).length;
  const totalTests = Object.keys(results).filter(k => k !== 'responseTime').length;

  log(`Total Tests: ${totalTests}`, 'blue');
  log(`Passed: ${passedTests}`, 'green');
  log(`Failed: ${totalTests - passedTests}`, 'red');

  if (passedTests === totalTests) {
    logSuccess('All tests passed! 🎉');
  } else {
    const failedTests = Object.entries(results).filter(([k, v]) => k !== 'responseTime' && !v);
    logWarning(`Failed tests:`, 'red');
    failedTests.forEach(([name, _]) => log(`  - ${name}`, 'red'));
  }

  log('');
  log(`End Time: ${new Date().toLocaleString()}`, 'blue');
}

// Run all tests
runAllTests().catch(error => {
  logError(`Test suite failed: ${error.message}`);
  process.exit(1);
});
