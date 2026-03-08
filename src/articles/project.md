# 关于

## 技术栈

本项目基于 vue+vite 开发，使用 vue-router 实现单页应用路由

## 项目结构

本项目的目录树基本标准。主要内容放在 `/src`下

特殊地：

### 通用样式： `/src/assist/main.scss`

这里存放着整个页面的基本样式

### 文档正文： `/src/articles`

这个目录是文档正文存放的位置

### 主题： `/src/theme`

这个目录下配置了页面主题

- `hljs.scss`定义了再不同主题下 hljs 的主题
- `theme.scss`定义了不同主题下的颜色等配置
- `theme.ts`定义了不同主题下的切换逻辑
- `icons`定义了不同主题的图标

#### scss中的颜色配置

```scss
color: #ddddff,//文字颜色
background: #031500,//背景
link-color: rgb(90, 90, 255),//链接颜色
link-hover-color: rgb(146, 146, 255),//链接hover的样式
```

#### 主题切换逻辑

配置对象格式：

```typescript
type ThemeConfig = {
  onChangeIn: () => styleTheme;
  onChangeOut?: () => void;
  icon: string;
};
```

theme和styleTheme的区别：

theme是一个逻辑上的主题，styleTheme是一个具体主题的样式。比如 `auto`是一个主题，但是 `auto`的配置必须指明其当前的styleTheme，比如 `light`。

- onChangeIn: 在主题切换进入的时候被调用，返回一个styleTheme的名字
- onChangeOut: 在主题切换退出的时候被调用
- icon: 主题图标

### fontello： `/src/fontello`

这个目录下存放了 fontello 字体、配置等信息。

## 关于 fontello

本项目中的所有图标使用了 fontello 字体。

### 加载字体

加载字体的标准流程放在 `/assist/load-fontello.js`文件中。你可以使用

```bash
npm run load-fontello zip文件路径
```

来完成自动加载

### 图标使用

图标使用时，请引入组件 `/src/components/KIcon.vue`，然后使用组件，

## 组件命名

本项目所有组件使用 K 开头的大驼峰命名法命名，如 `KIcon`, `KArticle`等。使用时，使用连字符命名法如 `k-icon`或 `k-article`

## 主题使用

你可以在任意 scss 文件中使用

```scss
@import '/src/theme/theme.scss';
```

然后使用混合 `useTheme`来包裹跟随主题动态变化的内容，在 `useTheme`中，你可以使用 `getTheme(name)`函数来获取当前主题配置的某个值

e.g.

```scss
@import '/src/theme/theme.scss';

body {
  /*与主题无关的样式*/
  @include useTheme {
    /*与主题有关的样式*/
    color: getTheme('color');
  }
}
```
