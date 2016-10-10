---
title: 安装
type: vuex
order: 1
---

### 直接下载 / CDN

[https://unpkg.com/vuex](https://unpkg.com/vuex)

[Unpkg.com](https://unpkg.com) 提供基于 NPM 的 CDN 链接。以上链接总是保持在 NPM 上的最新版本。你也可以通过类似于这样的 URL `https://unpkg.com/vuex@2.0.0` 使用特殊的 版本/标签。

在包含 Vue 之后包含 `vuex`，它会自动安装：

``` html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vuex.js"></script>
```

### NPM

``` bash
npm install vuex
```

当配合模块系统一起使用时，你必须通过 `Vue.use()` 显式安装到路由上：

``` js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

当你使用全局脚本标签时不需要这样做。

### 使用开发版

你如果想使用最新的开发版，请直接去 GitHub 克隆，然后构建你自己的 `vuex`。

``` bash
git clone https://github.com/vuejs/vuex.git node_modules/vuex
cd node_modules/vuex
npm install
npm run build
```
