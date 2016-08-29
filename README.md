# vue.js2-rc3 中文翻译文档（正在进行中...） http://vuefe.cn

> 基于 hexo && vuejs.org

- 中文翻译分支 2.0-cn

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

## 当前说明（2016.08.16）

*  翻译到基础篇 /src/guide/components.md  组件 文档 http://vuefe.cn/guide/components.html
*  中英文对照方式: ***~~一段原文(英文) 接一段翻译 接 源码块，英文在前，保持原貌~~***   用中文翻译在一起,英文原文在后的方式进行，方便后面实现左右中英文对照
*  代码中注释直接翻译成中文，不需要留下英文
*  暂且存在目录中英文共存的重复问题，暂时不必修改，就保留中英文目录
*  请尽量对照 vuejs 官方 1.0 中文文档进行翻译，也可以即时看出vue1和vue2直接的区别
*  导航上 添加了 更新 模块，用于链接到github的 release信息，后面希望单独把changelog放到 /changelog中跟进翻译每次的版本更新内容
*  (畅想:加入热点标记功能 - 点击热点新建github 对应 issue ,话题链接 / 增强文档交互即时纠错)
* （畅想: 首页加入弹幕交互功能）
*  (畅想: 添加hacknews-vue2案例解析 以及更多自定义案例解析)
