// API测试脚本 - Supabase集成版本
const axios = require('axios');

const API_BASE = 'http://localhost:3000';

async function testAPI() {
  console.log('======================================');
  console.log('API MONITOR - 功能测试');
  console.log('======================================');
  console.log('');

  // Test 1: 健康检查
  try {
    console.log('[TEST 1] 健康检查...');
    const response = await axios.get(`${API_BASE}/health`);
    console.log('✅ 健康检查通过');
    console.log(`   版本: ${response.data.version}`);
    console.log(`   数据库: ${response.data.services.database}`);
    console.log(`   监控: ${response.data.services.monitoring}`);
  } catch (error) {
    console.log('❌ 健康检查失败:', error.message);
    return;
  }

  console.log('');
  console.log('----------------------------------------');
  console.log('');

  // Test 2: 用户注册
  try {
    console.log('[TEST 2] 用户注册...');
    const email = `test-${Date.now()}@example.com`;
    const password = 'password123';
    const fullName = 'Test User';

    const response = await axios.post(`${API_BASE}/api/auth/signup`, {
      email,
      password,
      full_name: fullName
    });

    if (response.data.success) {
      console.log('✅ 用户注册成功');
      console.log(`   邮箱: ${email}`);
      console.log(`   姓名: ${fullName}`);
      console.log(`   用户ID: ${response.data.data.id}`);
    } else {
      console.log('❌ 注册失败:', response.data.error);
    }
  } catch (error) {
    console.log('❌ 注册异常:', error.response?.data?.error || error.message);
  }

  console.log('');
  console.log('----------------------------------------');
  console.log('');

  // Test 3: 用户登录
  try {
    console.log('[TEST 3] 用户登录...');
    const email = 'test@example.com';
    const password = 'password123';

    const response = await axios.post(`${API_BASE}/api/auth/login`, {
      email,
      password
    });

    if (response.data.success) {
      console.log('✅ 用户登录成功');
      console.log(`   用户ID: ${response.data.data.user.id}`);
      console.log(`   方案: ${response.data.data.user.plan}`);
      var userId = response.data.data.user.id;
    } else {
      console.log('❌ 登录失败:', response.data.error);
      userId = null;
    }
  } catch (error) {
    console.log('❌ 登录异常:', error.response?.data?.error || error.message);
    userId = null;
  }

  console.log('');
  console.log('----------------------------------------');
  console.log('');

  // Test 4: 获取端点列表
  if (userId) {
    try {
      console.log('[TEST 4] 获取用户端点...');
      const response = await axios.get(`${API_BASE}/api/endpoints/${userId}`);

      if (response.data.success) {
        console.log('✅ 获取端点成功');
        console.log(`   数量: ${response.data.data.length}`);
        if (response.data.data.length > 0) {
          console.log(`   第一个端点: ${response.data.data[0].name}`);
        }
      }
    } catch (error) {
      console.log('❌ 获取端点异常:', error.response?.data?.error || error.message);
    }
  }

  console.log('');
  console.log('----------------------------------------');
  console.log('');

  // Test 5: 添加新端点
  if (userId) {
    try {
      console.log('[TEST 5] 添加新端点...');
      var endpointData = {
        userId: userId,
        url: 'https://api.github.com',
        name: 'GitHub API Test',
        method: 'GET'
      };

      var response = await axios.post(`${API_BASE}/api/endpoints`, endpointData);

      if (response.data.success) {
        console.log('✅ 添加端点成功');
        console.log(`   端点ID: ${response.data.data.id}`);
        console.log(`   端点名称: ${response.data.data.name}`);
        console.log(`   状态: ${response.data.data.status}`);
      }
    } catch (error) {
      console.log('❌ 添加端点异常:', error.response?.data?.error || error.message);
    }
  }

  console.log('');
  console.log('----------------------------------------');
  console.log('');

  // Test 6: 获取监控统计
  if (userId) {
    try {
      console.log('[TEST 6] 获取监控统计...');
      var response = await axios.get(`${API_BASE}/api/monitor/stats/${userId}`);

      if (response.data.success) {
        console.log('✅ 获取统计成功');
        var stats = response.data.data;
        console.log(`   总端点: ${stats.totalEndpoints}`);
        console.log(`   活跃端点: ${stats.activeEndpoints}`);
        console.log(`   平均响应时间: ${stats.averageResponseTime}ms`);
        console.log(`   整体可用性: ${stats.overallUptime}%`);
      }
    } catch (error) {
      console.log('❌ 获取统计异常:', error.response?.data?.error || error.message);
    }
  }

  console.log('');
  console.log('----------------------------------------');
  console.log('');

  // Test 7: 创建告警
  if (userId) {
    try {
      console.log('[TEST 7] 创建告警...');
      var alertData = {
        userId: userId,
        endpointId: '1',
        type: 'response_time',
        threshold: 1000,
        notificationMethod: 'webhook',
        notificationTarget: 'https://httpbin.org/post'
      };

      var response = await axios.post(`${API_BASE}/api/alert`, alertData);

      if (response.data.success) {
        console.log('✅ 创建告警成功');
        console.log(`   告警ID: ${response.data.data.id}`);
        console.log(`   类型: ${response.data.data.type}`);
        console.log(`   阈值: ${response.data.data.threshold}`);
      }
    } catch (error) {
      console.log('❌ 创建告警异常:', error.response?.data?.error || error.message);
    }
  }

  console.log('');
  console.log('----------------------------------------');
  console.log('');

  // Test 8: 获取告警列表
  if (userId) {
    try {
      console.log('[TEST 8] 获取告警列表...');
      var response = await axios.get(`${API_BASE}/api/alert/${userId}`);

      if (response.data.success) {
        console.log('✅ 获取告警成功');
        console.log(`   告警数量: ${response.data.data.length}`);
      }
    } catch (error) {
      console.log('❌ 获取告警异常:', error.response?.data?.error || error.message);
    }
  }

  console.log('');
  console.log('======================================');
  console.log('测试完成');
  console.log('======================================');
}

// 执行测试
testAPI().catch(function(error) {
  console.error('测试套件失败:', error.message);
  process.exit(1);
});
