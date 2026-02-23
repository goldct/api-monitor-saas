# API Monitor - 投产前检查清单

## 环境变量（Vercel Settings → Environment Variables）

| 变量名 | 必填 | 说明 | 获取方式 |
|--------|------|------|----------|
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | 服务端绕过 RLS 读写数据 | Supabase Dashboard → Settings → API → service_role |
| `SUPABASE_URL` | ✅ | 已写在 vercel.json | - |
| `SUPABASE_ANON_KEY` | ✅ | 已写在 vercel.json | - |
| `STRIPE_SECRET_KEY` | 支付时 | Stripe 私钥 | https://dashboard.stripe.com/apikeys |
| `STRIPE_WEBHOOK_SECRET` | 支付时 | Webhook 签名验证 | Stripe Dashboard → Developers → Webhooks |
| `CRON_SECRET` | 可选 | 保护 /api/cron/check | 自设随机字符串 |

## Stripe 配置（开通支付时）

1. 创建 Webhook：Stripe Dashboard → Developers → Webhooks → Add endpoint
   - URL: `https://api-monitor-clean.vercel.app/api/webhooks/stripe`
   - 事件：`checkout.session.completed`, `customer.subscription.deleted`
2. 复制 Webhook 签名密钥到 `STRIPE_WEBHOOK_SECRET`

## 监控 Cron

- **Vercel Hobby**：当前为每小时执行 (`0 * * * *`)。若需每分钟检查，可使用 [cron-job.org](https://cron-job.org) 免费版，每分钟 GET 你的 `/api/cron/check`，并在 Vercel 设置 `CRON_SECRET` 作为 query 参数保护。
- **Vercel Pro**：可将 `vercel.json` 中 schedule 改为 `* * * * *` 实现每分钟检查。

## 投产前自测

1. [ ] 注册新账号
2. [ ] 登录
3. [ ] 添加 API 端点（验证 Free 3 个限制）
4. [ ] 配置告警（Webhook 类型）
5. [ ] 访问 Pricing，点击 Pro 升级（需配置 Stripe）
6. [ ] 手动调用 `/api/cron/check` 验证监控执行

## 当前部署

- 生产地址：https://api-monitor-clean.vercel.app
- 仓库：https://github.com/goldct/api-monitor-saas
