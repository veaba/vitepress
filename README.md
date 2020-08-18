# @veaba/vitepress

This Repo clone from [vuejs/vitepress](https://github.com/vuejs/vitepress).

The Repo use to [veaba/vue-docs](https://github.com/veaba/vue-docs).

## docs
  - 更多文档以及使用细节，见 docs下

## feature
Keep feature as vuepress

- TODO support suffix index page {index.md,readme.md,README.md}  official no support yet!
  - `src/client/app/utils.ts:11` 让支持homepage 后缀，更改`index` 为`readme` ，但这样一来原先的`index` 就会失效

## bug

- vitepress 没有在dist 生成index.html 文件
- 首次在windows cnpm 安装报错，需手动安装
>cnpm install --silent --prefer-offline --no-audit --progress=false esbuild-windows-64@0.5.26

```cmd
Install fail! Error: post install error, please remove node_modules before retry!
Run "C:\windows\system32\cmd.exe /d /s /c node install.js" error, exit code 1
```
- 如何外面只需要import 一个声明的stylus 就可以？后续不需要再import 变量文件？

## How dev

-  cnpm run build


## source code read

```text
|-- ./CHANGELOG.md
|-- ./CONTRIBUTING.md                                               
|-- ./LICENSE
|-- ./README.md
|-- ./bin
|   `-- ./bin/vitepress.js                                                          // vitepress 脚手架，用于 npx vitepress 调用
|-- ./package.json
|-- ./scripts                                                          
|   |-- ./scripts/copy.js                                                           // 把`src/client`的文件copy 到`dist/client`
|   `-- ./scripts/watchAndCopy.js                                                   // 在`src/client`中复制和监视非`ts`文件
|-- ./src
|   |-- ./src/client
|   |   |-- ./src/client/app
|   |   |   |-- ./src/client/app/components
|   |   |   |   |-- ./src/client/app/components/Content.ts
|   |   |   |   `-- ./src/client/app/components/Debug.vue
|   |   |   |-- ./src/client/app/composables
|   |   |   |   |-- ./src/client/app/composables/head.ts
|   |   |   |   |-- ./src/client/app/composables/pageData.ts
|   |   |   |   |-- ./src/client/app/composables/preFetch.ts
|   |   |   |   `-- ./src/client/app/composables/siteData.ts
|   |   |   |-- ./src/client/app/exports.ts
|   |   |   |-- ./src/client/app/index.html
|   |   |   |-- ./src/client/app/index.ts
|   |   |   |-- ./src/client/app/router.ts
|   |   |   |-- ./src/client/app/theme.ts
|   |   |   `-- ./src/client/app/utils.ts
|   |   |-- ./src/client/shim.d.ts
|   |   |-- ./src/client/theme-default                                              // 默认主题
|   |   |   |-- ./src/client/theme-default/Layout.vue
|   |   |   |-- ./src/client/theme-default/NotFound.vue
|   |   |   |-- ./src/client/theme-default/components
|   |   |   |   |-- ./src/client/theme-default/components/Home.vue
|   |   |   |   |-- ./src/client/theme-default/components/NavBar.ts
|   |   |   |   |-- ./src/client/theme-default/components/NavBar.vue
|   |   |   |   |-- ./src/client/theme-default/components/Page.vue
|   |   |   |   |-- ./src/client/theme-default/components/SideBar.ts
|   |   |   |   `-- ./src/client/theme-default/components/SideBar.vue
|   |   |   |-- ./src/client/theme-default/composables
|   |   |   |   `-- ./src/client/theme-default/composables/activeSidebarLink.ts     // 激活sidebarLink
|   |   |   |-- ./src/client/theme-default/config.ts
|   |   |   |-- ./src/client/theme-default/index.ts
|   |   |   |-- ./src/client/theme-default/styles
|   |   |   |   |-- ./src/client/theme-default/styles/code.css
|   |   |   |   |-- ./src/client/theme-default/styles/custom-blocks.css
|   |   |   |   |-- ./src/client/theme-default/styles/layout.css
|   |   |   |   `-- ./src/client/theme-default/styles/vars.css
|   |   |   `-- ./src/client/theme-default/utils.ts
|   |   `-- ./src/client/tsconfig.json
|   `-- ./src/node
|       |-- ./src/node/config.ts                                                    // 混合config,以及一些ThemeConfig的接口
|       |-- ./src/node/index.ts                                                     // node服务公共暴露的接口
|       |-- ./src/node/markdown                                                     
|       |   |-- ./src/node/markdown/markdown.ts                                     // 解析markdown 入口
|       |   `-- ./src/node/markdown/plugins
|       |       |-- ./src/node/markdown/plugins/component.ts
|       |       |-- ./src/node/markdown/plugins/containers.ts
|       |       |-- ./src/node/markdown/plugins/header.ts
|       |       |-- ./src/node/markdown/plugins/highlight.ts
|       |       |-- ./src/node/markdown/plugins/highlightLines.ts
|       |       |-- ./src/node/markdown/plugins/hoist.ts
|       |       |-- ./src/node/markdown/plugins/lineNumbers.ts
|       |       |-- ./src/node/markdown/plugins/link.ts
|       |       |-- ./src/node/markdown/plugins/preWrapper.ts
|       |       |-- ./src/node/markdown/plugins/slugify.ts
|       |       `-- ./src/node/markdown/plugins/snippet.ts
|       |-- ./src/node/markdownToVue.ts                                             // markdownToVue
|       |-- ./src/node/resolver.ts                                                  // 分解器
|       |-- ./src/node/server.ts                                                    // 服务
|       |-- ./src/node/tsconfig.json
|       `-- ./src/node/utils
|           `-- ./src/node/utils/parseHeader.ts                                     // 解析header
|-- ./tsconfig.base.json                                                            // 给tsconfig.json继承的
|-- ./types
|   |-- ./types/index.d.ts                                                          // dist以及shared的类型声明
|   `-- ./types/shared.d.ts                                                         // 服务器和客户端之间共享的类型。
|-- ./vitepress.md
`-- ./yarn.lock

```

