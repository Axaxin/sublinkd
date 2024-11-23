<div align="center">
  <h1>
    <b>Sublink Worker</b>
  </h1>
</div>


<div align="center">
  <h5>
    <i>Serverless 自部署订阅转换工具最佳实践</i>
  </h5>
</div>

<div align="center">
  <href>
    https://sublink-worker.sageer.me
  </href>
</div>


### 手动部署

- 克隆项目仓库：`git clone https://github.com/7Sageer/sublink-worker.git`
- 安装依赖：`npm install`
- 配置 Cloudflare 账户凭证
- 使用 Wrangler 部署：`wrangler deploy`

### Docker 部署

# Sublink Docker

> 基于 Docker 的订阅转换工具，支持多种代理协议和客户端配置生成

## 功能特点

- 支持协议：ShadowSocks, VMess, VLESS, Hysteria2, Trojan, TUIC
- 支持导入 Base64 的 http/https 订阅链接
- Docker 容器化部署，简单易用
- 支持客户端：
  - Sing-Box
  - Clash
  - Xray/V2Ray
- 支持固定/随机短链接生成
- 浅色/深色主题切换
- 灵活的 API，支持脚本化操作
- 用户友好的 Web 界面，灵活的自定义规则
  - 提供多种预定义规则集
  - 可自建关于 geo-site, geo-ip, ip-cidr 和 domain-suffix 的自定义策略组

## 快速开始

### 方式一：使用 Docker Compose（推荐）

1. 克隆项目
```bash
git clone https://github.com/Axaxin/sublinkd.git
cd sublinkd
```

2. 启动服务
```bash
docker-compose up -d
```

服务将在 `http://localhost:3000` 运行。

### 方式二：直接使用 Docker 命令

```bash
docker run -d \
  --name sublinkd \
  -p 3000:3000 \
  -v ./data:/app/data \
  ghcr.io/axaxin/sublinkd:latest
```

### 更新到最新版本

```bash
# 如果使用 docker-compose
docker-compose pull
docker-compose up -d

# 如果直接使用 docker
docker pull ghcr.io/axaxin/sublinkd:latest
docker stop sublinkd
docker rm sublinkd
docker run -d \
  --name sublinkd \
  -p 3000:3000 \
  -v ./data:/app/data \
  ghcr.io/axaxin/sublinkd:latest
```

## API 文档

详细的 API 文档可以在 [API-doc.md](/docs/API-doc.md) 中找到。

主要端点包括：

- `/singbox`：生成 Sing-Box 配置
- `/clash`：生成 Clash 配置
- `/xray`：生成 Xray 配置
- `/shorten`：生成短链接

## 配置说明

- 端口：默认使用 3000 端口，可以通过环境变量 `PORT` 修改
- 数据持久化：数据存储在 `/app/data` 目录，建议挂载到主机目录
- 环境变量：
  - `NODE_ENV`：运行环境，默认 `production`
  - `PORT`：服务端口，默认 3000

## 项目结构

```
.
├── src/                     # 源代码目录
│   ├── index.js            # 主要的服务器逻辑
│   ├── BaseConfigBuilder.js # 构建基础配置
│   ├── SingboxConfigBuilder.js # 构建 Sing-Box 配置
│   ├── ClashConfigBuilder.js   # 构建 Clash 配置
│   └── ...
├── docs/                    # 文档目录
├── Dockerfile              # Docker 构建文件
└── docker-compose.yml      # Docker Compose 配置文件
```

## 最近更新

查看 [更新日志](/docs/update-log.md) 了解详细更新内容。

## 问题反馈

如果你在使用过程中遇到任何问题，或者有新的功能建议，欢迎在 [GitHub Issues](https://github.com/Axaxin/sublinkd/issues) 提出。

## 许可证

本项目采用 MIT 许可证，详见 [LICENSE](LICENSE) 文件。

## API 文档

详细的 API 文档可以在 [API-doc.md](/docs/API-doc.md) 中找到。

主要端点包括：

- `/singbox`：生成 Sing-Box 配置
- `/clash`：生成 Clash 配置
- `/xray`：生成 Xray 配置
- `/shorten`：生成短链接

## 最近更新

- 2024-11-20
  - 修复sing-box配置初次下载过慢的问题

[查看更新日志](/docs/update-log.md)

## 项目结构

```
.
├── index.js                 # 主要的服务器逻辑，处理请求路由
├── BaseConfigBuilder.js     # 构建基础配置
├── SingboxConfigBuilder.js  # 构建 Sing-Box 配置
├── ClashConfigBuilder.js    # 构建 Clash 配置
├── ProxyParsers.js          # 解析各种代理协议的 URL
├── utils.js                 # 提供各种实用函数
├── htmlBuilder.js           # 生成 Web 界面的 HTML
├── config.js                # 保存配置信息
└── docs/
    ├── API-doc.md           # API 文档
    ├── update-log.md        # 更新日志
    └── FAQ.md               # 常见问题解答
```

## 贡献

欢迎提交 Issues 和 Pull Requests 来改进这个项目。

## 许可证

这个项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 免责声明

本项目仅供学习交流使用，请勿用于非法用途。使用本项目所造成的一切后果由使用者自行承担，与开发者无关。

