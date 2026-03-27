// eslint.config.js
import antfu from '@antfu/eslint-config';

export default antfu({
  stylistic: {
    // 结尾使用分号
    semi: true,
  },
  ignores: ['!/.vuepress']
});
