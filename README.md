# Shopify 应用模板 - Next.js App Router

这是一个用于使用 Next.js 与 TypeScript 构建
[Shopify 应用](https://shopify.dev/apps/getting-started)的模板项目。它包含了用
Next.js 的 App Router 与 Server Components 搭建 Shopify 应用所需的基础能力。

## 功能特性

- **Next.js**：使用最新的 App Router 与 Server Components。
- **Prisma（可选）**：用于管理数据库连接与迁移。
- **TanStack Query**：用于与 Shopify GraphQL API 交互。
- **App Bridge v4**：用于在前端对 API 请求进行鉴权。
- **Shopify API library**：用于在 serverless 后端管理 OAuth。
- **Polaris React**：用于构建高质量、风格一致的商家端界面体验。
- **Tailwind CSS**：用于快速、灵活的样式与设计。
- **Docker（可选）**：用于本地开发时快速启动 Postgres 数据库。
- **Graphql-Codegen**：用于为 GraphQL 查询与 mutation 生成类型。

### 安装模板

你可以使用你偏好的包管理器来安装该模板：

使用 pnpm（推荐）：

```shell
pnpx @shopify/create-app@latest --template https://github.com/liaoyio/shopify-next-app.git
```

该命令会克隆模板并安装所需依赖。

## Next.js 与 Shopify Embedded Apps

本模板的目标是让你可以快速、轻松地启动一个基于 Next.js App Router 平台的
Shopify Embedded App。

模板使用了 App Bridge v4 的一些特性来简化开发，例如鉴权与会话管理。

### Providers

- 在 `layout.tsx` 中，我们设置了一些应用运行所需的 Provider。
  - **ApolloProvider（可选）**：为 GraphQL 查询与 mutation 配置 Apollo 上下文。
    请求通过 Next.js 的 `/api/graphql` 路由转发，并由 Shopify API library 处理。
  - **SessionProvider（可选）**：确保用户始终有一个有效 session，并且应用被正确安装。
    当需要时，它会把用户重定向到鉴权流程。

### App Bridge

我们使用 direct api mode 与新的安装流程（install flow），让应用安装可以自动完成。

```toml
[access.admin]
direct_api_mode = "offline"
embedded_app_direct_api_access = true

[access_scopes]
# 了解更多：https://shopify.dev/docs/apps/tools/cli/configuration#access_scopes
scopes = ""
use_legacy_install_flow = false
```

### Token 交换（Token exchange）

该应用模板默认使用 token exchange。用户在首次页面加载时获取 ID Token，并将其发送到服务端存储。
这一步通过一个 server action 完成。

同时，所有 server action 都应携带 session token；服务端在需要时会对 token 进行校验与交换（exchange）。

### 环境变量

为了运行应用，你需要配置一些环境变量。本仓库的 Next.js 应用位于 `web/` 目录，因此通常使用 `web/.env`。

在 `web/.env` 中加入以下内容：

```bash
DATABASE_URL= # 数据库连接串 - Prisma 用于连接数据库
DIRECT_DATABASE_URL= # 直连数据库连接串 - Prisma 迁移时使用
POSTGRES_PASSWORD= # 可选：本地用 docker 启动 postgres 时使用的数据库密码
```

## 技术栈

该模板组合了多个第三方开源工具：

- [Next.js](https://nextjs.org/) 构建 [React](https://reactjs.org/) 前端。

同时配合以下 Shopify 工具来简化应用开发：

- [Shopify API library](https://github.com/Shopify/shopify-api-js?tab=readme-ov-file)
  用于在 serverless 后端管理 OAuth，让用户可以安装应用并授予 scope 权限。
- [App Bridge React](https://shopify.dev/apps/tools/app-bridge/getting-started/using-react)
  为前端请求添加鉴权，并在 App 的 iFrame 之外渲染组件。
- [Apollo](https://www.apollographql.com/)：用于与 Shopify GraphQL API 交互（可选）。
- [Prisma](https://www.prisma.io/)：用于管理数据库连接与迁移（可选）。
  该模板对数据库类型不做绑定，你可以使用任意你想要的数据库。

## 快速开始


<details>
  <summary>MacOS 安装 PostgreSQL</summary>

1. 安装 postgresql

```shell
brew install postgresql
```

2. 创建数据库并启动

```shell
# 创建 postgresql 数据库
pnpm run pg:create
# 启动
pnpm pg:start
# 停止
pnpm pg:stop
```

3. 运行数据库迁移命令

确保数据库与代码定义保持同步

```shell
pnpm run migrate
```

查看当前应用的 Prisma 是否写入在当前项目根目录的 database/ 下:

```shell
psql "postgresql://liaoyi:123456@localhost:5432/postgres" -c "show data_directory;" -c

# 如果显示如下，则正确
# /Users/liaoyi/next-shopify-app/database
# port = 5432
```

</details>
---

### 本地开发

[Shopify CLI](https://shopify.dev/apps/tools/cli) 会把你的本地项目连接到 Partner Dashboard 中的应用。
它会提供环境变量、并行运行命令，并更新应用的 URL 以便更容易进行本地开发。

你可以使用你偏好的包管理器进行本地开发。


使用 pnpm：

```shell
pnpm run dev-local
```

#### 使用 Docker 进行本地开发

你也可以用 Docker 快速跑起来。它会为你设置并初始化 Postgres 数据库：

```shell
docker-compose up
pnpm run migrate
```

#### Graphql-Codegen

运行下面的命令会为 GraphQL 查询与 mutation 生成类型：

```shell
pnpm run graphql-codegen
```

这会在你使用 Apollo Client 时提供类型支持，并在 IDE 中增强智能提示（IntelliSense）。

## 部署

你可以将该应用部署到你选择的任意托管服务。下面是部署到 Vercel 的基础流程：

- 在 Shopify Partners Dashboard 中创建你的 Shopify 应用
- 在 Vercel 中创建项目，并把 Shopify 应用的环境变量添加进去
  - `SHOPIFY_API_KEY`
  - `SHOPIFY_API_SECRET`
  - `SCOPES`
  - `HOST`
  - 以及任意数据库连接串
- 将你的 Shopify 应用配置为使用与 Vercel 部署一致的路由：
  `/api/auth/callback` 与 `/api/auth`（包含你的部署域名）

Vercel 的构建配置通常使用默认的 Next.js 构建设置即可。

你也应该使用“托管式（managed）”的 Shopify 部署方式，它会处理应用 scope 变更。

```shell
pnpm run deploy
```

### 应用存储（Application Storage）

该模板使用 Prisma 来存储与管理 session。更多 Prisma 配置方式请参考：
[Prisma 文档](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch-typescript-postgres)。

## 开发者资源

- [Shopify 应用介绍](https://shopify.dev/apps/getting-started)
- [应用鉴权](https://shopify.dev/apps/auth)
- [Shopify CLI](https://shopify.dev/apps/tools/cli)
- [Shopify API Library 文档](https://github.com/Shopify/shopify-api-node/tree/main/docs)
