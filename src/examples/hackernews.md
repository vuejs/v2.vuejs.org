---
title: HackerNews 克隆
type: examples
order: 10
---

> HackerNews 克隆是基于 HN 的官方 firebase API 、Vue 2.0 、vue-router 和 vuex 来构建的，使用服务器端渲染。

{% raw %}
<div style="max-width:600px">
  <a href="https://github.com/vuejs/vue-hackernews-2.0" target="_blank">
    <img style="width:100%" src="/images/hn.png">
  </a>
</div>
{% endraw %}

> [Live Demo](https://vue-hn.now.sh/)
> 笔记：如果没在特定时间段用到它，那么本示例需要一些加载时间。
>
> [[Source](https://github.com/vuejs/vue-hackernews-2.0)]

## 特性

- 服务器端渲染
  - Vue + vue-router + vuex
  - 服务端数据提前获取
  - 客户端状态 & DOM 合并
- 单文件 Vue 组件
  - 开发时进行热加载
  - 生产时抽出 CSS
- 使用 FLIP 动画进行实时列表更新

## 结构概览

<img width="973" alt="Hackernew clone architecture overview" src="/images/hn-architecture.png">
