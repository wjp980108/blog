# Meet you 的个人博客

基于 [VitePress](https://vitepress.dev/) 和 [@sugarat/theme](https://theme.sugarat.top/) 构建的中文个人博客。

## 预览

- 🏠 首页 — 博客文章列表、精选文章推荐
- 📝 技术分享 / 学习笔记
- 🎨 精品文章 / 生活随笔
- 💼 个人作品展示
- 💬 Giscus 评论系统
- 🔍 Algolia 全文搜索

## 技术栈

- **框架：** VitePress + Vue 3
- **博客主题：** @sugarat/theme
- **UI 组件：** Element Plus
- **样式：** Sass
- **代码规范：** ESLint（@antfu/eslint-config）
- **包管理器：** pnpm
- **部署：** GitHub Actions → Windows Server（SCP）

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm serve
```

## 项目结构

```
blog
├── .github
│   └── workflows
│       └── deploy.yml              # GitHub Actions 自动部署配置
├── docs                            # 博客内容根目录（VitePress 入口）
│   ├── .vitepress                  # VitePress 配置目录
│   │   ├── config.mts              # 站点配置（导航、搜索、社交链接等）
│   │   ├── blog-theme.ts           # @sugarat/theme 主题配置（页脚、评论、友链等）
│   │   └── theme                   # 自定义主题
│   │       ├── index.ts            # 主题入口，继承 @sugarat/theme
│   │       ├── style.scss          # 自定义样式覆盖
│   │       ├── user-theme.css      # 用户主题变量
│   │       └── assets              # 主题静态资源
│   │           └── bg.webp         # 背景图片
│   ├── public                      # 公共静态资源（构建时直接复制）
│   │   ├── favicon.ico             # 网站图标
│   │   ├── logo.png                # 网站 Logo
│   │   └── robots.txt              # 搜索引擎爬虫规则
│   ├── index.md                    # 首页
│   ├── about.md                    # 关于我
│   ├── works.md                    # 个人作品展示
│   ├── article                     # 精品文章
│   │   ├── index.md                # 精品文章列表页
│   │   └── element-plus-theme.md   # Element Plus 主题相关文章
│   └── technology                  # 技术笔记
│       ├── share                   # 技术分享
│       │   ├── index.md            # 技术分享列表页
│       │   └── windows-ssh-issue.md
│       └── notes                   # 学习笔记
│           └── index.md            # 学习笔记列表页
├── .gitignore                      # Git 忽略规则
├── .nvmrc                          # Node.js 版本锁定
├── eslint.config.ts                # ESLint 配置（@antfu/eslint-config）
├── package.json                    # 项目依赖与脚本
└── pnpm-lock.yaml                  # pnpm 依赖锁定文件
```
