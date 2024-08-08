// eslint.config.js
import antfu from '@antfu/eslint-config';

export default antfu({}, {
  rules: {
    // 强制使用分号结尾
    'style/semi': ['error', 'always'],
  },
  ignores: ['!/.vuepress'],
});
