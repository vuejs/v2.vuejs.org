---
title: Migration to Vue 2.7
type: guide
order: 704
---

Vue 2.7 is the latest minor version of Vue 2. It provides built-in support for the [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html#composition-api-faq).

Despite Vue 3 now being the default version, we understand that there are still many users who have to stay on Vue 2 due to dependency compatibility, browser support requirements, or simply not enough bandwidth to upgrade. In Vue 2.7, we have backported some of the most important features from Vue 3 so that Vue 2 users can benefit from them as well.

## Backported Features

- [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- SFC [`<script setup>`](https://vuejs.org/api/sfc-script-setup.html)
- SFC [CSS v-bind](https://vuejs.org/api/sfc-css-features.html#v-bind-in-css)

In addition, the following APIs are also supported:

- `defineComponent()` with improved type inference (compared to `Vue.extend`)
- `h()`, `useSlot()`, `useAttrs()`, `useCssModules()`
- `set()`, `del()` and `nextTick()` are also provided as named exports in ESM builds.
- The `emits` option is also supported, but only for type-checking purposes (does not affect runtime behavior)

  2.7 also supports using ESNext syntax in template expressions. When using a build system, the compiled template render function will go through the same loaders / plugins configured for normal JavaScript. This means if you have configured Babel for `.js` files, it will also apply to the expressions in your SFC templates.

### Notes on API exposure

- In ESM builds, these APIs are provided as named exports (and named exports only):

  ```js
  import Vue, { ref } from "vue";

  Vue.ref; // undefined, use named export instead
  ```

- In UMD and CJS builds, these APIs are exposed as properties on the global `Vue` object.

- When bundling with CJS builds externalized, bundlers should be able to handle ESM interop when externalizing CJS builds.

### Behavior Differences from Vue 3

The Composition API is backported using Vue 2's getter/setter-based reactivity system to ensure browser compatibility. This means there are some important behavior differences from Vue 3's proxy-based system:

- All [Vue 2 change detection caveats](https://v2.vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats) still apply.

- `reactive()`, `ref()`, and `shallowReactive()` will directly convert original objects instead of creating proxies. This means:

  ```js
  // true in 2.7, false in 3.x
  reactive(foo) === foo;
  ```

- `readonly()` **does** create a separate object, but it won't track newly added properties and does not work on arrays.

- Avoid using arrays as root values in `reactive()` because without property access the array's mutation won't be tracked (this will result in a warning).

- Reactivity APIs ignore properties with symbol keys.

In addition, the following features are explicitly **NOT** ported:

- ❌ `createApp()` (Vue 2 doesn't have isolated app scope)
- ❌ Top-level `await` in `<script setup>` (Vue 2 does not support async component initialization)
- ❌ TypeScript syntax in template expressions (incompatible w/ Vue 2 parser)
- ❌ Reactivity transform (still experimental)
- ❌ `expose` option is not supported for options components (but `defineExpose()` is supported in `<script setup>`).

## Upgrade Guide

### Vue CLI / webpack

1. Upgrade local `@vue/cli-xxx` dependencies the latest version in your major version range (if applicable):

   - `~4.5.18` for v4
   - `~5.0.6` for v5

2. Upgrade `vue` to `^2.7.0`. You can also remove `vue-template-compiler` from the dependencies - it is no longer needed in 2.7.

   Note: if you are using `@vue/test-utils`, you will need to keep `vue-template-compiler` in the dependencies because test utils rely on some APIs only exposed in this package.

3. Check your package manager lockfile to ensure the following dependencies meet the version requirements. They may be transitive dependencies not listed in `package.json`.

   - `vue-loader`: `^15.10.0`
   - `vue-demi`: `^0.13.1`

   If not, you will need to remove `node_modules` and the lockfile and perform a fresh install to ensure they are bumped to the latest version.

4. If you were previously using [`@vue/composition-api`](https://github.com/vuejs/composition-api), update imports from it to `vue` instead. Note that some APIs exported by the plugin, e.g. `createApp`, are not ported in 2.7.

5. Update `eslint-plugin-vue` to latest version (9+) if you run into unused variable lint errors when using `<script setup>`.

6. The SFC compiler for 2.7 now uses PostCSS 8 (upgraded from 7). PostCSS 8 should be backwards compatible with most plugins, but the upgrade **may** cause issues if you were previously using a custom PostCSS plugin that can only work with PostCSS 7. In such cases, you will need to upgrade the relevant plugins to their PostCSS 8 compatible versions.

### Vite

2.7 support for Vite is provided via a new plugin: [@vitejs/plugin-vue2](https://github.com/vitejs/vite-plugin-vue2). This new plugin requires Vue 2.7 or above and supersedes the existing [vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2).

Note that the new plugin does not handle Vue-specific JSX / TSX transform, which is intentional. Vue 2 JSX / TSX transform for Vite is handled in a separate, dedicated plugin: [@vitejs/plugin-vue2-jsx](https://github.com/vitejs/vite-plugin-vue2-jsx).

### Volar Compatibility

2.7 ships improved type definitions so it is no longer necessary to install `@vue/runtime-dom` just for Volar template type inference support. All you need now is the following config in `tsconfig.json`:

```json
{
  // ...
  "vueCompilerOptions": {
    "target": 2.7
  }
}
```

### Devtools Support

Vue Devtools 6.2.0 has added support for inspecting 2.7 Composition API state, but the extensions may still need a few days to go through review on respective publishing platforms.

## Implications of the 2.7 Release

As stated before, 2.7 is the final minor release of Vue 2.x. After this release, Vue 2 has entered LTS (long-term support) which lasts for 18 months from now, and will no longer receive new features.

This means **Vue 2 will reach End of Life on December 31st, 2023**. We believe this should provide plenty of time for most of the ecosystem to migrate over to Vue 3. However, we also understand that there could be teams or projects that cannot upgrade by this timeline while still need to fullfil security and compliance requirements. If your team expects to be using Vue 2 beyond end of 2023, make sure to plan head and understand your options: learn more about [Vue 2 LTS and Extended Support](/lts/).
