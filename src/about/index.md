---
title: 参与指南
type: about
order: 0
---

> 目前急需人员校对翻译

## 参与要求

### 参与：

- 加群参与 `42744737` 
- [发布网址：vuefe.cn](http://vuefe.cn/)
- [翻译仓库](https://github.com/vuefe/vuejs.org) ，中文翻译分支 2.0-cn
- [基础指引](https://github.com/vuefe/vuejs.org/wiki/%E5%85%B3%E4%BA%8E%E7%BF%BB%E8%AF%91---%E5%9F%BA%E7%A1%80%E6%8C%87%E5%BC%95)
- 参与API翻译：https://github.com/vuefe/vuejs.org/issues/44
- 参与Guide校对：https://github.com/vuefe/vuejs.org/issues/77
- 提出建议：https://github.com/vuefe/vuejs.org/issues/48
- 如果你看到错别字、漏译、错译，请直接提交 pr
    （[帮助](https://help.github.com/articles/using-pull-requests/)）。
- 如果你看到网站问题，或者创建一个 issue，或者直接提交 pr。
- 如果你对已有翻译有异议，建议创建一个 issue 讨论。
- 如果你想修改英文内容，请去 [vuejs.org 项目][vuejs.org]。
- 如果你想求教 Vue.js 使用问题，请去[论坛][forum]。
- 如果你遇到 Vue.js 的问题，请去 [vue 项目][vue]，
    创建 issue 并提供演示。可以在 JSBin, JSFiddle, Codepen 等网站创建演示。

### 翻译要求

- 保持一致，清晰
-  汉字，字母，数字等之间以一个空格隔开。
-  中文使用中文符号，英文使用英文符号。
- 专有词注意大小写，如 HTML，CSS，JavaScript。
- 术语与已有译文保持一致，如果有异议请先在 issue 中讨论。
- 代码只翻译注释。
- 标题会转化为链接，文档其它地方可能会用到，所以标题应尽量简短，
    在修改标题时搜索一下它是否还用在其它地方。
    同样的，在修改文档内链接时也应搜索一下。
- 校对后对应修改提交合并请求

### 统一固定词汇翻译

- Type => 类型
- See also => 另见
- Details => 详细
- Options => 选项
- Example => 示例
- Restriction => 限制
- default => 默认值
- prop => 特性（是指 一个 API 时候，不要翻译成中文）
- attribute => 特性
- transition => 过渡

### 术语翻译对照

- attribute 特性
- transition 过渡

### 不翻译的术语

- getter
- setter
- prop（指API时）

### 认领说明

- 参与前，请在对应issue认领
- 认领格式 ：
  - 未完成
     - [ ] 我校对 + `文档序号 `

- markdown语法 - 示例

```markdown
- [ ] 我xx `1`
```

  - 完成后，打钩表示完成，并附带 发起的合并请求链接
     - [x] 我校对 + `文档序号 ` +  https://github.com/vuefe/vuejs.org/pull/65  (发起的合并请求链接)

- markdown语法 - 示例

```markdown
- [x] 我xx + `1 ` https://github.com/vuefe/vuejs.org/pull/65  (发起的合并请求链接)
```

- 支持多人协作翻译，冲突可以解决，认领过的，如果你觉着他太慢，可以再次认领，加速翻译，知道大家都是牺牲业余时间来贡献，所以慢也是可以理解的，慢就需要大家一起帮帮忙了！谢谢。


## Guide 翻译贡献

### Essentials  基础

序号 | 是否完成  | 对应文档文件名 | 中文标题  | 翻译贡献者 | 校对贡献者
----- | ------- | ------------- | --- | --- | --- | ---
1 | 是 |  installation.md | 安装 | [dingyiming](https://github.com/dingyiming) | 
2 | 是 | index.md |  介绍 | [hijiangtao](https://github.com/hijiangtao) | 
3 | 是 | instance.md | 实例 |  [dingyiming](https://github.com/dingyiming) |
4 | 是 | syntax.md  | 模板语法 | [daix6](https://github.com/daix6) | 
5 | 是 | computed.md | 计算属 性 |  [dingyiming](https://github.com/dingyiming) | 
6 | 是 | class-and-style.md | Class 与 Style 绑定 | [595074187](https://github.com/595074187) | 
7 | 是 |  conditional.md  | 条件渲染 | [dingyiming](https://github.com/dingyiming) | 
8 | 是 | list.md |  列表渲染 | [tingtien](https://github.com/tingtien) | 
9 | 是 | events.md | 事件处理器 | [dingyiming](https://github.com/dingyiming) | 
10 | 是 |  forms.md  | 表单控件绑定 | [dingyiming](https://github.com/dingyiming) | 
11 | 是 | components.md |  组件 | [ezreally](https://github.com/ezreally) | 

### Advanced  进阶

序号 | 是否完成  | 对应文档文件名 | 中文标题 | 贡献者 | 校对贡献者
----- | ------- | ------------- | --- | --- | --- 
12 | 是 | transitions.md | 过渡: 进入, 离开, 和 列表 | [awe](https://github.com/hilongjw) | 
13 | 是 | transitioning-state.md | 过渡状态 |  [awe](https://github.com/hilongjw) | 
14 | 是 | render-function.md |  Render 函数 |  [awe](https://github.com/hilongjw) | 
15 | 是 | reactivity.md |  深入响应式原理 | [veaba](https://github.com/veaba) | 
16 | 是 | custom-directive.md |  自定义指令 | [harrytospring](https://github.com/harrytospring) | 
17 | 是 | mixins.md |  混合 |  [harrytospring](https://github.com/harrytospring) | 
18 | 是 | plugins.md |  插件 | [hgcoder](https://github.com/hgcoder) | 
19 | 是 | single-file-components.md |  单文件组件 | [ATLgo](https://github.com/ATLgo) | 
20 | 是 | routing.md | 路由 | [dingyiming](https://github.com/dingyiming) | 
21 | 是 | state-management.md |  状态管理 | [dear-lizhihua](https://github.com/dear-lizhihua) | 
22 | 是 | unit-testing.md | 单元测试 | [70data](https://github.com/70data) |
23 | 是 | ssr.md |  服务端渲染 | [dingyiming](https://github.com/dingyiming) | 　

### Migration  迁移

序号 | 是否完成  | 对应文档文件名 | 中文标题 | 贡献者 | 校对贡献者
----- | ------- | ------------- | --- | --- | --- 
24 | 是  | migration.md | 1.x迁移 |  [harrytospring](https://github.com/harrytospring) | 
27 | 是 | migration-vue-router.md | vue-router 0.7.x 迁移 | [forzajuve10](https://github.com/forzajuve10) | 

### Meta  更多

序号 | 是否完成  | 对应文档文件名 | 中文标题 | 贡献者 | 校对贡献者
----- | ------- | ------------- | --- | --- | --- | ---
25 | 是 |  comparison.md |   对比其他框架 |  [yongbolv](https://github.com/yongbolv) | 
26 | 是 |  join.md |  加入Vue.js社区 | [daix6](https://github.com/daix6) | 

## API 翻译

### API翻译贡献

序号 | 是否完成  | 对应小节名称 | 中文标题  | 贡献者
----- | ------- | ------------- | --- | --- | ---
1 | 是 |  Global Config | 全局配置 |  @dear-lizhihua |  @dear-lizhihua
2 | 是 | Global API | 全局API | @dear-lizhihua | @dear-lizhihua
3 | 是 | Options / Data | 选项 / 数据 | @dear-lizhihua | @dear-lizhihua
4 | 是 | Options / DOM | 选项 / DOM | @ATLgo | @ATLgo 
5 | 是 | Options / Lifecycle Hooks | 选项 / 生命周期钩子 | @ATLgo |  @ATLgo 
6 | 是 | Options / Assets | 选项 / 资源 | @dingyiming | @dingyiming
7 | x | Options / Misc | 选项 / 杂项 |  |  @dingyiming
8 | 是 | Instance Properties | 实例属性 | @coolzjy | @coolzjy
9 | x | Instance Methods / Data | 实例方法 / 数据 | | @dingyiming
10 | x | Instance Methods / Events | 实例方法 / 事件 |  | @mlyknown
11 | x |  Instance Methods / Lifecycle | 实例方法 / 生命周期 | | @mlyknown
12 | x | Directives | 指令|  |  @tingtien 
13 | 是 | Special Attributes | 特殊元素 | @70data | @70data
14 | x | Built-In Components | 内置的组件  | | @dear-lizhihua
15 | 是 | VNode Interface | VNode接口  | @70data | @70data
16 | 是 | Server-Side Rendering | 服务端渲染| @70data | @70data

## 示例翻译

贡献者 ： [lindazhang102](https://github.com/lindazhang102)


## 感谢所有参与翻译的朋友们！