# Supabase Integration Guide

> **目标**: 将API Monitor集成到Supabase数据库
>
> **状态**: Schema已创建，待设置

---

## 📋 集成清单

- [x] Supabase客户端库安装
- [x] 数据库Schema创建
- [ ] 创建Supabase项目
- [ ] 获取API密钥
- [ ] 配置环境变量
- [ ] 更新后端代码
- [ ] 迁移数据（如果有）
- [ ] 测试所有功能

---

## 🚀 设置步骤

### Step 1: 创建Supabase项目

1. 访问 https://supabase.com
2. 登录或注册账号
3. 点击 "New Project"
4. 命名为: `api-monitor-saas`
5. 等待数据库创建（约30秒）

### Step 2: 获取API密钥

1. 进入项目Dashboard
2. 点击左侧 "Settings" 图标
3. 找到 "API" section
4. 复制以下密钥：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6...`

### Step 3: 执行Schema

#### 方法A: SQL Editor
1. 在Supabase Dashboard点击 "SQL Editor"
2. 复制 `schema.sql` 文件内容
3. 粘贴到SQL Editor
4. 点击 "Run" 执行Schema

#### 方法B: 使用CLI（推荐）
```bash
# 安装Supabase CLI
npm install -g supabase

# 登录
supabase login

# 链接项目
supabase link --project-ref xxxxx

# 推送Schema
supabase db push
```

---

## 🔧 环境变量配置

### 创建 `.env` 文件

在项目根目录创建 `.env` 文件：

```bash
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Node
NODE_ENV=development
PORT=3000

# CORS
ALLOWED_ORIGINS=http://localhost:5173
```

### `.env.example` 文件（提交到git）

```bash
# Supabase (Replace with actual values)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Node
NODE_ENV=development
PORT=3000

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://api-monitor.vercel.app
```

---

## 📦 安装Supabase客户端

```bash
cd /Users/gold/.openclaw/workspace-lan/api-monitor-saas
npm install @supabase/supabase-js
```

---

## 🔌 配置CORS

在后端中添加CORS支持：

```javascript
const cors = require('cors');

// 允许前端域名
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
}));
```

---

## 🔄 迁移现有数据

如果有in-memory数据需要迁移：

1. **导出现有数据**
   - 从in-memory storage导出所有endpoints
   - 导出所有alerts
   - 导出所有users

2. **导入到Supabase**
   - 使用Supabase dashboard
   - 或通过API批量插入

3. **验证数据**
   - 检查所有数据正确导入
   - 测试功能

---

## ✅ 测试集成

### 数据库连接测试

```bash
# 测试环境变量
curl -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  "https://xxxxx.supabase.co/rest/v1/"
```

### 功能测试清单

- [ ] 用户注册
- [ ] 用户登录
- [ ] 添加endpoint
- [ ] 查询endpoints
- [ ] 删除endpoint
- [ ] 创建alert
- [ ] 查询alerts
- [ ] 监控功能
- [ ] 告警触发

---

## 🚨 常见问题

### 问题1: 连接失败
**解决**:
- 检查SUPABASE_URL是否正确
- 检查Anon Key是否有效
- 检查网络连接

### 问题2: CORS错误
**解决**:
- 确保前端URL在ALLOWED_ORIGINS中
- 检查后端CORS配置

### 问题3: 权限错误
**解决**:
- 使用Service Role Key（不是Anon Key）
- 检查RLS policies

---

## 📚 Supabase资源

- [Official Docs](https://supabase.com/docs)
- [JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Auth Guide](https://supabase.com/docs/guides/auth)
- [Database Guide](https://supabase.com/docs/guides/database)

---

## 🎯 下一步

### 后续任务
- [ ] 创建Supabase项目
- [ ] 执行Schema
- [ ] 获取API密钥
- [ ] 配置环境变量
- [ ] 更新后端代码
- [ ] 测试所有功能
- [ ] 部署到Vercel

---

**准备就绪！创建Supabase项目后，将API密钥提供给我** 💰
