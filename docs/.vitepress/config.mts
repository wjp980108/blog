import { defineConfig } from 'vitepress';

// 导入主题的配置
import { blogTheme } from './blog-theme';

// 如果使用 GitHub/Gitee Pages 等公共平台部署
// 通常需要修改 base 路径，通常为“/仓库名/”
// 如果项目名已经为 name.github.io 域名，则不需要修改！
// const base = process.env.GITHUB_ACTIONS === 'true'
//   ? '/vitepress-blog-sugar-template/'
//   : '/'

// Vitepress 默认配置
// 详见文档：https://vitepress.dev/reference/site-config
export default defineConfig({
  // 继承博客主题(@sugarat/theme)
  extends: blogTheme,
  // base,
  lang: 'zh-cn',
  title: 'Meet you',
  description: 'Meet you 的个人网站',
  lastUpdated: true,
  // 详见：https://vitepress.dev/zh/reference/site-config#head
  head: [
    // 配置网站的图标（显示在浏览器的 tab 上）
    // ['link', { rel: 'icon', href: `${base}favicon.ico` }], // 修改了 base 这里也需要同步修改
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],
  themeConfig: {
    // 展示 2,3 级标题在目录中
    outline: {
      level: [2, 3],
      label: '目录',
    },
    // 默认文案修改
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '相关文章',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },

    // 设置logo
    logo: '/logo.png',
    // 编辑此页链接
    editLink: {
      pattern: 'https://github.com/wjp980108/blog/tree/main/docs/:path',
      text: '去 GitHub 上编辑内容',
    },
    // 顶部导航栏
    nav: [
      {
        text: '个人作品展示',
        link: '/works',
      },
      {
        text: '技术笔记',
        items: [
          {
            text: '前端',
            link: '/web/',
          },
          {
            text: '后端',
            link: '/backend/',
          },
          {
            text: '运维',
            link: '/ops/',
          },
          {
            text: '其他',
            link: '/other/',
          },
        ],
      },
      {
        text: '生活随笔',
        link: '/life/',
      },
      {
        text: '关于我',
        link: '/about',
      },
    ],
    // 个人社交链接
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/wjp980108',
      },
      {
        icon: 'x',
        link: 'https://x.com/Meet_you98',
      },
      {
        icon: 'youtube',
        link: 'https://www.youtube.com/channel/UCA8mCeWttT_-wCMHVl--gVA',
      },
    ],
    // 搜索配置
    search: {
      provider: 'algolia',
      options: {
        appId: 'LR7EAOYN94',
        apiKey: 'b70086449401ef009432a524557fc061',
        indexName: 'wjp',
        placeholder: '搜索文档',
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            searchBox: {
              resetButtonTitle: '清除查询条件',
              resetButtonAriaLabel: '清除查询条件',
              cancelButtonText: '取消',
              cancelButtonAriaLabel: '取消',
            },
            startScreen: {
              recentSearchesTitle: '搜索历史',
              noRecentSearchesText: '没有搜索历史',
              saveRecentSearchButtonTitle: '保存至搜索历史',
              removeRecentSearchButtonTitle: '从搜索历史中移除',
              favoriteSearchesTitle: '收藏',
              removeFavoriteSearchButtonTitle: '从收藏中移除',
            },
            errorScreen: {
              titleText: '无法获取结果',
              helpText: '你可能需要检查你的网络连接',
            },
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
              searchByText: '搜索提供者',
            },
            noResultsScreen: {
              noResultsText: '无法找到相关结果',
              suggestedQueryText: '你可以尝试查询',
              reportMissingResultsText: '你认为该查询应该有结果？',
              reportMissingResultsLinkText: '点击反馈',
            },
          },
        },
      },
    },
  },
});
