---
title: 测试
type: vuex
order: 13
---
我们主要针对Vuex中的mutaions 和actions进行单元测试。

### 测试 Mutations

Mutations 很容易被测试，因为它们仅仅是一些完全依赖参数的函数。小技巧是，如果你在 `store.js` 文件中定义了 mutations，并且使用 ES2015 模块功能默认输出，那么你仍然可以给 mutations 取个变量名然后把它输出去：

``` js
const state = { ... }
//取个变量名并输出mutations
export const mutations = { ... }

export default new Vuex.Store({
  state,
  mutations
})
```

以下为使用 Mocha + chai 测试 mutation 的例子（实际上你可以用任何你喜欢测试框架）

``` js
// mutations.js
export const mutations = {
  increment: state => state.count++
}
```

``` js
// mutations.spec.js
import { expect } from 'chai'
import { mutations } from './store'

// 解构赋值mutations（destructure assign mutations）
const { increment } = mutations

describe('mutations', () => {
  it('INCREMENT', () => {
    // mock state
    const state = { count: 0 }
    // apply mutation
    increment(state)
    // assert result
    expect(state.count).to.equal(1)
  })
})
```

### 测试 Actions


Actions 可能会更加棘手一些，因为他们可能要求请求外部API.

当测试actions时，我们通常需要增加mocking服务层——例如，我们可以把API调用抽象成服务，然后我们在测试中模拟这种服务。为了便于解决mock的依赖关系，可以用 Webpack 和 [inject-loader](https://github.com/plasticine/inject-loader) 打包测试文件。

异步action测试示例：

``` js
// actions.js
import shop from '../api/shop'

export const getAllProducts = ({ dispatch }) => {
  dispatch('REQUEST_PRODUCTS')
  shop.getProducts(products => {
    dispatch('RECEIVE_PRODUCTS', products)
  })
}
```

``` js
// actions.spec.js
// 使用 require 语法处理内联loaders
//inject-loader,返回一个模块工厂
//让我们能够注入mocked的依赖关系。
import { expect } from 'chai'
const actionsInjector = require('inject!./actions')

//使用mocks创建模块
const actions = actionsInjector({
  '../api/shop': {
    getProducts (cb) {
      setTimeout(() => {
        cb([ /* mocked response */ ])
      }, 100)
    }
  }
})

//用指定的mutatios测试action的辅助函数
const testAction = (action, args, state, expectedMutations, done) => {
  let count = 0

  // mock 提交
  const commit = (type, payload) => {
    const mutation = expectedMutations[count]
    expect(mutation.type).to.equal(type)
    if (payload) {
      expect(mutation.payload).to.deep.equal(payload)
    }
    count++
    if (count >= expectedMutations.length) {
      done()
    }
  }

  // 用模拟的 store 和参数调用 action
  action({ commit, state }, ...args)

  // 检查是否没有 mutation 被 dispatch
  if (expectedMutations.length === 0) {
    expect(count).to.equal(0)
    done()
  }
}

describe('actions', () => {
  it('getAllProducts', done => {
    testAction(actions.getAllProducts, [], {}, [
      { type: 'REQUEST_PRODUCTS' },
      { type: 'RECEIVE_PRODUCTS', payload: { /* mocked response */ } }
    ], done)
  })
})
```

### 测试 Getters

如果你的getters方法很复杂，那么你得测试他们。测试Getter 方法和测试mutations一样非常简单！

测试getter实例：

``` js
// getters.js
export const getters = {
  filteredProducts (state, { filterCategory }) {
    return state.products.filter(product => {
      return product.category === filterCategory
    })
  }
}
```

``` js
// getters.spec.js
import { expect } from 'chai'
import { getters } from './getters'

describe('getters', () => {
  it('filteredProducts', () => {
    // mock 状态
    const state = {
      products: [
        { id: 1, title: 'Apple', category: 'fruit' },
        { id: 2, title: 'Orange', category: 'fruit' },
        { id: 3, title: 'Carrot', category: 'vegetable' }
      ]
    }
    // mock getter
    const filterCategory = 'fruit'

    // 从getter中取回值
    const result = getters.filteredProducts(state, { filterCategory })

    // 声明返回值
    expect(result).to.deep.equal([
      { id: 1, title: 'Apple', category: 'fruit' },
      { id: 2, title: 'Orange', category: 'fruit' }
    ])
  })
})
```

### 运行测试

如果你的 mutations 和 actions 已经正确，后面应该在适合的mocking上浏览器测试API的依赖关系。

#### 在Node上运行

创建下面的webpack配置（加上适合[`.babelrc`](https://babeljs.io/docs/usage/babelrc/)）：


``` js
// webpack.config.js
module.exports = {
  entry: './test.js',
  output: {
    path: __dirname,
    filename: 'test-bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  }
}
```

然后:

``` bash
webpack
mocha test-bundle.js
```

#### 在浏览器上运行

1. 安装 `mocha-loader`
2. 把上述 webpack 配置中的 entry 改成 'mocha!babel!./test.js'
3. 用以上配置启动 `webpack-dev-server` 
4. 访问 `localhost:8080/webpack-dev-server/test-bundle`.

#### 使用Karma + karma-webpack在浏览器中测试

详细的安装咨询见[vue-loader documentation](http://vue-loader.vuejs.org/en/workflow/testing.html).
