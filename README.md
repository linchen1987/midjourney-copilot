# Midjourney 小白理解助手

帮助用户轻松理解和使用 Midjourney 提示词，提高创作效率和灵感。提供详细解释和实用示例，让新手快速上手，享受创作乐趣。

https://mj.uxone.org/

## Develop

#### Install dependencies

```bash
pnpm install
```

#### Prepare Database

1. Create database on vercel
2. Config database params in .env

```bash
cp .env.example .env
```

3. Init database with Drizzle

```bash
pnpm db:migrate
```

#### Prepare Tencent Translator API
1. Register address: https://console.cloud.tencent.com/tmt
2. Config translator params in .env

#### Prepare OpenAI API
1. You need to have an openai api key
2. Config OPENAI_API_KEY params in .env
3. 如果网络访问有问题，尝试在 .env 中配置你的科学上网代理 https_proxy

#### Develop

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Deploy

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
