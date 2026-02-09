# 部署指南 - API Monitor SaaS

> **目标**: 部署到Vercel，准备上线
>
> **当前状态**: 前后端完成，等待Supabase集成

---

## 📋 部署前检查清单

- [ ] Supabase项目已创建
- [ ] API密钥已获取
- [ ] 后端代码已更新
- [ ] 前端代码已测试
- [ ] 环境变量已配置
- [ ] Git仓库已创建
- [ ] Vercel账户已连接

---

## 🚀 部署步骤

### Step 1: Supabase设置（需要你操作）

#### 1.1 创建项目
```
1. 访问: https://supabase.com
2. 登录或注册
3. 点击 "New Project"
4. 项目名称: api-monitor-saas
5. 等待创建（约30秒）
```

#### 1.2 执行Schema
```
1. 进入项目的 "SQL Editor"
2. 打开文件: /Users/gold/.openclaw/workspace-lan/api-monitor-saas/supabase/schema.sql
3. 复制所有内容
4. 粘贴到SQL Editor
5. 点击 "Run" 按钮
6. 等待执行完成
```

#### 1.3 获取API密钥
```
1. 进入项目的 "Settings" > "API"
2. 复制以下3个值:

   Project URL: https://xxxxx.supabase.co
   Anon Public Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

3. 提供给我（粘贴到下面的模板中）
```

---

### Step 2: 配置环境变量（我帮你完成）

#### 2.1 创建 `.env` 文件

在项目根目录创建 `.env` 文件：

```bash
# Supabase（替换为实际值）
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Node
NODE_ENV=production
PORT=3000

# CORS（生产域名）
ALLOWED_ORIGINS=https://api-monitor.vercel.app

# 其他
LOG_LEVEL=info
```

#### 2.2 创建 `.env.production` 文件

用于Vercel部署：

```bash
# Supabase Production
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Vercel Specific
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://api-monitor.vercel.app

# Security
LOG_LEVEL=error
```

---

### Step 3: 推送到GitHub（需要你操作）

#### 3.1 初始化Git仓库

```bash
cd /Users/gold/.openclaw/workspace-lan/api-monitor-saas
git init
git add .
git commit -m "Initial commit - API Monitor v2.0"
```

#### 3.2 创建GitHub仓库

```
1. 访问: https://github.com/new
2. 仓库名: api-monitor-saas
3. 设置为 Public 或 Private
4. 不要添加 .gitignore, README, license
5. 点击 "Create repository"
```

#### 3.3 推送代码

```bash
git remote add origin https://github.com/yourusername/api-monitor-saas.git
git branch -M main
git push -u origin main
```

---

### Step 4: 连接到Vercel（需要你操作）

#### 4.1 部署前端

```
1. 访问: https://vercel.com/new
2. 选择: "Git Repository"
3. 输入仓库地址: https://github.com/yourusername/api-monitor-saas.git
4. Project Name: api-monitor
5. Framework Preset: Vite
6. Root Directory: ./client
7. Build Command: npm run build
8. Output Directory: dist
9. Install Command: npm install
10. 点击 "Deploy"
11. 等待部署完成（约2-3分钟）
12. 访问提供的域名（如: https://api-monitor.vercel.app）
```

#### 4.2 环境变量设置

在Vercel项目设置中：

```
Settings > Environment Variables

SUPABASE_URL = https://xxxxx.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV = production
ALLOWED_ORIGINS = https://api-monitor.vercel.app
```

---

### Step 5: 测试生产环境

#### 5.1 测试前端

```
1. 访问: https://api-monitor.vercel.app
2. 检查页面是否正常加载
3. 测试导航（Dashboard, Alerts, Pricing）
4. 测试登录/注册（demo模式）
```

#### 5.2 测试API

```
1. 访问: https://api-monitor.vercel.app/health
2. 应该返回JSON响应
3. 检查status和version
```

#### 5.3 运行测试套件

```bash
cd /Users/gold/.openclaw/workspace-lan/api-monitor-saas
node test-api.js
```

---

## 🔧 故障排除

### 问题1: 部署失败

**原因**: 构建错误或依赖问题
**解决**:
- 检查Vercel部署日志
- 检查package.json的脚本
- 确保所有依赖已安装

### 问题2: 环境变量未生效

**原因**: 变量名不匹配
**解决**:
- 确保变量名与代码中一致
- 重新部署以应用新变量
- 检查大小写（环境变量敏感）

### 问题3: CORS错误

**原因**: 前端域名未在ALLOWED_ORIGINS中
**解决**:
- 添加前端域名到ALLOWED_ORIGINS
- 重新部署
- 检查后端CORS配置

### 问题4: 数据库连接失败

**原因**: Supabase密钥错误或网络问题
**解决**:
- 检查Supabase密钥是否正确
- 确认Supabase服务正常运行
- 检查网络连接

---

## 📊 部署成功后

### 访问你的应用

**前端**: https://api-monitor.vercel.app
**后端**: https://api-monitor.vercel.app/api/*
**健康检查**: https://api-monitor.vercel.app/health

### 生产环境测试

```bash
# 测试健康检查
curl https://api-monitor.vercel.app/health

# 测试API（需要认证）
curl -X POST https://api-monitor.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

---

## 💰 收入开始

### Pricing页面
- Free: $0
- Basic: $19/月
- Pro: $49/月
- Enterprise: $199/月

### 收入追踪

我将追踪：
- 用户注册数
- 付费用户数
- 月度收入（MRR）
- 年度收入（ARR）

---

## 🎯 上线后立即行动

### 优先级1: 用户获取
1. **Product Hunt发布** - 目标Top 5
2. **社交媒体推广** - Twitter, LinkedIn
3. **社区营销** - Reddit, Hacker News
4. **SEO优化** - Google搜索

### 优先级2: 优化
1. **用户反馈收集**
2. **数据分析**
3. **功能优化**
4. **Bug修复**

### 优先级3: 扩张
1. **增加新功能**
2. **移动端开发**
3. **API平台开发**
4. **企业版推出**

---

## 📞 支持和帮助

### 文档
- README.md
- API_DOCUMENTATION.md
- USER_MANUAL.md

### 测试
- test-api.js - API测试套件
- 完整测试流程

---

## 🎉 部署完成

**恭喜！API Monitor SaaS已部署上线！**

**下一步**：
1. 测试所有功能
2. 创建Product Hunt账号
3. 准备发布材料
4. 开始获取用户

---

**需要帮助？告诉我你的问题！** 💰
