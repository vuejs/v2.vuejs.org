# vue.js 2.0 中文翻译文档（即将完成 - 急需校对人员） http://vuefe.cn

> 求小伙伴共同翻译，有兴趣加qq 315129552
> 目前急需校对人员

- 中文翻译分支 2.0-cn

## Guide 翻译进度

### Essentials  基础

序号 | 是否完成  | 对应文档文件名 | 中文标题  | 贡献者 | 认领者
----- | ------- | ------------- | --- | --- | ---
1 | 是 |  installation.md | 安装 | @dingyiming | @dingyiming
2 | 是 | index.md |  介绍 | @hijiangtao   | @dingyiming @hijiangtao
3 | 是 | instance.md | 实例 |  @dingyiming | @dingyiming
4 | 是 | syntax.md  | 模板语法 | @daix6  | @tingtien @daix6
5 | 是 | computed.md | 计算属 性 |  @dingyiming | @dingyiming
6 | 是 | class-and-style.md | Class 与 Style 绑定 | @595074187  | @595074187
7 | 是 |  conditional.md  | 条件渲染 | @dingyiming | @dingyiming
8 | 是 | list.md |  列表渲染 | @tingtien | @tingtien
9 | 是 | events.md | 事件处理器 | @dingyiming | @dingyiming
10 | 是 |  forms.md  | 表单控件绑定 | @dingyiming | @dingyiming
11 | 是 | components.md |  组件 | @ezreally  | @ezreally

### Advanced  进阶

序号 | 是否完成  | 对应文档文件名 | 中文标题 | 贡献者 | 认领者
----- | ------- | ------------- | --- | --- | ---
12 | 是 | transitions.md | 过渡: 进入, 离开, 和 列表 | @awe | @awe
13 | 是 | transitioning-state.md | 过渡状态 |  @awe | @awe
14 | 是 | render-function.md |  Render 函数 |  @awe | @awe
15 | x | reactivity.md |  深入响应式原理 |  | @veaba
16 | 是 | custom-directive.md |  自定义指令 | @harrytospring | @harrytospring
17 | 是 | mixins.md |  混合 |  @harrytospring | @harrytospring
18 | x | plugins.md |  插件 |  | @hgcoder
19 | 是 | single-file-components.md |  单文件组件 | @ATLgo  | @ATLgo 
20 | 是 | routing.md | 路由 | @dingyiming | @dingyiming
21 | 是 | state-management.md |  状态管理 | @dear-lizhihua | @dear-lizhihua
22 | 是 | unit-testing.md | 单元测试 | @70data  | @70data
23 | 是 | ssr.md |  服务端渲染 | @dingyiming | @dingyiming

### Migration  迁移

序号 | 是否完成  | 对应文档文件名 | 中文标题 | 贡献者 | 认领者
----- | ------- | ------------- | --- | --- | ---
24 | 是  | migration.md | 1.x迁移 |  @harrytospring   | @harrytospring 
27 | 是 | migration-vue-router.md | vue-router 0.7.x 迁移 | @forzajuve10  | @forzajuve10 

### Meta  更多

序号 | 是否完成  | 对应文档文件名 | 中文标题 | 贡献者 | 认领者
----- | ------- | ------------- | --- | --- | ---
25 | 是 |  comparison.md |   对比其他框架 |  @yongbolv | @yongbolv @daix6
26 | 是 |  join.md |  加入Vue.js社区 | @daix6   | @daix6 


## API 翻译

### 关于 API 翻译说明

- 文中多次使用的几个词，请大家保持一致的翻译，参考了 `vue1.x` 翻译
  - `Type`  => 类型
  - `See also` => 另见
  - `Details` => 详细
  - `Options`  => 选项
  - `Example` => 示例
  - `Restriction` => 限制
  - `default` => 默认值
  - `Props` => 特性
  -  `prop` => 特性 （在 `props` 是指 一个 API 时候，不要翻译成中文）
![image](https://cloud.githubusercontent.com/assets/12537013/19184185/85c11e0e-8cae-11e6-9c86-25907a65e8b4.png)

- 冒号 使用中文输入法下的，之前如有问题的，可以修改下。
 
> 以下小节均在 `src/api/index.md` 一个文档中

## API翻译进度

序号 | 是否完成  | 对应小节名称 | 中文标题  | 贡献者 | 认领者
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

## 开发

```
$ npm install -g hexo-cli
$ npm install
$ hexo server
```

Start a dev server at `localhost:4000`

## merge

- 翻译完 pull request 到 2.0-cn 分支 合并

## 发布

> 预先添加git ssh

```
hexo g
hexo d
```