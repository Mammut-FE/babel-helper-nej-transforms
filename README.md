# babel-helper-nej-transforms

nej babel 插件辅助函数

## API

### nej-code-parser.ts

用于解析使用 nej 规范编写的 JavaScript 文件, 分离其中的依赖信息、nej注入变量信息、函数主体

### transform-this-to-window.ts 

用与处理 nej 源码中 this 变量指向 window 

### transform-return-to-export.ts 

用于将 return 的值通过 export default 导出

### generator-nej-dependencies.ts

将依赖信息转换成 ES6 代码

### generator-nej-injects.ts

将NEJ注入变量转换成 ES6 代码
