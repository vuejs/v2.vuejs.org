---
title: Render Functions & JSX
type: guide
order: 303
---

## 기본

Vue는 템플릿을 사용하여 대다수의 경우 HTML을 작성할 것을 권장합니다. 그러나 JavaScript가 완전히 필요한 상황이 있습니다. 바로 여기에서 템플릿에 더 가까운 컴파일러인 **render 함수**를 사용할 수 있습니다.

`render` 함수가 실용적 일 수있는 간단한 예제를 살펴 보겠습니다. 링크를 포함한 헤더를 생성한다고 가정한 예제 입니다.

``` html
<h1>
  <a name="hello-world" href="#hello-world">
    Hello world!
  </a>
</h1>
```

위의 HTML의 경우 이 컴포넌트 인터페이스가 필요하다고 결정합니다.

``` html
<anchored-heading :level="1">Hello world!</anchored-heading>
```

`level` prop를 기반으로 방금 제목을 생성하는 컴포넌트를 이용하면 다음과 같이 빠르게 만들 수 있습니다.

``` html
<script type="text/x-template" id="anchored-heading-template">
  <h1 v-if="level === 1">
    <slot></slot>
  </h1>
  <h2 v-else-if="level === 2">
    <slot></slot>
  </h2>
  <h3 v-else-if="level === 3">
    <slot></slot>
  </h3>
  <h4 v-else-if="level === 4">
    <slot></slot>
  </h4>
  <h5 v-else-if="level === 5">
    <slot></slot>
  </h5>
  <h6 v-else-if="level === 6">
    <slot></slot>
  </h6>
</script>
```

``` js
Vue.component('anchored-heading', {
  template: '#anchored-heading-template',
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

이 템플릿은 별로 좋지 않습니다. 이것은 장황할 뿐만 아니라 모든 헤딩 수준에 대해 `<slot> </slot>`을 중복으로 가지고 있으며 앵커 엘리먼트를 추가 할 때도 똑같이 해야합니다.

템플릿은 대부분의 컴포넌트에서 훌륭하게 작동하지만 분명하지는 않습니다. 이제 `render` 함수로 다시 작성해 봅니다.

``` js
Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // 태그 이름
      this.$slots.default // 자식의 배열
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

훨씬 간단 합니다! 이 코드는 더 짧지만 Vue 인스턴스 속성에 더 익숙해야합니다. 이 경우 `anchored-heading` 안에 `Hello world!`와 같이 `slot` 속성 없이 자식을 패스 할 때 그 자식들은 `$slots.default` 에있는 컴포넌트 인스턴스에 저장된다는 것을 알아야합니다. 아직 구현하지 않았다면 **render 함수로 들어가기 전에 [instance properties API](../api/#vm-slots)를 읽는 것이 좋습니다.**

## 노드, 트리, 그리고 버추얼 DOM

렌더 함수를 알아보기 전에 브라우저 작동 방식을 알아야합니다. 아래 HTML 예제를 보세요

```html
<div>
  <h1>My title</h1>
  Some text content
  <!-- TODO: Add tagline  -->
</div>
```

브라우저가 이 코드를 읽게 되면, 모든 내용을 추적하기 위해 가계도처럼 ["DOM 노드" 트리](https://javascript.info/dom-nodes)를 만듭니다.

위 HTML의 DOM 노드 트리는 아래와 같습니다.

![DOM Tree Visualization](/images/dom-tree.png)

모든 엘리먼트는 노드입니다. 각 텍스트도 노드입니다. 심지어 주석도 노드입니다! 노드는 페이지를 이루는 각각의 조각입니다. 그리고 트리에서 보듯 각 노드는 자식을 가질 수 있습니다. (즉, 각 조각들은 다른 조각들을 포함할 수 있습니다.)

노드를 효율적으로 갱신하는 것은 어렵지만 수동으로 할 필요는 없습니다. 템플릿에서 Vue가 페이지에서 수정하기 원하는 HTML만 지정하면 됩니다.

```html
<h1>{{ blogTitle }}</h1>
```

또는 렌더 함수에서

``` js
render: function (createElement) {
  return createElement('h1', this.blogTitle)
}
```

두가지 경우 모두 Vue는 페이지를 자동으로 갱신합니다. `blogTitle`의 변경 또한 마찬가지입니다.

### 버추얼 DOM

Vue는 실제 DOM에 필요한 변경사항을 추적하기 위해 **virtual DOM**을 만듭니다. 이를 자세히 살펴보면 아래와 같습니다.

``` js
return createElement('h1', this.blogTitle)
```

`createElement`는 실제로 무엇을 반환할까요? 실제 DOM 엘리먼트와 _정확하게_ 일치하지는 않습니다. Vue에게 자식노드에 대한 설명을 포함하여 페이지에서 렌더링해야하는 노드의 종류를 설명하는 정보를 포함하기 때문에 더 정확하게 `createNodeDescription`이라는 이름을 지정할 수 있습니다. 이 노드에 관한 설명을 **VNode**로 축약된 가상 노드라고 부릅니다. "버추얼 DOM"은 Vue 컴포넌트 트리로 만들어진 VNode 트리입니다.

## `createElement` 전달인자

다음으로 살펴볼 것은 `createElement` 함수에서 템플릿 기능을 사용하는 방법입니다. 다음은 `createElement`가 받아들이는 전달인자입니다.

``` js
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // HTML 태그 이름, 컴포넌트 옵션 또는 함수 중
  // 하나를 반환하는 함수입니다. 필수 사항.
  'div',

  // {Object}
  // 템플릿에서 사용할 속성에 해당하는 데이터 객체입니다
  // 데이터 객체입니다. 선택 사항.
  {
    // (아래 다음 섹션에 자세히 설명되어 있습니다.)
  },

  // {String | Array}
  // VNode 자식들. `createElement()`를 사용해 만들거나,
  // 간단히 문자열을 사용해 'text VNodes'를 얻을 수 있습니다. 선택사항
  [
    'Some text comes first.',
    createElement('h1', 'A headline'),
    createElement(MyComponent, {
      props: {
        someProp: 'foobar'
      }
    })
  ]
)
```

### 데이터 객체 깊이 알아 보기

한가지 주의 해야 할 점은 `v-bind:class` 와 `v-bind:style`이 템플릿에서 특별한 처리를 하는 것과 비슷하게, VNode 데이터 객체에 최상위 필드가 있습니다. 이 객체는`innerHTML`과 같은 DOM 속성뿐 아니라 일반적인 HTML 속성도 바인딩 할 수 있게 합니다.(이것은`v-html` 디렉티브를 대신해 사용할 수 있습니다.)

``` js
{
  // `v-bind:class` 와 같음
  'class': {
    foo: true,
    bar: false
  },
  // `v-bind:style` 와 같음
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // 일반 HTML 속성
  attrs: {
    id: 'foo'
  },
  // 컴포넌트 props
  props: {
    myProp: 'bar'
  },
  // DOM 속성
  domProps: {
    innerHTML: 'baz'
  },
  // `v-on:keyup.enter`와 같은 수식어가 지원되지 않으나
  // 이벤트 핸들러는 `on` 아래에 중첩됩니다.
  // 수동으로 핸들러에서 keyCode를 확인해야 합니다.
  on: {
    click: this.clickHandler
  },
  // 컴포넌트 전용.
  // `vm.$emit`를 사용하여 컴포넌트에서 발생하는 이벤트가 아닌
  // 기본 이벤트를 받을 수 있게 합니다.
  nativeOn: {
    click: this.nativeClickHandler
  },
  // 사용자 지정 디렉티브.
  // Vue는 이를 관리하기 때문에 바인딩의 oldValue는 설정할 수 없습니다.
  directives: [
    {
      name: 'my-custom-directive',
      value: '2',
      expression: '1 + 1',
      arg: 'foo',
      modifiers: {
        bar: true
      }
    }
  ],
  // 범위 지정 슬롯. 형식은
  // { name: props => VNode | Array<VNode> } 입니다.
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // 이 컴포넌트가 다른 컴포넌트의 자식인 경우, 슬롯의 이름입니다.
  slot: 'name-of-slot',
  // 기타 최고 레벨 속성
  key: 'myKey',
  ref: 'myRef'
}
```

### 전체 예제

이 지식과 함께 이제 컴포넌트를 마칠 수 있습니다.

``` js
var getChildrenTextContent = function (children) {
  return children.map(function (node) {
    return node.children
      ? getChildrenTextContent(node.children)
      : node.text
  }).join('')
}

Vue.component('anchored-heading', {
  render: function (createElement) {
    // kebabCase id를 만듭니다.
    var headingId = getChildrenTextContent(this.$slots.default)
      .toLowerCase()
      .replace(/\W+/g, '-')
      .replace(/(^\-|\-$)/g, '')

    return createElement(
      'h' + this.level,
      [
        createElement('a', {
          attrs: {
            name: headingId,
            href: '#' + headingId
          }
        }, this.$slots.default)
      ]
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

### 제약사항

#### VNodes는 고유해야 합니다

컴포넌트 트리의 모든 VNode는 고유 해야 합니다. 아래 예제는 다음 렌더링 함수가 유효하지 않음을 의미합니다.

``` js
render: function (createElement) {
  var myParagraphVNode = createElement('p', 'hi')
  return createElement('div', [
    // 이런 - Vnode가 중복입니다!
    myParagraphVNode, myParagraphVNode
  ])
}
```

같은 엘리먼트 / 컴포넌트를 여러 번 복제하려는 경우 팩토리 기능을 사용하여 여러 번 반복 할 수 있습니다. 예를 들어, 다음 렌더링 함수는 20개의 같은 p태그를 완벽하게 렌더링하는 방법입니다.

``` js
render: function (createElement) {
  return createElement('div',
    Array.apply(null, { length: 20 }).map(function () {
      return createElement('p', 'hi')
    })
  )
}
```

## 템플릿 기능을 일반 JavaScript로 변경하기

### `v-if` 와 `v-for`

일반 JavaScript를 사용할 수 있는 환경이면 어디든지 Vue 렌더링 함수는 한가지 방법만을 제공하지는 않습니다. 예를 들어,`v-if`와`v-for`를 사용하는 템플릿에서 :

``` html
<ul v-if="items.length">
  <li v-for="item in items">{{ item.name }}</li>
</ul>
<p v-else>No items found.</p>
```

이것은 render 함수에서 `if` /`else` 와 `map`을 사용하여 재 작성 될 수 있습니다.

``` js
render: function (createElement) {
  if (this.items.length) {
    return createElement('ul', this.items.map(function (item) {
      return createElement('li', item.name)
    }))
  } else {
    return createElement('p', 'No items found.')
  }
}
```

### `v-model`

렌더 함수에는 직접적으로 `v-model`에 대응되는 것이 없습니다. 직접 구현해야합니다.

``` js
render: function (createElement) {
  var self = this
  return createElement('input', {
    domProps: {
      value: self.value
    },
    on: {
      input: function (event) {
        self.value = event.target.value
        self.$emit('input', event.target.value)
      }
    }
  })
}
```

이것은 더 깊은 수준으로 건드려야 하지만 `v-model`에 비해 상호 작용에 대한 세부 사항을 훨씬 더 많이 제어 할 수 있습니다.

### 이벤트 및 키 수식어

`.passive`, `.capture` 및 `.once` 이벤트 수식어를 위해 Vue는 `on`과 함께 사용할 수있는 접두사를 제공합니다

| 수식어| 접두어 |
| ------ | ------ |
| `.passive` | `&` |
| `.capture` | `!` |
| `.once` | `~` |
| `.capture.once` 또는<br>`.once.capture` | `~!` |

예제

```javascript
on: {
  '!click': this.doThisInCapturingMode,
  '~keyup': this.doThisOnce,
  `~!mouseover`: this.doThisOnceInCapturingMode
}
```

다른 모든 이벤트 및 키 수식어의 경우 처리기에서 이벤트 메서드를 간단하게 사용할 수 있으므로 고유한 접두사는 필요하지 않습니다.

| 수식어 | 동등한 핸들러 |
| ------ | ------ |
| `.stop` | `event.stopPropagation()` |
| `.prevent` | `event.preventDefault()` |
| `.self` | `if (event.target !== event.currentTarget) return` |
| 키:<br>`.enter`, `.13` | `if (event.keyCode !== 13) return` (`13`을 다른 키 수식어의 [다른 키 코드](http://keycode.info/)로 변경합니다.) |
| Modifiers Keys:<br>`.ctrl`, `.alt`, `.shift`, `.meta` | `if (!event.ctrlKey) return` (`ctrlKey`를 `altKey`, `shiftKey` 또는 `metaKey`로 각각 변경하십시오.) |

다음은 위의 수식어들이 사용된 예제 입니다.

```javascript
on: {
  keyup: function (event) {
    // 이벤트를 내보내는 요소가 이벤트가 바인딩 된 요소가 아닌 경우
    // 중단합니다.
    if (event.target !== event.currentTarget) return
    // 키보드에서 뗀 키가 Enter키 (13)이 아니며
    // Shift키가 동시에 눌러지지 않은 경우
    // 중단합니다.
    if (!event.shiftKey || event.keyCode !== 13) return
    // 전파를 멈춥니다.
    event.stopPropagation()
    // 엘리먼트 기본 동작을 방지합니다.
    event.preventDefault()
    // ...
  }
}
```

### Slots

[`this.$slots`](../api/#vm-slots)에서 정적 슬롯 내용을  VNodes의 배열로 접근할 수 있습니다.

``` js
render: function (createElement) {
  // `<div><slot></slot></div>`
  return createElement('div', this.$slots.default)
}
```

또한 특정 범위를 가지는 슬롯 [`this.$scopedSlots`](../api/#vm-scopedSlots)에서 VNode를 반환하는 함수로 접근할 수 있습니다.

``` js
render: function (createElement) {
  // `<div><slot :text="msg"></slot></div>`
  return createElement('div', [
    this.$scopedSlots.default({
      text: this.msg
    })
  ])
}
```

범위 함수 슬롯을 렌더링 함수를 사용하여 하위 컴포넌트로 전달하려면 VNode 데이터에서 `scopedSlots` 필드를 사용하십시오.

``` js
render (createElement) {
  return createElement('div', [
    createElement('child', {
      // 데이터 객체의 `scopedSlots`를 다음 형식으로 전달합니다
      // { name: props => VNode | Array<VNode> }
      scopedSlots: {
        default: function (props) {
          return createElement('span', props.text)
        }
      }
    })
  ])
}
```

## JSX

`render` 함수를 많이 작성하면 다음과 같이 작성하는 것이 고통스럽게 느껴질 수 있습니다.

``` js
createElement(
  'anchored-heading', {
    props: {
      level: 1
    }
  }, [
    createElement('span', 'Hello'),
    ' world!'
  ]
)
```

템플릿 버전이 아래 처럼 너무 간단한 경우에 특히 더 그럴 것 입니다.

``` html
<anchored-heading :level="1">
  <span>Hello</span> world!
</anchored-heading>
```

그래서 Vue와 JSX를 함께 사용하기 위해 [Babel plugin](https://github.com/vuejs/babel-plugin-transform-vue-jsx)를 이용할 수 있습니다.

``` js
import AnchoredHeading from './AnchoredHeading.vue'

new Vue({
  el: '#demo',
  render (h) {
    return (
      <AnchoredHeading level={1}>
        <span>Hello</span> world!
      </AnchoredHeading>
    )
  }
})
```

<p class="tip">`createElement`를 별칭 `h`로 이용하는 것은 Vue 생태계에서 볼 수 있는 공통된 관습이며 실제로 JSX에 필요합니다. 사용하는 범위에서 `h`를 사용할 수 없다면, 앱은 오류를 발생시킵니다.</p>

JSX가 JavaScript에 매핑되는 방법에 대한 [자세한 내용](https://github.com/vuejs/babel-plugin-transform-vue-jsx#usage)을 확인하세요.

## 함수형 컴포넌트

앞에 작성한 anchor를 가지는 heading 컴포넌트는 비교적 간단합니다. 어떤 상태도 없고 전달된 상태를 감시하며 라이프사이클 관련 메소드도 없습니다. 실제로 단지 props를 가지는 기능일 뿐입니다.

이와 같은 경우, 컴포넌트를 `함수형 또는 기능적`으로 표시할 수 있습니다. 즉, 컴포넌트가 상태가 없고(`data` 없음) 인스턴스 화 되지 않은 경우(`this` 컨텍스트가 없음)를 말합니다. **함수형 컴포넌트** 는 다음과 같습니다.

``` js
Vue.component('my-component', {
  functional: true,
  // 인스턴스의 부족함을 보완하기 위해
  // 이제 2번째에 컨텍스트 인수가 제공됩니다.
  render: function (createElement, context) {
    // ...
  },
  // Props는 선택사항입니다.
  props: {
    // ...
  }
})
```

> 주의 : 2.3.0 이전 버전에서, 함수형 컴포넌트에서 props을 받아들이려면 `props` 옵션이 필요합니다. 2.3.0 이상에서는 `props` 옵션을 생략할 수 있으며, 컴포넌트 노드에서 발견된 모든 속성은 암시적으로 props으로 추출됩니다.

2.5.0+ 이후로, [싱글 파일 컴포넌트](single-file-components.html)를 사용하는 경우, 템플릿 기반의 함수형 컴포넌트를 정의할 수 있습니다.

``` js
<template functional>
</template>
```

`context`를 통해 컴포넌트에서 필요한 모든 것이 전달 됩니다. 이 객체는 다음을 포함합니다.

- `props`: 전달받은 props에 대한 객체
- `children`: VNode 자식의 배열
- `slots`: 슬롯 객체를 반환하는 함수
- `data`: 컴포넌트에 전달된 전체 데이터 객체
- `parent`: 상위 컴포넌트에 대한 참조
- `listeners`: (2.3.0+) 부모에게 등록된 이벤트 리스너를 가진 객체입니다. `data.on`의 알리아스입니다.
- `injections`: (2.3.0+) [`inject`](../api/#provide-inject) 옵션을 사용하면 리졸브드 인젝션을 가집니다

`functional:true`를 추가한 후 anchor를 가지는 heading 컴포넌트의 렌더 함수를 업데이트 하는 것은 단순히 `context` 전달인자를 추가하고 `this.$slots.default`를 `context.children`으로 갱신한 다음 `this.level`을 `context.props.level`로 갱신하면 됩니다.

함수형 컴포넌트는 단지 함수일 뿐이므로 렌더링에 들어가는 비용이 적습니다. 그러나  [Vue 크롬 개발자 도구](https://github.com/vuejs/vue-devtools)의 컴포넌트 트리에서 함수형 컴포넌트를 볼 수 없습니다.

또한 래퍼 컴포넌트로도 매우 유용합니다. 예를 들어,



``` js
var EmptyList = { /* ... */ }
var TableList = { /* ... */ }
var OrderedList = { /* ... */ }
var UnorderedList = { /* ... */ }

Vue.component('smart-list', {
  functional: true,
  render: function (createElement, context) {
    function appropriateListComponent () {
      var items = context.props.items

      if (items.length === 0)           return EmptyList
      if (typeof items[0] === 'object') return TableList
      if (context.props.isOrdered)      return OrderedList

      return UnorderedList
    }

    return createElement(
      appropriateListComponent(),
      context.data,
      context.children
    )
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    isOrdered: Boolean
  }
})
```

### `slots()` vs `children`

왜 `slots()`와 `children`을 모두 사용 해야 하는지 궁금할 수 있습니다. `slots().default`는 `children`과 같지 않나요? 어떤 경우에는 그렇습니다. 그러나 다음 자식들과 함께 함수형 컴포넌트를 가지고 있다면 어떻게 될까요?

``` html
<my-functional-component>
  <p slot="foo">
    first
  </p>
  <p>second</p>
</my-functional-component>
```

이 컴포넌트의 경우 `children`은 두개의 단락을 제공할 것이고 `slots().default`는 오직 두번째 단락을 반환합니다. 따라서 `children`과 `slots()`을 모두 사용하면 컴포넌트가 슬롯 시스템에 대해 알고 있는지 또는 단순하게 `children`을 전달하여 다른 컴포넌트에 책임을 위임할 지 선택할 수 있습니다.

## 템플릿 컴파일

Vue의 템플릿이 실제로 함수를 렌더링 하기 위해 컴파일 되는 것을 알고 싶을 것입니다. 이는 일반적으로 알 필요가 없는 내부 구현 사항이지만 특정 템플릿 기능을 컴파일 하는 방법을 보고 싶다면 흥미로울 수 있습니다. 다음은 `Vue.compile`을 사용해 템플릿 문자열을 실시간 컴파일 하는데 사용되는 데모 입니다.

{% raw %}
<div id="vue-compile-demo" class="demo">
  <textarea v-model="templateText" rows="10"></textarea>
  <div v-if="typeof result === 'object'">
    <label>render:</label>
    <pre><code>{{ result.render }}</code></pre>
    <label>staticRenderFns:</label>
    <pre v-for="(fn, index) in result.staticRenderFns"><code>_m({{ index }}): {{ fn }}</code></pre>
    <pre v-if="!result.staticRenderFns.length"><code>{{ result.staticRenderFns }}</code></pre>
  </div>
  <div v-else>
    <label>Compilation Error:</label>
    <pre><code>{{ result }}</code></pre>
  </div>
</div>
<script>
new Vue({
  el: '#vue-compile-demo',
  data: {
    templateText: '\
<div>\n\
  <header>\n\
    <h1>I\'m a template!</h1>\n\
  </header>\n\
  <p v-if="message">\n\
    {{ message }}\n\
  </p>\n\
  <p v-else>\n\
    No message.\n\
  </p>\n\
</div>\
    ',
  },
  computed: {
    result: function () {
      if (!this.templateText) {
        return 'Enter a valid template above'
      }
      try {
        var result = Vue.compile(this.templateText.replace(/\s{2,}/g, ''))
        return {
          render: this.formatFunction(result.render),
          staticRenderFns: result.staticRenderFns.map(this.formatFunction)
        }
      } catch (error) {
        return error.message
      }
    }
  },
  methods: {
    formatFunction: function (fn) {
      return fn.toString().replace(/(\{\n)(\S)/, '$1  $2')
    }
  }
})
console.error = function (error) {
  throw new Error(error)
}
</script>
<style>
#vue-compile-demo {
  -webkit-user-select: inherit;
  user-select: inherit;
}
#vue-compile-demo pre {
  padding: 10px;
  overflow-x: auto;
}
#vue-compile-demo code {
  white-space: pre;
  padding: 0
}
#vue-compile-demo textarea {
  width: 100%;
  font-family: monospace;
}
</style>
{% endraw %}
