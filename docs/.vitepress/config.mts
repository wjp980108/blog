import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "blog",
  lang: 'zh-CN',
  description: "A VitePress Site",
  srcDir: '../pages',
  outDir: '../dist',
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
      { icon: 'x', link: 'https://x.com/Met_you5' },
    ]
  },
  locales: {
    root: {
      label: '简体中文',
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: '示例', link: '/markdown-examples' }
        ],
        sidebar: [
          {
            text: '示例',
            items: [
              { text: 'Markdown 示例', link: '/markdown-examples' },
              { text: 'Runtime API 示例', link: '/api-examples' }
            ]
          }
        ],
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式'
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Examples', link: '/en/markdown-examples' }
        ],
        sidebar: [
          {
            text: 'Examples',
            items: [
              { text: 'Markdown Examples', link: '/en/markdown-examples' },
              { text: 'Runtime API Examples', link: '/en/api-examples' }
            ]
          }
        ]
      }
    },
  },
})
