# 部署计划 - API Monitor SaaS

> **目标**: 部署到Vercel，开始赚钱
>
> **当前进度**: 后端完成，前端完成70%

---

## 🚀 部署清单

### 1. 前端部署 (Vercel)

#### 准备工作
- [ ] 确认frontend正常运行
- [ ] 测试所有功能
- [ ] 添加Vercel配置

#### 部署步骤
1. **安装Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录Vercel**
   ```bash
   vercel login
   ```

3. **部署前端**
   ```bash
   cd api-monitor-saas/client
   vercel --prod
   ```

4. **获取生产URL**
   - 记录Vercel提供的URL
   - 例如: https://api-monitor.vercel.app

---

### 2. 后端部署 (Vercel Functions 或 Railway)

#### 选项A: Vercel Functions (推荐）
- [ ] 将Express应用转换为Vercel Functions
- [ ] 创建vercel.json配置
- [ ] 部署

#### 选项B: Railway
- [ ] 注册Railway账号
- [ ] 创建新project
- [ ] 连接GitHub仓库
- [ ] 部署

#### 选项C: Render (免费tier）
- [ ] 注册Render账号
- [ ] 创建新Web Service
- [ ] 连接GitHub
- [ ] 部署

---

### 3. 数据库设置 (Supabase)

#### 创建项目
- [ ] 访问 https://supabase.com
- [ ] 创建新项目
- [ ] 等待数据库创建

#### 创建表
- [ ] users表
  ```sql
  CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  ```

- [ ] endpoints表
  ```sql
  CREATE TABLE endpoints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    url TEXT NOT NULL,
    name TEXT NOT NULL,
    method VARCHAR(10) DEFAULT 'GET',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  ```

- [ ] alerts表
  ```sql
  CREATE TABLE alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    endpoint_id UUID REFERENCES endpoints(id),
    type VARCHAR(50) NOT NULL,
    threshold INTEGER NOT NULL,
    enabled BOOLEAN DEFAULT true,
    notification_method VARCHAR(20) DEFAULT 'email',
    notification_target TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  ```

#### 获取API密钥
- [ ] 复制Supabase URL
- [ ] 复制Supabase Anon Key
- [ ] 保存到.env文件

---

### 4. 域名配置

#### 选项A: 使用Vercel默认域名
- [ ] 使用 api-monitor.vercel.app
- [ ] 无需额外配置

#### 选项B: 自定义域名
- [ ] 购买域名 (Namecheap, GoDaddy等）
- [ ] 在Vercel添加域名
- [ ] 配置DNS记录

---

## 🔧 环境变量配置

### Vercel环境变量
在Vercel dashboard设置:

```
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Node
NODE_ENV=production
```

---

## 📊 部署后检查清单

### 功能测试
- [ ] 首页加载正常
- [ ] Dashboard显示正确
- [ ] 可以添加endpoint
- [ ] 可以删除endpoint
- [ ] 监控功能工作
- [ ] 可以创建alert
- [ ] 告警通知工作

### 性能测试
- [ ] 页面加载 < 3秒
- [ ] API响应 < 1秒
- [ ] 监控准确性 > 99%

### 安全测试
- [ ] HTTPS工作正常
- [ ] CORS配置正确
- [ ] 环境变量安全

---

## 💰 成本估算

### Vercel (Hobby Plan - Free)
- 带宽: 100GB/month
- 构建时间: 6,000 minutes/month
- Serverless Functions: 100GB-hours/month
- **成本**: $0

### Supabase (Free Tier)
- 数据库: 500MB
- Bandwidth: 2GB/month
- File Storage: 1GB
- API calls: 50,000/month
- **成本**: $0

### 自定义域名
- 域名注册: $10-15/年
- SSL证书: Free (Let's Encrypt）

**总成本**: $10-15/年（如果使用自定义域名）

---

## 🎯 部署时间表

### 今天 (02/08)
- [x] 后端完成
- [x] 前端UI完成
- [ ] 部署到Vercel
- [ ] 配置Supabase

### 明天 (02/09)
- [ ] 测试所有功能
- [ ] 创建用户认证
- [ ] 集成Stripe支付

### 本周 (02/08 - 02/14)
- [ ] 完成MVP
- [ ] 部署到生产环境
- [ ] 准备Product Hunt发布

---

## 🚨 风险管理

### 如果部署失败
- Plan B: 使用Railway部署
- Plan C: 使用Render部署
- Plan D: 本地运行 + ngrok tunnel

### 如果数据库问题
- Plan B: 使用Neon Database
- Plan C: 使用PlanetScale
- Plan D: 暂时用in-memory storage

---

## 📞 支持和监控

### 监控工具
- Vercel Analytics
- Uptime Robot (监控自身）
- LogRocket (用户行为）

### 错误追踪
- Sentry (错误报告）
- Vercel日志

---

## 🎉 部署成功后

### 立即行动
1. **测试所有功能**
2. **获取10个beta用户**
3. **收集feedback**
4. **准备Product Hunt发布**

### 营销行动
1. **在Twitter发布**
2. **在LinkedIn发布**
3. **在Reddit分享**
4. **准备Product Hunt post**

---

## 📋 部署完成后文件

- [ ] DEPLOYMENT_SUCCESS.md - 部署成功报告
- [ ] PRODUCTION_URL.md - 生产环境URL
- [ ] FIRST_USERS.md - Beta用户列表
- [ ] FEEDBACK.md - 用户反馈

---

**部署负责人**: 盈盈 💰
**目标部署日期**: 2026-02-10
**预计上线**: 2026-02-10
