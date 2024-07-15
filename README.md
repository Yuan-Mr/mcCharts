# McCharts 贡献指南

## 简介

Hi! 首先感谢你使用 McCharts。

mcCharts(莓创图表)是McUI提供的一款开箱即用的图表工具库。作为HarmonyOS一款开源的图表组件库，组件库将会提供以下图表：折线图、柱状图、饼图、散点图、雷达图等等。
并提供了配套的设计资源，充分满足可定制化的需求。

如果你愿意为 McCharts 贡献代码或提供建议，请阅读以下内容。感谢大家的支持与付出，让我们一起强化HarmonyOS的社区吧！！！

记得给我们个小星星哦！感谢您的支持

## 官方文档地址

大家可以访问官方文档地址，查看更多详细的使用案例以及相应的参数配置。

[官网地址快速跳转](http://meichuang.org.cn/)

`注意：官网还在完善中，后续会迭代上线`

## 群交流

如果大家有技术上需要交流的相关事项，可以加入群聊，大家一起讨论。

<img src="./crowd.png" width="200">

### `注意：如果群已过期的话，请添加群管理员：Mc-Technology。让其邀请入群`

## Issue 规范

issue 仅用于提交 Bug 或 Feature 以及设计相关的内容，其它内容可能会被直接关闭。如果你在使用时产生了疑问，请到群里咨询。

在提交 issue 之前，请搜索相关内容是否已被提出。

请说明 mcCharts 和 ArkTs 的版本号，并提供对应的开发工具版本号。

## Pull Request 规范

请先 fork 一份到自己的项目下，不要直接在仓库下建分支；
每次提交代码都不需要修改版本号，到时会统一修改。

贡献代码的详细教程可以看看这篇文章：[快速跳转](https://gist.github.com/zxhfighter/62847a087a2a8031fbdf)

commit

信息要以[组件名]: 描述信息的形式填写。

例如：

McLineChart:
1. xxx 功能建设。
2. xxx 功能建设。

McBarChart:
1. xxx 功能建设。
2. xxx 功能建设

提交 PR 前请 rebase，确保 commit 记录的整洁。

确保 PR 是提交到自己对应的 dev 分支，而不是 master 分支。

如果是修复 bug，请在 PR 中给出描述信息。


## 开发环境搭建

首先你需要准备 DevEco Studio 3.1+、OpenHarmony API 9+、ArkTS 3.1+ 等相关版本以上环境。后续等API10出来之后我们在确定是否升级

## 开发目录讲解与开发规范

**讲解一下主要的代码结构分布：**

```
mcCharts
├─ build-profile.json5
├─ entry
│  └─ src
│     ├─ main
│     │  ├─ ets
│     │  │  ├─ components // 组件根目录
│     │  │  │  ├─ index.ets // 图表组件入口
│     │  │  │  └─ mainpage // 组件目录
│     │  │  │     ├─ Chart.ets // 公共图表组件
│     │  │  │     ├─ McBarChart.ets // 柱状图
│     │  │  │     ├─ McLineChart.ets // 折线图
│     │  │  │     ├─ McPieChart.ets // 饼图
│     │  │  │     ├─ McPointChart.ets // 散点图
│     │  │  │     └─ Tooltip.ets // 提示层
│     │  │  ├─ entryability
│     │  │  │  └─ EntryAbility.ts
│     │  │  ├─ pages
│     │  │  │  └─ Index.ets // 组件调试入口
│     │  │  └─ utils // 组件公共方法
│     │  │     ├─ chartInterface.ts // 属性接口
│     │  │     ├─ charts.ts // 图表主类入口
│     │  │     ├─ defaultOption.ts // 图表属性默认值
│     │  │     ├─ drawBar.ts // 渲染柱状图主入口
│     │  │     ├─ drawLine.ts // 渲染折线图主入口
│     │  │     ├─ drawPie.ets // 渲染饼图主入口
│     │  │     ├─ drawPoint.ts // 渲染散点图主入口
│        │     └─ index.ts // 公共方法
│        └─module.json5

```

**开发规范：**

1. 每一个组件代码ets文件都创建components下面。例如：McLineChart.ets。
2. Chart.ets 是每个图表组件的公共组件，按照固定的格式引入传参即可。
3. Index.ets 作为主页面入口，将用于本地调试组件。
4. utils/chartInterface.ts 是定义图表option对象中属性数据类型的接口文件。
5. utils/charts.ts 是图表组件公共类，定义默认属性以及共有方法。
6. utils/defaultOption.ts 是定义图表option对象中属性默认数据
7. utils/drawLine.ts 是渲染对应组件的方法文件，继承主类的公共属性和方法
8. utils/index.ts 存放各种公共的js文件。

开发过程都需要按照规定的规范来开发，否则无法合并相关代码，谢谢合作！！

## 本地运行

拉取代码后，使用DevEco Studio开发工具打开。打开pages/Index.ets页面，点击previewer进行预览或者真机调试。
