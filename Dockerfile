# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 只复制 package 文件
COPY package*.json ./

# 安装依赖（使用 npm install 代替 npm ci，因为没有 package-lock.json）
RUN npm install --production

# 复制源代码
COPY . .

# 最终阶段
FROM node:18-alpine

WORKDIR /app

# 创建存储目录并设置权限
RUN mkdir -p /app/data && chown -R node:node /app

# 从构建阶段复制必要文件
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 设置用户
USER node

# 暴露端口
EXPOSE 3000

# 启动服务
CMD ["node", "src/server.js"]
