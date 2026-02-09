# 快速部署指南 - Vercel部署（3种方法）

## 方法1：通过Vercel Dashboard（推荐，最简单）

### 步骤：
1. 访问 https://vercel.com/new
2. 点击 "Add New Project"
3. 导入GitHub仓库：`git@github.com:goldct/api-monitor-saas.git`
4. 配置项目：
   - **Project Name**: `api-monitor`（或自定义）
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: 留空（或输入 `cd client && npm run build`）
   - **Output Directory**: `client/dist`
5. 点击 "Deploy"
6. 等待部署完成（2-3分钟）
7. 获得生产URL：`https://api-monitor.vercel.app`

### 环境变量（可选）
点击 "Settings" -> "Environment Variables"，添加：
- `NODE_ENV`: `production`

---

## 方法2：使用Vercel CLI（需要登录）

### 步骤：
1. 安装Vercel CLI（如果未安装）：
   ```bash
   npm i -g vercel
   ```

2. 登录Vercel：
   ```bash
   vercel login
   ```
   会打开浏览器，需要授权

3. 部署项目：
   ```bash
   cd /Users/gold/.openclaw/workspace-lan/api-monitor-saas
   vercel --prod
   ```

4. 按照提示完成配置：
   - Project name: `api-monitor`
   - Link to existing project: No

5. 部署完成后，获得生产URL

---

## 方法3：使用Token自动部署（无需交互）

### 步骤：
1. 获取Vercel Token：
   - 访问 https://vercel.com/account/tokens
   - 点击 "Create Token"
   - Token名称：`api-monitor-deploy`
   - Scope：Full Account
   - 点击 "Create"
   - 复制Token（格式：`VERCEL_TOKEN_xxx`）

2. 将Token提供给我，我会执行：
   ```bash
   vercel --token YOUR_TOKEN --prod
   ```

3. 部署完成后，获得生产URL

---

## 部署后验证

### 1. 测试API端点
```bash
# Health check
curl https://your-domain.vercel.app/health

# Get endpoints
curl https://your-domain.vercel.app/api/endpoints
```

### 2. 测试前端
访问 `https://your-domain.vercel.app`，应该看到Dashboard界面

---

## 已完成的准备

✅ 代码已推送到GitHub
✅ vercel.json配置已更新
✅ client/package.json已创建
✅ in-memory存储已就绪
✅ 核心功能已测试

---

## 推荐方法

**方法1（Vercel Dashboard）** - 最简单，5分钟完成

如果你选择方法3，请提供Vercel Token，我会立即为你部署。

---

**准备好部署了吗？选择一种方法吧！** 🚀
