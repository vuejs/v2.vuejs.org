---
title: Packaging Vue Components for npm
type: cookbook
order: 10
---

## Base Example

Vue components by nature are meant to be re-used. This is easy when the component is only used within a single application. But how can you write a component once and use it in multiple sites/applications? Perhaps the easiest solution is via npm.

By packaging your component to be shared via npm, it can be imported/required into a build process for use full-fledged web applications:

```js
import MyComponent from 'my-component';

export default {
  name: 'my-app',
  components: {
    MyComponent,
  },
  data() {
    ...
  },
  ...
}
```

Or even used via `<script>` tag in the browser directly:

```html
  <script src="https://unpkg.com/vue"></script>
  <script src="https://unpkg.com/my-component"></script>
  ...
  <my-component></my-component>
  ...
```

Not only does this help you avoid copy/pasting components around, but it also allows you to give back to the Vue community!

## Why Shouldn't I Share .vue Files Directly?

Vue already allows components to be written as a single file. Because a Single File Component (SFC) is already just one file, you might ask:

> "Why can't people use my .vue file directly? Isn't that the simplest way to share components?"

It's true, you could share .vue files directly, and as long as the [Vue build](https://vuejs.org/v2/guide/installation.html#Explanation-of-Different-Builds) being used contains the Vue compiler, that would be enough. But this excludes anyone who wishes to use the component directly in a browser via `<script>` tag, anyone who uses a runtime-only build, or a build process which doesn't understand what to do with .vue files.

By packaging your SFC for distribution via npm, your component can be shared in a way which is ready to use directly in the browser as well as in most build processes!

## Packaging Components for npm

For the purposes of this section, assume the following file structure:

```
package.json
build/
   rollup.config.json
src/
   wrapper.js
   my-component.vue
dist/
```

### How does npm know which version to serve to a browser/build process?

The package.json file used by npm really only requires one version (`main`), but as it turns out, we aren't limited to that. By specifying 2 additional versions (`module` and `unpkg`) we can hit that sweet spot and older build processes, newer ES6 compatible ones, and eve browsers directly! A sample package.json would look like this:

```json
{
  "name": "my-component",
  "version": "1.2.3",
  "main": "dist/my-component.umd.js",
  "module": "dist/my-component.esm.js",
  "unpkg": "dist/my-component.min.js",
  ...
}
```

When webpack 2+, Rollup, or other modern build tools are used, they will pick up on the `module` build. Legacy build tools would use the `main` build, and the `unpkg` build can be used directly in browsers. The [unpkg](https://unpkg.com) cdn automatically uses this when someone enters the URL for your module into their service!

### How do I make multiple versions of my component?

There is no need to write your module multiple times. It is possible to prepare all 3 versions of your module in one step, in a matter of seconds. The example here uses [Rollup](https://rollupjs.org) due to its minimal configuration, but similar configuration is possible with other build tools. The package.json `scripts` section can be updated with a single entry for each build target, and a more generic `build` script that runs them all in one pass. The sample package.json file now looks like this:

```json
{
  "name": "my-component",
  "version": "1.2.3",
  "main": "dist/my-component.umd.js",
  "module": "dist/my-component.esm.js",
  "unpkg": "dist/my-component.min.js",
  "scripts": {
    "build": "npm run build:browser && npm run build:es && npm run build:umd",
    "build:umd": "rollup --config build/rollup.config.js --format umd --file dist/my-component.umd.js",
    "build:es": "rollup --config build/rollup.config.js --format es --file dist/my-component.esm.js",
    "build:browser": "rollup --config build/rollup.config.js --format iife --file dist/my-component.min.js"
  },
  "devDependencies": {
    "rollup": "^0.57.1",
    "rollup-plugin-vue": "^3.0.0",
    "rollup-plugin-buble": "^0.19.2",
    "vue": "^2.5.16",
    "vue-template-compiler": "^2.5.16",
    ...
  },
  ...
}
```

That is all that is required in package.json to get up and running. Now, all that is needed is a small wrapper to export/auto-install the actual SFC, plus a mimimal Rollup configuration, and we're set!

### What does my packaged component look like?

Depending on how your component is being used, it needs to be exposed as either a CommonJS/UMD javascript module, an ES6 javascript module, or in the case of a `<script>` tag, it will be automatically loaded into Vue via `Vue.use(...)` so it's immediately available to the page. This is accomplished by a simple wrapper.js file which handles the module export and auto-install. That wrapper, in its entirety, looks like this:

```js
// Import vue component
import component from './my-component.vue';

// Declare install function executed by Vue.use()
export function install(Vue) {
	if (install.installed) return;
	install.installed = true;
	Vue.component('my-component', component);
}

// Create module definition for Vue.use()
const plugin = {
	install,
};

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null;
if (typeof window !== 'undefined') {
	GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue;
}
if (GlobalVue) {
	GlobalVue.use(plugin);
}

// To allow use as module (npm/webpack/etc.) export component
export default component;
```

Notice the first line directly imports your SFC, and the last line exports it unchanged. As indicated by the comments in the rest of the code, the wrapper provides an `install` function for Vue, then attempts to detect Vue and automatically install the component. With 90% of the work done, it's time to sprint to the finish!

### How do I configure the Rollup build?

With the package.json `scripts` section ready and the SFC wrapper in place, all that is left is to ensure Rollup is properly configured. Fortunately, this can be done with a small 16 line rollup.config.js file:

```js
import vue from 'rollup-plugin-vue'; // Handle .vue SFC files
import buble from 'rollup-plugin-buble'; // Transpile/polyfill with reasonable browser support
export default {
    input: 'build/wrapper.js', // Path relative to package.json
    output: {
        name: 'MyComponent',
        exports: 'named',
    },
    plugins: [
        vue({
            css: true, // Dynamically inject css as a <style> tag
            compileTemplate: true, // Explicitly convert template to render function
        }),
        buble(), // Transpile to ES5
    ],
};
```

This sample config file contains the minimum settings to package your SFC for npm. There is room for customization, such as extracting CSS to a separate file, using a CSS preprocessor, uglifying the JS output, etc.

Also, it is worth noting the `name` given the component here. This is a PascalCase name that the component will be given, and should correspond with the kebab-case name used elsewhere throughout this recipe.

### Will this replace my current development process?

The configuration here is not meant to replace the development process that you currently use. If you currently have a webpack setup with hot module reloading (HMR), keep using it! If you're starting from scratch, feel free to install [Vue CLI 3](https://github.com/vuejs/vue-cli/), which will give you the whole HMR experience config free:

```bash
vue serve --open src/my-component.vue
```

In other words, do all of your development in whatever way you are comfortable. The things outlined in this recipe are more like 'finishing touches' than a full dev process.

## When to Avoid this Pattern

Packaging SFCs in this manner might not be a good idea in certain scenarios. This recipe doesn't go into detail on how the components themselves are written. Some components might provide side effects like directives, or extend other libraries with additional functionality. In those cases, you will need to evaluate whether or not the changes required to this recipe are too extensive.

In addition, pay attention to any dependencies that your SFC might have. For example, if you require a third party library for sorting or communication with an API, Rollup might roll those packages into the final code if not properly configured. To continue using this recipe, you would need to configure Rollup to exclude those files from the output, then update your documentation to inform your users about these dependencies.

## Alternative Patterns

At the time this recipe was written, Vue CLI 3 was itself in beta. This version of the CLI comes with a built-in `library` build mode, which creates CommonJS and UMD versions of a component. This might be adequate for your use cases, though you will still need to make sure your package.json file points to `main` and `unpkg` properly. Also, there will be no ES6 `module` output unless that capability is added to the CLI before its release or via plugin.

The process here is the result of what was learned looking at other vue modules which have already been published by the greater vue community. The reason for the recipe was because there was a lack of well documented patterns for preparing a component for npm.

## Acknowledgements

This recipe is the result of a lightning talk given by [Mike Dodge](https://twitter.com/mgdodgeycode) at VueConf.us in March 2018. He has published a utility to npm which will quickly scaffold a sample SFC using this recipe. You can download the utility, [vue-sfc-rollup](https://www.npmjs.com/package/vue-sfc-rollup), from npm. You can also [clone the repo](https://github.com/mgdodge/vue-sfc-rollup) and customize it to fill your needs.