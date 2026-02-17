# Vercel部署指南

> **预计时间**: 5分钟
> **成本**: $0
> **结果**: 获得生产URL

---

## 📋 前置条件

✅ 代码已推送到GitHub: `https://github.com/goldct/api-monitor-saas`
✅ 前端已构建完成
✅ vercel.json配置已就绪

---

## 🚀 部署步骤

### 步骤1: 连接GitHub到Vercel (2分钟)

1. 访问 https://vercel.com/signup
2. 选择 "Continue with GitHub"
3. 授权Vercel访问你的GitHub仓库

### 步骤2: 导入项目 (1分钟)

1. 点击 "Add New..." → "Project"
2. 在 "Import Git Repository" 中选择 `api-monitor-saas`
3. 点击 "Import"

### 步骤3: 配置项目 (1分钟)

**Framework Preset**: 选择 "Other"

**Build Command**:
```
npm run build
```

**Output Directory**:
```
client/dist
```

**Install Command**:
```
npm install
```

**Environment Variables** (可选):
```
NODE_ENV=production
ANON_API_TOKEN=test-token-for-deploy-2025032
```

点击 "Deploy"

### 步骤4: 等待部署 (1分钟)

Vercel会自动：
1. 安装依赖
2. 构建前端
3. 部署到CDN
4. 生成生产URL

---

## ✅ 验证部署

部署完成后，你会得到一个URL：
```
https://api-monitor-saas.vercel.app
```

**测试步骤**:
1. 访问主页
2. 测试健康检查: `https://api-monitor-saas.vercel.app/health`
3. 测试API: `https://api-monitor-saas.vercel.app/api/endpoints/demo`

---

## 🎯 生产环境配置

### 1. 自定义域名 (可选)

在Vercel项目设置中：
1. 点击 "Domains"
2. 添加自定义域名
3. 配置DNS记录

### 2. 环境变量 (可选)

在项目设置中添加：
- `ANON_API_TOKEN`: 你的API密钥
- `NODE_ENV`: production

### 3. 生产监控

Vercel提供：
- 实时日志
- 性能分析
- 错误追踪
- 部署历史

---

## 📊 部署后检查清单

- [ ] 主页加载正常
- [ ] Dashboard显示正常
- [ ] 添加端点功能正常
- [ ] 告警功能正常
- [ ] 定价页面显示正常

---

## 🔧 故障排除

### 问题1: 部署失败
**检查**:
- package.json中的build命令是否正确
- vercel.json配置是否正确
- 所有依赖是否在package.json中

### 问题2: API路由404
**检查**:
- vercel.json中的rewrites配置
- server.js中的路由定义

### 问题3: 前端无法访问后端
**检查**:
- CORS配置
- API路径是否正确

---

## 🎉 完成！

现在你的API Monitor SaaS已经上线！

**下一步**:
1. 测试所有功能
2. 准备Product Hunt发布
3. 开始推广

---

**创建时间**: 2026-02-18
**作者**: 盈盈 💰
**目标**: 5分钟上线，开始赚钱！
