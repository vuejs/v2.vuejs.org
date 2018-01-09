---
title: 진입/진출 그리고 리스트 트랜지션
type: guide
order: 201
---

## 개요

Vue는 항목이 DOM에 삽입, 갱신 또는 제거 될 때 트랜지션 효과를 적용하는 다양한 방법을 제공합니다. 여기에는 다음과 같은 도구가 포함됩니다.

- CSS 트랜지션 및 애니메이션을 위한 클래스를 자동으로 적용합니다.
- Animate.css와 같은 타사 CSS 애니메이션 라이브러리 통합
- 트랜지션 훅 중에 JavaScript를 사용하여 DOM을 직접 조작
- Velocity.js와 같은 써드파티 JavaScript 애니메이션 라이브러리 통합

이 페이지에서는 진입, 진출 및 목록 트랜지션만 다루지만 다음 섹션에서는 [트랜지션 상태 관리](transitioning-state.html)를 볼 수 있습니다.

## 단일 엘리먼트 / 컴포넌트 트랜지션

Vue는 `트랜지션` 래퍼 컴포넌트를 제공하므로 다음과 같은 상황에서 모든 엘리먼트 또는 컴포넌트에 대한 진입 / 진출 트랜지션을 추가 할 수 있습니다.

- 조건부 렌더링 (`v-if` 사용)
- 조건부 출력 (`v-show` 사용)
- 동적 컴포넌트
- 컴포넌트 루트 노드

다음 매우 간단한 예제를 보겠습니다.

``` html
<div id="demo">
  <button v-on:click="show = !show">
    Toggle
  </button>
  <transition name="fade">
    <p v-if="show">hello</p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#demo',
  data: {
    show: true
  }
})
```

``` css
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
```

{% raw %}
<div id="demo">
  <button v-on:click="show = !show">
    Toggle
  </button>
  <transition name="demo-transition">
    <p v-if="show">hello</p>
  </transition>
</div>
<script>
new Vue({
  el: '#demo',
  data: {
    show: true
  }
})
</script>
<style>
.demo-transition-enter-active, .demo-transition-leave-active {
  transition: opacity .5s
}
.demo-transition-enter, .demo-transition-leave-to {
  opacity: 0
}
</style>
{% endraw %}

`transition` 컴포넌트로 싸여진 엘리먼트가 삽입되거나 제거 될 때 일어납니다:

1. Vue는 대상 엘리먼트에 CSS 트랜지션 또는 애니메이션이 적용되었는지 여부를 자동으로 감지합니다. 그렇다면 CSS 트랜지션 클래스가 적절한 타이밍에 추가 / 제거됩니다.

2. 트랜지션 컴포넌트가 [JavaScript 훅](#JavaScript-Hooks)를 제공하면 이러한 훅은 적절한 타이밍에 호출됩니다.

3. CSS 트랜지션 / 애니메이션이 감지되지 않고 JavaScript 훅이 제공 되지 않으면 삽입 또는 제거를 위한 DOM 작업이 다음 프레임에서 즉시 실행됩니다 (참고: 이는 Vue의 `nextTick` 개념과는 다른 브라우저 애니메이션 프레임입니다).

### 트랜지션 클래스

진입 / 진출 트랜지션에는 네가지 클래스가 적용됩니다.

1. `v-enter`: enter의 시작 상태. 엘리먼트가 삽입되기 전에 적용되고 한 프레임 후에 제거됩니다.

2. `v-enter-active`: enter에 대한 활성 및 종료 상태. 엘리먼트가 삽입되기 전에 적용됩니다. 트랜지션 / 애니메이션이 완료되면 제거됩니다.

3. `v-enter-to`: **2.1.8 이상 버전에서 지원합니다.** 진입 상태의 끝에서 실행됩니다. 엘리먼트가 삽입된 후 (동시에 `v-leave`가 제거됨), 트랜지션/애니메이션이 끝나면 제거되는 하나의 프레임을 추가했습니다.

4. `v-leave`: leave를 위한 시작 상태. 진출 트랜지션이 트리거 될 때 적용되고 한 프레임 후에 제거됩니다.

5. `v-leave-active`: leave에 대한 활성 및 종료 상태. 진출 트랜지션이 트리거되면 적용되고 트랜지션 / 애니메이션이 완료되면 제거됩니다.

6. `v-leave-to`: **2.1.8 이상 버전에서 지원합니다.** 진출 상태의 끝에서 실행됩니다. 진출 트랜지션이 트리거되고 (동시에 `v-leave`가 제거됨), 트랜지션/애니메이션이 끝나면 제거되는 하나의 프레임을 추가했습니다.


![Transition Diagram](/images/transition.png)

각 클래스에는 트랜지션 이름이 접두어로 붙습니다. 여기서`v-`접두어는 이름없이 `<transition>` 엘리먼트를 사용할 때의 기본값입니다. 예를 들어`<transition name = "my-transition">`을 사용하면`v-enter` 클래스는 `my-transition-enter` 가 됩니다.

`v-enter-active` 와`v-leave-active` 는 입/출력 트랜지션을 위한 다른 easing curve를 지정할 수있는 기능을 제공합니다. 다음 섹션에서 그 예를 보실 수 있습니다.

### CSS 트랜지션

가장 일반적인 트랜지션 유형 중 하나는 CSS 트랜지션을 사용합니다. 다음은 간단한 예입니다.

``` html
<div id="example-1">
  <button @click="show = !show">
    Toggle render
  </button>
  <transition name="slide-fade">
    <p v-if="show">hello</p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#example-1',
  data: {
    show: true
  }
})
```

``` css
/* 애니메이션 진입 및 진출은 다른 지속 시간 및  */
/* 타이밍 기능을 사용할 수 있습니다. */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
```

{% raw %}
<div id="example-1" class="demo">
  <button @click="show = !show">
    Toggle render
  </button>
  <transition name="slide-fade">
    <p v-if="show">hello</p>
  </transition>
</div>
<script>
new Vue({
  el: '#example-1',
  data: {
    show: true
  }
})
</script>
<style>
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
{% endraw %}

### CSS 애니메이션

CSS 애니메이션은 CSS 트랜지션과 같은 방식으로 적용됩니다. 차이점은 요소가 삽입 된 직후에`v-enter`가 제거되지 않지만 `animationend` 이벤트에 있습니다.

다음은 간결함을 위해 접두사가 붙은 CSS 규칙을 생략 한 예입니다.

``` html
<div id="example-2">
  <button @click="show = !show">Toggle show</button>
  <transition name="bounce">
    <p v-if="show">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis enim libero, at lacinia diam fermentum id. Pellentesque habitant morbi tristique senectus et netus.</p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#example-2',
  data: {
    show: true
  }
})
```

``` css
.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
```

{% raw %}
<div id="example-2" class="demo">
  <button @click="show = !show">Toggle show</button>
  <transition name="bounce">
    <p v-show="show">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis enim libero, at lacinia diam fermentum id. Pellentesque habitant morbi tristique senectus et netus.</p>
  </transition>
</div>

<style>
  .bounce-enter-active {
    -webkit-animation: bounce-in .5s;
    animation: bounce-in .5s;
  }
  .bounce-leave-active {
    -webkit-animation: bounce-in .5s reverse;
    animation: bounce-in .5s reverse;
  }
  @keyframes bounce-in {
    0% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    50% {
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
  @-webkit-keyframes bounce-in {
    0% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    50% {
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
</style>
<script>
new Vue({
  el: '#example-2',
  data: {
    show: true
  }
})
</script>
{% endraw %}

### 사용자 지정 트랜지션 클래스

다음 속성을 제공하여 사용자 정의 트랜지션 클래스를 지정할 수도 있습니다.

- `enter-class`
- `enter-active-class`
- `enter-to-class` (2.1.8+)
- `leave-class`
- `leave-active-class`
- `leave-to-class` (2.1.8+)

이것들은 원본 클래스 명을 오버라이드 합니다. 이는 Vue의 트랜지션 시스템을 [Animate.css](https://daneden.github.io/animate.css/)와 같은 기존 CSS 애니메이션 라이브러리와 결합하려는 경우 특히 유용합니다.

예제 입니다.

``` html
<link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">

<div id="example-3">
  <button @click="show = !show">
    Toggle render
  </button>
  <transition
    name="custom-classes-transition"
    enter-active-class="animated tada"
    leave-active-class="animated bounceOutRight"
  >
    <p v-if="show">hello</p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#example-3',
  data: {
    show: true
  }
})
```

{% raw %}
<link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">
<div id="example-3" class="demo">
  <button @click="show = !show">
    Toggle render
  </button>
  <transition
    name="custom-classes-transition"
    enter-active-class="animated tada"
    leave-active-class="animated bounceOutRight"
  >
    <p v-if="show">hello</p>
  </transition>
</div>
<script>
new Vue({
  el: '#example-3',
  data: {
    show: true
  }
})
</script>
{% endraw %}

### 트랜지션과 애니메이션을 함께 사용하기

Vue는 트랜지션이 종료 된 시점을 알기 위해 이벤트 리스너를 연결해야합니다. 적용된 CSS 규칙의 유형에 따라 `transitionend` 또는 `animationend` 가 될 수 있습니다. 둘 중 하나만 사용하는 경우 Vue는 올바른 유형을 자동으로 감지 할 수 있습니다.

그러나 어떤 경우에는 같은 엘리먼트 (예: Vue에 의해 트리거 된 CSS 애니메이션)와 함께 호버에 대한 CSS 트랜지션 효과를 둘 다 가질 수도 있습니다. 이러한 경우,`type` 속성에서 Vue가 지켜 볼 타입을 명시적으로 선언해야 합니다. 값은 `animation` 또는 `transition` 입니다.

### 명시적 트랜지션 지속 시간

> 2.2.0 버전에서 추가됨

대부분의 경우 Vue는 트랜지션이 완료를 자동으로 감지할 수 있습니다. 기본적으로 Vue는 루트 트랜지션 엘리먼트에서 첫 번째 `transitionend` 또는 `animationend` 이벤트를 기다립니다. 그러나 이것은 항상 이상적인 것은 아닙니다. 예를 들어, 중첩 된 내부 엘리먼트가 루트 트랜지션 엘리먼트보다 지연된 트랜지션 또는 더 긴 트랜지션 기간을 갖는 다른 엘리먼트와 함께 진행하는 트랜지션 시퀀스를 가질 수 있습니다.

이 경우, `<transition>` 컴포넌트에 `duration` 속성을 사용하여 명시적인 트랜지션 지속 시간(밀리 초)을 지정할 수 있습니다.

``` html
<transition :duration="1000">...</transition>
```

진입과 진출 기간에도 명시적인 값을 지정할 수 있습니다.

``` html
<transition :duration="{ enter: 500, leave: 800 }">...</transition>
```

### JavaScript 훅

속성에서 JavaScript 훅을 정의할 수 있습니다.

``` html
<transition
  v-on:before-enter="beforeEnter"
  v-on:enter="enter"
  v-on:after-enter="afterEnter"
  v-on:enter-cancelled="enterCancelled"

  v-on:before-leave="beforeLeave"
  v-on:leave="leave"
  v-on:after-leave="afterLeave"
  v-on:leave-cancelled="leaveCancelled"
>
  <!-- ... -->
</transition>
```

``` js
// ...
methods: {
  // --------
  // 진입
  // --------

  beforeEnter: function (el) {
    // ...
  },
  // done 콜백은 CSS와 함께 사용할 때 선택 사항입니다.
  enter: function (el, done) {
    // ...
    done()
  },
  afterEnter: function (el) {
    // ...
  },
  enterCancelled: function (el) {
    // ...
  },

  // --------
  // 진출
  // --------

  beforeLeave: function (el) {
    // ...
  },
  // done 콜백은 CSS와 함께 사용할 때 선택 사항입니다.
  leave: function (el, done) {
    // ...
    done()
  },
  afterLeave: function (el) {
    // ...
  },
  // leaveCancelled은 v-show와 함께 사용됩니다.
  leaveCancelled: function (el) {
    // ...
  }
}
```

이러한 훅은 CSS 트랜지션 / 애니메이션 또는 자체적으로 사용할 수 있습니다.

<p class="tip">JavaScript 전용 트랜지션을 하는 경우 `enter` 및 `leave` 훅에서  **`done` 콜백이  필요합니다.** 그렇지 않으면 동기적으로 호출되고 트랜지션 즉시 완료됩니다.</p>

<p class="tip">Vue가 CSS 탐지를 건너 뛸 수 있도록 JavaScript 전용 트랜지션에 `v-bind:css="false"`를 명시적으로 추가하는 것도 좋은 생각입니다. 이것은 CSS 규칙이 실수로 트랜지션을 방해하는 것을 방지합니다.</p>

이제 예를 들어 보겠습니다. 다음은 Velocity.js를 사용한 간단한 JavaScript 트랜지션입니다.

``` html
<!-- Velocity는 jQuery.animate와 매우 비슷하게 동작하며 -->
<!-- JavaScript 애니메이션의 훌륭한 옵션입니다. -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>

<div id="example-4">
  <button @click="show = !show">
    Toggle
  </button>
  <transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
    v-bind:css="false"
  >
    <p v-if="show">
      Demo
    </p>
  </transition>
</div>
```

``` js
new Vue({
  el: '#example-4',
  data: {
    show: false
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
    },
    enter: function (el, done) {
      Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 300 })
      Velocity(el, { fontSize: '1em' }, { complete: done })
    },
    leave: function (el, done) {
      Velocity(el, { translateX: '15px', rotateZ: '50deg' }, { duration: 600 })
      Velocity(el, { rotateZ: '100deg' }, { loop: 2 })
      Velocity(el, {
        rotateZ: '45deg',
        translateY: '30px',
        translateX: '30px',
        opacity: 0
      }, { complete: done })
    }
  }
})
```

{% raw %}
<div id="example-4" class="demo">
  <button @click="show = !show">
    Toggle
  </button>
  <transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <p v-if="show">
      Demo
    </p>
  </transition>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>
<script>
new Vue({
  el: '#example-4',
  data: {
    show: false
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.transformOrigin = 'left'
    },
    enter: function (el, done) {
      Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 300 })
      Velocity(el, { fontSize: '1em' }, { complete: done })
    },
    leave: function (el, done) {
      Velocity(el, { translateX: '15px', rotateZ: '50deg' }, { duration: 600 })
      Velocity(el, { rotateZ: '100deg' }, { loop: 2 })
      Velocity(el, {
        rotateZ: '45deg',
        translateY: '30px',
        translateX: '30px',
        opacity: 0
      }, { complete: done })
    }
  }
})
</script>
{% endraw %}

## 최초 렌더링 시 트랜지션

노드의 초기 렌더에 트랜지션을 적용하고 싶다면 `appear` 속성을 추가 할 수 있습니다 :

``` html
<transition appear>
  <!-- ... -->
</transition>
```

기본적으로 진입 및 진출에 지정된 트랜지션을 사용합니다. 그러나 원하는 경우 사용자 정의 CSS 클래스를 지정할 수도 있습니다.

``` html
<transition
  appear
  appear-class="custom-appear-class"
  appear-to-class="custom-appear-to-class" (2.1.8+)
  appear-active-class="custom-appear-active-class"
>
  <!-- ... -->
</transition>
```

그리고 사용자 정의 JavaScript 훅 입니다.

``` html
<transition
  appear
  v-on:before-appear="customBeforeAppearHook"
  v-on:appear="customAppearHook"
  v-on:after-appear="customAfterAppearHook"
  v-on:appear-cancelled="customAppearCancelledHook"
>
  <!-- ... -->
</transition>
```

## 엘리먼트 간 트랜지션

[컴포넌트 사이의 트랜지션](#Transitioning-Between-Components)에 대해서는 나중에 설명하지만 `v-if` /`v-else`를 사용하여 원본 엘리먼트 사이를 트랜지션 할 수도 있습니다. 가장 일반적인 두 엘리먼트 트랜지션 중 하나는 목록 컨테이너와 빈 목록을 설명하는 메시지 사이에 사용됩니다.

``` html
<transition>
  <table v-if="items.length > 0">
    <!-- ... -->
  </table>
  <p v-else>Sorry, no items found.</p>
</transition>
```

이것은 잘 작동하지만 주의해야할 한 가지 주의 사항이 있습니다.

<p class="tip">**같은 태그 이름** 을 가진 엘리먼트 사이를 트랜지션할 때, Vue에 고유 한 `key` 속성을 부여함으로써 별개의 엘리먼트임을 말해야합니다. 그렇지 않으면 Vue의 컴파일러는 효율성을 위해 엘리먼트의 내용만 바꿉니다. 기술적으로 불필요한 경우 라하더라도 **여러 항목을 항상 `<transition>` 컴포넌트에 키핑하는 것이 좋습니다.**</p>

예제:

``` html
<transition>
  <button v-if="isEditing" key="save">
    Save
  </button>
  <button v-else key="edit">
    Edit
  </button>
</transition>
```

이러한 경우,`key` 속성을 사용하여 같은 엘리먼트의 여러 상태 사이를 트랜지션 할 수 있습니다. `v-if` 와 `v-else` 대신에 위의 예제를 다음과 같이 재 작성할 수 있습니다:

``` html
<transition>
  <button v-bind:key="isEditing">
    {{ isEditing ? 'Save' : 'Edit' }}
  </button>
</transition>
```

실제로 여러 개의 `v-if`를 사용하거나 하나의 엘리먼트를 동적 속성에 바인딩하여 여러 엘리먼트 사이를 트랜지션 할 수 있습니다. 예:

``` html
<transition>
  <button v-if="docState === 'saved'" key="saved">
    Edit
  </button>
  <button v-if="docState === 'edited'" key="edited">
    Save
  </button>
  <button v-if="docState === 'editing'" key="editing">
    Cancel
  </button>
</transition>
```

또한 다음과 같이 쓸 수 있습니다.

``` html
<transition>
  <button v-bind:key="docState">
    {{ buttonMessage }}
  </button>
</transition>
```

``` js
// ...
computed: {
  buttonMessage: function () {
    switch (this.docState) {
      case 'saved': return 'Edit'
      case 'edited': return 'Save'
      case 'editing': return 'Cancel'
    }
  }
}
```

### 트랜지션 모드

아직 한 가지 문제가 있습니다. 아래 버튼을 클릭 해보십시오:

{% raw %}
<div id="no-mode-demo" class="demo">
  <transition name="no-mode-fade">
    <button v-if="on" key="on" @click="on = false">
      on
    </button>
    <button v-else key="off" @click="on = true">
      off
    </button>
  </transition>
</div>
<script>
new Vue({
  el: '#no-mode-demo',
  data: {
    on: false
  }
})
</script>
<style>
.no-mode-fade-enter-active, .no-mode-fade-leave-active {
  transition: opacity .5s
}
.no-mode-fade-enter, .no-mode-fade-leave-active {
  opacity: 0
}
</style>
{% endraw %}

"on"버튼과 "off"버튼 사이를 트랜지션 할 때 두 버튼이 렌더링됩니다 - 다른 트랜지션이 진행되는 동안 하나의 트랜지션이 트랜지션됩니다. 이것은 `<transition>`의 기본 동작입니다 - 들어오고 나가는 것이 동시에 발생합니다.

트랜지션 항목이 절대적으로 서로의 위에 놓일 때처럼 때로는 위 기능이 훌륭합니다.

{% raw %}
<div id="no-mode-absolute-demo" class="demo">
  <div class="no-mode-absolute-demo-wrapper">
    <transition name="no-mode-absolute-fade">
      <button v-if="on" key="on" @click="on = false">
        on
      </button>
      <button v-else key="off" @click="on = true">
        off
      </button>
    </transition>
  </div>
</div>
<script>
new Vue({
  el: '#no-mode-absolute-demo',
  data: {
    on: false
  }
})
</script>
<style>
.no-mode-absolute-demo-wrapper {
  position: relative;
  height: 18px;
}
.no-mode-absolute-demo-wrapper button {
  position: absolute;
}
.no-mode-absolute-fade-enter-active, .no-mode-absolute-fade-leave-active {
  transition: opacity .5s;
}
.no-mode-absolute-fade-enter, .no-mode-absolute-fade-leave-active {
  opacity: 0;
}
</style>
{% endraw %}

그런 다음 슬라이드 트랜지션처럼 보이도록 되었을 수도 있습니다.

{% raw %}
<div id="no-mode-translate-demo" class="demo">
  <div class="no-mode-translate-demo-wrapper">
    <transition name="no-mode-translate-fade">
      <button v-if="on" key="on" @click="on = false">
        on
      </button>
      <button v-else key="off" @click="on = true">
        off
      </button>
    </transition>
  </div>
</div>
<script>
new Vue({
  el: '#no-mode-translate-demo',
  data: {
    on: false
  }
})
</script>
<style>
.no-mode-translate-demo-wrapper {
  position: relative;
  height: 18px;
}
.no-mode-translate-demo-wrapper button {
  position: absolute;
}
.no-mode-translate-fade-enter-active, .no-mode-translate-fade-leave-active {
  transition: all 1s;
}
.no-mode-translate-fade-enter, .no-mode-translate-fade-leave-active {
  opacity: 0;
}
.no-mode-translate-fade-enter {
  transform: translateX(31px);
}
.no-mode-translate-fade-leave-active {
  transform: translateX(-31px);
}
</style>
{% endraw %}

동시 들어가고 떠나는 트랜지션이 항상 바람직한 것은 아니기 때문에 Vue는 몇 가지 대안을 제공합니다 **트랜지션 모드** :

- `in-out`: 처음에는 새로운 엘리먼트가 트랜지션되고, 완료되면 현재 엘리먼트가 트랜지션됩니다.

- `out-in`: 현재 엘리먼트가 먼저 트랜지션되고, 완료되면 새로운 요소가 바뀝니다.

이제 `out-in` 으로 on/off 버튼의 트랜지션을 업데이트 해 보겠습니다.

``` html
<transition name="fade" mode="out-in">
  <!-- ... the buttons ... -->
</transition>
```

{% raw %}
<div id="with-mode-demo" class="demo">
  <transition name="with-mode-fade" mode="out-in">
    <button v-if="on" key="on" @click="on = false">
      on
    </button>
    <button v-else key="off" @click="on = true">
      off
    </button>
  </transition>
</div>
<script>
new Vue({
  el: '#with-mode-demo',
  data: {
    on: false
  }
})
</script>
<style>
.with-mode-fade-enter-active, .with-mode-fade-leave-active {
  transition: opacity .5s
}
.with-mode-fade-enter, .with-mode-fade-leave-active {
  opacity: 0
}
</style>
{% endraw %}

단순한 속성 추가를 통해 특수 스타일을 추가하지 않고 원래의 트랜지션을 수정했습니다.

`in-out` 모드는 자주 사용되지 않지만 때로는 약간 다른 트랜지션 효과에 유용 할 수 있습니다. 이전에 작업했던 슬라이드-페이드 트랜지션과 결합 해 보겠습니다.

{% raw %}
<div id="in-out-translate-demo" class="demo">
  <div class="in-out-translate-demo-wrapper">
    <transition name="in-out-translate-fade" mode="in-out">
      <button v-if="on" key="on" @click="on = false">
        on
      </button>
      <button v-else key="off" @click="on = true">
        off
      </button>
    </transition>
  </div>
</div>
<script>
new Vue({
  el: '#in-out-translate-demo',
  data: {
    on: false
  }
})
</script>
<style>
.in-out-translate-demo-wrapper {
  position: relative;
  height: 18px;
}
.in-out-translate-demo-wrapper button {
  position: absolute;
}
.in-out-translate-fade-enter-active, .in-out-translate-fade-leave-active {
  transition: all .5s;
}
.in-out-translate-fade-enter, .in-out-translate-fade-leave-active {
  opacity: 0;
}
.in-out-translate-fade-enter {
  transform: translateX(31px);
}
.in-out-translate-fade-leave-active {
  transform: translateX(-31px);
}
</style>
{% endraw %}

멋지지 않나요?

## 컴포넌트간 트랜지션

컴포넌트 사이의 트랜지션은 더욱 간단합니다. 우리는`key` 속성이 필요 없습니다. 대신, 우리는 [동적 컴포넌트](components.html#Dynamic-Components)를 래핑합니다.

``` html
<transition name="component-fade" mode="out-in">
  <component v-bind:is="view"></component>
</transition>
```

``` js
new Vue({
  el: '#transition-components-demo',
  data: {
    view: 'v-a'
  },
  components: {
    'v-a': {
      template: '<div>Component A</div>'
    },
    'v-b': {
      template: '<div>Component B</div>'
    }
  }
})
```

``` css
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
```

{% raw %}
<div id="transition-components-demo" class="demo">
  <input v-model="view" type="radio" value="v-a" id="a" name="view"><label for="a">A</label>
  <input v-model="view" type="radio" value="v-b" id="b" name="view"><label for="b">B</label>
  <transition name="component-fade" mode="out-in">
    <component v-bind:is="view"></component>
  </transition>
</div>
<style>
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to {
  opacity: 0;
}
</style>
<script>
new Vue({
  el: '#transition-components-demo',
  data: {
    view: 'v-a'
  },
  components: {
    'v-a': {
      template: '<div>Component A</div>'
    },
    'v-b': {
      template: '<div>Component B</div>'
    }
  }
})
</script>
{% endraw %}

## 리스트 트랜지션

지금까지 다음과 같은 트랜지션을 다루었습니다.

- 개별 노드들
- 한번에 하나만 렌더링 되는 여러 노드

그렇다면`v-for`를 사용하여 동시에 렌더링 하고자 하는 항목의 전체 목록이 있는 경우는 어떨까요? 이 경우 우리는`<transition-group>` 컴포넌트를 사용합니다. 예를 들어보기 전에 이 컴포넌트에 대해 알아야 할 몇 가지 중요한 사항이 있습니다.
- `<transition>` 과 달리, 실제 요소인 `<span>`을 렌더링합니다. `tag` 속성으로 렌더링 된 요소를 변경할 수 있습니다.
- 엘리먼트의 내부 구현은 **항상 필요합니다** 고유한 `key` 속성을 갖습니다

### 리스트의 진입 / 진출 트랜지션

이제 이전에 사용한 것과 같은 CSS 클래스를 사용하여 들어가고 떠나는 간단한 예제를 살펴 보겠습니다.

``` html
<div id="list-demo">
  <button v-on:click="add">Add</button>
  <button v-on:click="remove">Remove</button>
  <transition-group name="list" tag="p">
    <span v-for="item in items" v-bind:key="item" class="list-item">
      {{ item }}
    </span>
  </transition-group>
</div>
```

``` js
new Vue({
  el: '#list-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9],
    nextNum: 10
  },
  methods: {
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.randomIndex(), 1)
    },
  }
})
```

``` css
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
```

{% raw %}
<div id="list-demo" class="demo">
  <button v-on:click="add">Add</button>
  <button v-on:click="remove">Remove</button>
  <transition-group name="list" tag="p">
    <span v-for="item in items" :key="item" class="list-item">
      {{ item }}
    </span>
  </transition-group>
</div>
<script>
new Vue({
  el: '#list-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9],
    nextNum: 10
  },
  methods: {
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.randomIndex(), 1)
    },
  }
})
</script>
<style>
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
{% endraw %}

이 예제에는 한 가지 문제점이 있습니다. 항목을 추가하거나 제거 할 때 항목이 순조롭게 트랜지션되는 대신 새 위치에 즉시 변화합니다. 나중에 해결할 것입니다.

### 리스트 이동 트랜지션

`<transition-group>` 컴포넌트는 또 다른 속임수를 가지고 있습니다. 그것은 진입과 진출 것뿐만 아니라 위치의 변화도 생생하게 표현할 수 있습니다. 이 기능을 사용하기 위해 알아야 할 유일한 새로운 개념은 아이템이 위치를 바꿀 때 추가되는 **`v-move` 클래스**를 추가하는 것입니다. 다른 클래스와 마찬가지로 접두어는 제공된 `name` 속성 값과 일치하며 `move-class` 속성을 사용하여 클래스를 수동으로 지정할 수도 있습니다.

이 클래스는 다음과 같이 트랜지션 타이밍과 easing curve을 지정하는 데 주로 유용합니다.

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>

<div id="flip-list-demo" class="demo">
  <button v-on:click="shuffle">Shuffle</button>
  <transition-group name="flip-list" tag="ul">
    <li v-for="item in items" v-bind:key="item">
      {{ item }}
    </li>
  </transition-group>
</div>
```

``` js
new Vue({
  el: '#flip-list-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9]
  },
  methods: {
    shuffle: function () {
      this.items = _.shuffle(this.items)
    }
  }
})
```

``` css
.flip-list-move {
  transition: transform 1s;
}
```

{% raw %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>
<div id="flip-list-demo" class="demo">
  <button v-on:click="shuffle">Shuffle</button>
  <transition-group name="flip-list" tag="ul">
    <li v-for="item in items" :key="item">
      {{ item }}
    </li>
  </transition-group>
</div>
<script>
new Vue({
  el: '#flip-list-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9]
  },
  methods: {
    shuffle: function () {
      this.items = _.shuffle(this.items)
    }
  }
})
</script>
<style>
.flip-list-move {
  transition: transform 1s;
}
</style>
{% endraw %}

이것은 마술처럼 보일지 모르겠지만 Vue는 [FLIP](https://aerotwist.com/blog/flip-your-animations/)이라는 간단한 애니메이션 기법을 사용하여 변형을 사용하여 이전 위치에서 새로운 위치로 요소를 부드럽게 트랜지션합니다.

이 기술을 이전 구현과 결합하여 가능한 모든 변경 사항을 목록에 적용 할 수 있습니다!

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>

<div id="list-complete-demo" class="demo">
  <button v-on:click="shuffle">Shuffle</button>
  <button v-on:click="add">Add</button>
  <button v-on:click="remove">Remove</button>
  <transition-group name="list-complete" tag="p">
    <span
      v-for="item in items"
      v-bind:key="item"
      class="list-complete-item"
    >
      {{ item }}
    </span>
  </transition-group>
</div>
```

``` js
new Vue({
  el: '#list-complete-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9],
    nextNum: 10
  },
  methods: {
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.randomIndex(), 1)
    },
    shuffle: function () {
      this.items = _.shuffle(this.items)
    }
  }
})
```

``` css
.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
```

{% raw %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>
<div id="list-complete-demo" class="demo">
  <button v-on:click="shuffle">Shuffle</button>
  <button v-on:click="add">Add</button>
  <button v-on:click="remove">Remove</button>
  <transition-group name="list-complete" tag="p">
    <span v-for="item in items" :key="item" class="list-complete-item">
      {{ item }}
    </span>
  </transition-group>
</div>
<script>
new Vue({
  el: '#list-complete-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9],
    nextNum: 10
  },
  methods: {
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.randomIndex(), 1)
    },
    shuffle: function () {
      this.items = _.shuffle(this.items)
    }
  }
})
</script>
<style>
.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>
{% endraw %}

<p class="tip">한 가지 중요한 사실은 이러한 FLIP 트랜지션은 `display:inline` 으로 설정된 요소로는 작동하지 않는다는 것입니다. 또는 `display:inline-block` 을 사용하거나 flex 컨텍스트에 요소를 배치 할 수 있습니다.</p>

이러한 FLIP 애니메이션은 단일 축으로 제한되지 않습니다. 다차원 그리드의 항목을 [매우 쉽게](https://jsfiddle.net/chrisvfritz/sLrhk1bc/) 트랜지션 할 수 있습니다.

{% raw %}
<div id="sudoku-demo" class="demo">
  <strong>Lazy Sudoku</strong>
  <p>Keep hitting the shuffle button until you win.</p>
  <button @click="shuffle">
    Shuffle
  </button>
  <transition-group name="cell" tag="div" class="sudoku-container">
    <div v-for="cell in cells" :key="cell.id" class="cell">
      {{ cell.number }}
    </div>
  </transition-group>
</div>
<script>
new Vue({
  el: '#sudoku-demo',
  data: {
    cells: Array.apply(null, { length: 81 })
      .map(function (_, index) {
        return {
          id: index,
          number: index % 9 + 1
        }
      })
  },
  methods: {
    shuffle: function () {
      this.cells = _.shuffle(this.cells)
    }
  }
})
</script>
<style>
.sudoku-container {
  display: flex;
  flex-wrap: wrap;
  width: 238px;
  margin-top: 10px;
}
.cell {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 25px;
  height: 25px;
  border: 1px solid #aaa;
  margin-right: -1px;
  margin-bottom: -1px;
}
.cell:nth-child(3n) {
  margin-right: 0;
}
.cell:nth-child(27n) {
  margin-bottom: 0;
}
.cell-move {
  transition: transform 1s;
}
</style>
{% endraw %}

### 비틀거리는 목록 트랜지션

데이터 속성을 통해 JavaScript 트랜지션과 통신함으로써 목록에서 트랜지션을 비틀 수 있습니다.

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>

<div id="staggered-list-demo">
  <input v-model="query">
  <transition-group
    name="staggered-fade"
    tag="ul"
    v-bind:css="false"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <li
      v-for="(item, index) in computedList"
      v-bind:key="item.msg"
      v-bind:data-index="index"
    >{{ item.msg }}</li>
  </transition-group>
</div>
```

``` js
new Vue({
  el: '#staggered-list-demo',
  data: {
    query: '',
    list: [
      { msg: 'Bruce Lee' },
      { msg: 'Jackie Chan' },
      { msg: 'Chuck Norris' },
      { msg: 'Jet Li' },
      { msg: 'Kung Fury' }
    ]
  },
  computed: {
    computedList: function () {
      var vm = this
      return this.list.filter(function (item) {
        return item.msg.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
      })
    }
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.height = 0
    },
    enter: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 1, height: '1.6em' },
          { complete: done }
        )
      }, delay)
    },
    leave: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 0, height: 0 },
          { complete: done }
        )
      }, delay)
    }
  }
})
```

{% raw %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>
<div id="example-5" class="demo">
  <input v-model="query">
  <transition-group
    name="staggered-fade"
    tag="ul"
    v-bind:css="false"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <li
      v-for="(item, index) in computedList"
      v-bind:key="item.msg"
      v-bind:data-index="index"
    >{{ item.msg }}</li>
  </transition-group>
</div>
<script>
new Vue({
  el: '#example-5',
  data: {
    query: '',
    list: [
      { msg: 'Bruce Lee' },
      { msg: 'Jackie Chan' },
      { msg: 'Chuck Norris' },
      { msg: 'Jet Li' },
      { msg: 'Kung Fury' }
    ]
  },
  computed: {
    computedList: function () {
      var vm = this
      return this.list.filter(function (item) {
        return item.msg.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
      })
    }
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.height = 0
    },
    enter: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 1, height: '1.6em' },
          { complete: done }
        )
      }, delay)
    },
    leave: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 0, height: 0 },
          { complete: done }
        )
      }, delay)
    }
  }
})
</script>
{% endraw %}

## 트랜지션 재사용

트랜지션은 Vue의 컴포넌트 시스템을 통해 재사용 할 수 있습니다. 재사용 할 수있는 트랜지션을 만드려면 루트에 `<transition>`또는 `<transition-group>` 컴포넌트를 놓은 다음 자식을 트랜지션 컴포넌트에 전달하면됩니다.

다음은 템플릿 컴포넌트를 사용하는 예입니다.

``` js
Vue.component('my-special-transition', {
  template: '\
    <transition\
      name="very-special-transition"\
      mode="out-in"\
      v-on:before-enter="beforeEnter"\
      v-on:after-enter="afterEnter"\
    >\
      <slot></slot>\
    </transition>\',
  methods: {
    beforeEnter: function (el) {
      // ...
    },
    afterEnter: function (el) {
      // ...
    }
  }
})
```

함수형 컴포넌트는 특히 이 작업에 적합합니다.

``` js
Vue.component('my-special-transition', {
  functional: true,
  render: function (createElement, context) {
    var data = {
      props: {
        name: 'very-special-transition',
        mode: 'out-in'
      },
      on: {
        beforeEnter: function (el) {
          // ...
        },
        afterEnter: function (el) {
          // ...
        }
      }
    }
    return createElement('transition', data, context.children)
  }
})
```

## 동적 트랜지션

예, Vue의 트랜지션도 데이터 기반입니다! 동적 변환의 가장 기본적인 예제는 `name` 속성을 동적 속성에 바인딩합니다.

```html
<transition v-bind:name="transitionName">
  <!-- ... -->
</transition>
```

이는 Vue의 트랜지션 클래스 규칙을 사용하여 CSS 트랜지션 / 애니메이션을 정의하고 단순히 트랜지션하려는 경우에 유용 할 수 있습니다.

실제로 모든 트랜지션 속성은 동적으로 바인딩 될 수 있습니다. 그리고 그것은 단지 속성이 아닙니다. 이벤트 훅은 단지 메소드이기 때문에 컨텍스트의 모든 데이터에 액세스 할 수 있습니다. 즉, 컴포넌트의 상태에 따라 JavaScript 트랜지션이 다르게 동작 할 수 있습니다.

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>

<div id="dynamic-fade-demo" class="demo">
  Fade In: <input type="range" v-model="fadeInDuration" min="0" v-bind:max="maxFadeDuration">
  Fade Out: <input type="range" v-model="fadeOutDuration" min="0" v-bind:max="maxFadeDuration">
  <transition
    v-bind:css="false"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <p v-if="show">hello</p>
  </transition>
  <button
    v-if="stop"
    v-on:click="stop = false; show = false"
  >Start animating</button>
  <button
    v-else
    v-on:click="stop = true"
  >Stop it!</button>
</div>
```

``` js
new Vue({
  el: '#dynamic-fade-demo',
  data: {
    show: true,
    fadeInDuration: 1000,
    fadeOutDuration: 1000,
    maxFadeDuration: 1500,
    stop: true
  },
  mounted: function () {
    this.show = false
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
    },
    enter: function (el, done) {
      var vm = this
      Velocity(el,
        { opacity: 1 },
        {
          duration: this.fadeInDuration,
          complete: function () {
            done()
            if (!vm.stop) vm.show = false
          }
        }
      )
    },
    leave: function (el, done) {
      var vm = this
      Velocity(el,
        { opacity: 0 },
        {
          duration: this.fadeOutDuration,
          complete: function () {
            done()
            vm.show = true
          }
        }
      )
    }
  }
})
```

{% raw %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>
<div id="dynamic-fade-demo" class="demo">
  Fade In: <input type="range" v-model="fadeInDuration" min="0" v-bind:max="maxFadeDuration">
  Fade Out: <input type="range" v-model="fadeOutDuration" min="0" v-bind:max="maxFadeDuration">
  <transition
    v-bind:css="false"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <p v-if="show">hello</p>
  </transition>
  <button
    v-if="stop"
    v-on:click="stop = false; show = false"
  >Start animating</button>
  <button
    v-else
    v-on:click="stop = true"
  >Stop it!</button>
</div>
<script>
new Vue({
  el: '#dynamic-fade-demo',
  data: {
    show: true,
    fadeInDuration: 1000,
    fadeOutDuration: 1000,
    maxFadeDuration: 1500,
    stop: true
  },
  mounted: function () {
    this.show = false
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
    },
    enter: function (el, done) {
      var vm = this
      Velocity(el,
        { opacity: 1 },
        {
          duration: this.fadeInDuration,
          complete: function () {
            done()
            if (!vm.stop) vm.show = false
          }
        }
      )
    },
    leave: function (el, done) {
      var vm = this
      Velocity(el,
        { opacity: 0 },
        {
          duration: this.fadeOutDuration,
          complete: function () {
            done()
            vm.show = true
          }
        }
      )
    }
  }
})
</script>
{% endraw %}

마지막으로, 동적 트랜지션을 만드는 궁극적인 방법은 사용되는 트랜지션의 특성을 변경하기 위해 props을 받는 컴포넌트를 사용하는 것입니다. 별로인 것 처럼 들리지만, 유일한 한계는 실제로 당신의 상상력에 있습니다.
