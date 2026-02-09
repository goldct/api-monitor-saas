#!/bin/bash

# API Monitor SaaS - 快速启动脚本

echo "🚀 API Monitor SaaS - 启动脚本"
echo "================================"
echo ""

# 启动后端
echo "📊 启动后端服务器..."
cd "$(dirname "$0")"
node server.js > backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ 后端已启动 (PID: $BACKEND_PID)"
echo "   日志: backend.log"
echo "   URL: http://localhost:3000"
echo ""

# 等待后端启动
echo "⏳ 等待后端启动..."
sleep 3
echo ""

# 启动前端
echo "🎨 启动前端开发服务器..."
cd client
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ 前端已启动 (PID: $FRONTEND_PID)"
echo "   日志: frontend.log"
echo "   URL: http://localhost:5173"
echo ""

# 等待前端启动
echo "⏳ 等待前端启动..."
sleep 5
echo ""

# 测试服务
echo "🧪 测试服务..."
echo ""

echo "测试后端健康检查..."
BACKEND_STATUS=$(curl -s http://localhost:3000/health | grep -o '"success":[^,]*' | grep -o 'true\|false')
if [ "$BACKEND_STATUS" = "true" ]; then
    echo "✅ 后端运行正常"
else
    echo "❌ 后端测试失败"
fi
echo ""

echo "测试前端访问..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ 前端运行正常"
else
    echo "⚠️  前端可能还在启动中"
fi
echo ""

echo "================================"
echo "🎉 启动完成！"
echo "================================"
echo ""
echo "📱 访问应用:"
echo "   前端: http://localhost:5173"
echo "   后端: http://localhost:3000"
echo ""
echo "📚 API文档:"
echo "   GET  /health"
echo "   GET  /api/endpoints/:userId"
echo "   POST /api/endpoints"
echo "   DELETE /api/endpoints/:id"
echo "   GET  /monitor/stats/:userId"
echo "   POST /alert"
echo ""
echo "🛑 停止服务:"
echo "   kill $BACKEND_PID  # 停止后端"
echo "   kill $FRONTEND_PID  # 停止前端"
echo ""
echo "📝 查看日志:"
echo "   tail -f backend.log   # 查看后端日志"
echo "   tail -f frontend.log  # 查看前端日志"
echo ""
