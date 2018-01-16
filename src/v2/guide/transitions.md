---
title: Transition cho enter/leave & danh sách
type: guide
order: 201
---

<p class="tip">Để tiện đối chiếu giữa các class CSS mà Vue tạo ra trong một transition (chuyển tiếp) và trạng thái của các phần tử hoặc component, trong phần này chúng tôi giữ nguyên bản tiếng Anh các từ `enter` (đi vào, nhập vào) và `leave` (rời khỏi) khi cần.</p>

## Tổng quan

Vue cung cấp nhiều cách khác nhau để áp dụng các hiệu ứng transition khi các phần tử được thêm vào, thay đổi, hoặc gỡ bỏ khỏi DOM. Điều này bao gồm các công cụ để:

- tự động áp dụng các class CSS cho các transition và animation
- tích hợp các thư viện chuyển động CSS bên thứ ba, ví dụ như [Animate.css](https://daneden.github.io/animate.css/)
- sử dụng JavaScript để trực tiếp thay đổi DOM trong các hook transition
- tích hợp các thư viện chuyển động JavaScript bên thứ ba, ví dụ như [Velocity.js](http://velocityjs.org/)

Trên trang này, chúng ta sẽ chỉ bàn về transition cho enter/leave và danh sách, nhưng bạn có thể xem phần tiếp theo về [quản lí transition cho trạng thái (state transition)](transitioning-state.html).

## Transition cho phần tử hoặc component đơn lẻ

Vue cung cấp một component `transition`, cho phép bạn áp dụng các hiệu ứng transition enter/leave lên các phần tử hoặc component trong các ngữ cảnh sau:

- Render theo điều kiện (sử dụng `v-if`)
- Hiển thị theo điều kiện (sử dụng `v-show`)
- Component động
- Root node của component

Sau đây là một ví dụ:

``` html
<div id="demo">
  <button v-on:click="show = !show">
    Kích hoạt
  </button>
  <transition name="fade">
    <p v-if="show">Xin chào</p>
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
    Kích hoạt
  </button>
  <transition name="demo-transition">
    <p v-if="show">Xin chào</p>
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

Khi một phần tử chứa trong component `transition` được thêm vào hoặc gỡ bỏ khỏi DOM, các bước sau đây sẽ diễn ra:

1. Vue sẽ tự phát hiện ra nếu phần tử đang nhắc đến có CSS `transition` hoặc `animation` và thêm/bớt các class CSS transition vào đúng thời điểm.

2. Nếu component cung cấp [hook JavaScript](#Hook-JavaScript), các hook này sẽ được gọi vào đúng thời điểm.

3. Trong trường hợp không tìm thấy `transition` hoặc `animation` nào trong CSS và cũng không có hook JavaScript nào, việc thêm vào hoặc gỡ bỏ khỏi DOM sẽ được thực thi ngay trong frame tiếp theo (Lưu ý: đây là [animation frame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) của trình duyệt, khác với khái niệm `nextTick` của Vue).

### Các class transition

Có tổng cộng 6 class được áp dụng cho enter/leave transition.

1. `v-enter`: Trạng thái bắt đầu của `enter`. Được áp dụng trước khi phần tử được thêm vào DOM và gỡ bỏ đi một frame sau đó.

2. `v-enter-active`: Trạng thái active của `enter`. Được áp dụng trong suốt quá trình enter, từ ngay sau khi phần tử được thêm vào DOM cho đến khi transition/animation kết thúc. Class này có thể được dùng để định nghĩa [duration](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-duration), [delay](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-delay), và [hàm easing](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function) cho transition enter.

3. `v-enter-to`: **2.1.8+.** Trạng thái kết thúc của `enter`. Áp dụng một frame sau khi element được thêm vào DOM (cùng lúc với việc `v-enter` được gỡ bỏ), gỡ bỏ đi khi transition/animation kết thúc.

4. `v-leave`: Trạng thái bắt đầu của `leave`. Được áp dụng ngay khi một leave transition được kích hoạt và gỡ bỏ đi một frame sau đó.

5. `v-leave-active`: Trạng thái active của `leave`. Được áp dụng trong suốt quá trình leave, từ khi transition được kích hoạt cho đến khi transition/animation kết thúc. Class này có thể được dùng để định nghĩa duration, delay, và hàm easing cho leave transition.

6. `v-leave-to`: **2.1.8+.** Trạng thái kết thúc của `leave`. Áp dụng một frame sau khi leave transition được kích hoạt (cùng lúc với việc `v-leave` được gỡ bỏ), gỡ bỏ đi khi transition/animation kết thúc.

![Sơ đồ transition](/images/transition.png)

Mỗi class trên đây sẽ có prefix (tiếp đầu ngữ) là tên của `transition`. Ở đây prefix `v-` là mặc định khi bạn dùng một thẻ `<transition>` không có tên. Nếu chẳng hạn bạn dùng `<transition name="my-transition">` thì class `v-enter` sẽ trở thành `my-transition-enter`.

`v-enter-active` và `v-leave-active` cho phép bạn dùng các hàm easing khác nhau cho các enter/leave transition, như bạn sẽ thấy trong phần tiếp theo đây.

### CSS transition

CSS transition là một trong những transition thông dụng nhất. Ví dụ:

``` html
<div id="example-1">
  <button @click="show = !show">
    Kích hoạt
  </button>
  <transition name="slide-fade">
    <p v-if="show">Xin chào</p>
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
/*
  Animation cho enter và leave có thể có giá trị
  duration và timing function khác nhau.
*/
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* Trước 2.1.8 thì dùng .slide-fade-leave-active */ {
  transform: translateX(10px);
  opacity: 0;
}
```

{% raw %}
<div id="example-1" class="demo">
  <button @click="show = !show">
    Kích hoạt
  </button>
  <transition name="slide-fade">
    <p v-if="show">Xin chào</p>
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

### CSS animation

CSS animation được áp dụng cùng một cách như CSS transition. Điểm khác nhau là `v-enter` không được gỡ bỏ ngay lập tức sau khi phần tử được thêm vào DOM mà là khi sự kiện `animationend` được phát ra.

Đây là một ví dụ (chúng ta sẽ bỏ đi các prefix CSS cho gọn):

``` html
<div id="example-2">
  <button @click="show = !show">Kích hoạt</button>
  <transition name="bounce">
    <p v-if="show">Cân đẩu vân</p>
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
  <button @click="show = !show">Kích hoạt</button>
  <transition name="bounce">
    <p v-show="show">Cân đẩu vân</p>
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

### Class tùy biến cho transition

Bạn cũng có thể chỉ định các class tùy biến cho transition bằng cách cung cấp các thuộc tính sau đây:

- `enter-class`
- `enter-active-class`
- `enter-to-class` (2.1.8+)
- `leave-class`
- `leave-active-class`
- `leave-to-class` (2.1.8+)

Các thuộc tính này sẽ override những tên class theo thông lệ của Vue. Điều này đặc biệt có ích khi bạn muốn kết hợp giữa hệ thống transition của Vue và một thư viện CSS animation có sẵn như Animate.css.

Đây là một ví dụ:

``` html
<link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">

<div id="example-3">
  <button @click="show = !show">
    Kích hoạt
  </button>
  <transition
    name="custom-classes-transition"
    enter-active-class="animated tada"
    leave-active-class="animated bounceOutRight"
  >
    <p v-if="show">Thú nhún</p>
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
    Kích hoạt
  </button>
  <transition
    name="custom-classes-transition"
    enter-active-class="animated tada"
    leave-active-class="animated bounceOutRight"
  >
    <p v-if="show">Thú nhún</p>
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

### Sử dụng animation và transition cùng nhau

Vue cần phải đính kèm một sự kiện để có thể biết khi nào thì một chuyển động kết thúc. Sự kiện này có thể là `transitionend` hoặc `animationend`, tùy thuộc vào các rule CSS được áp dụng. Nếu bạn chỉ sử dụng animation hoặc transition, Vue có thể tự phát hiện kiểu chuyển động (animation hay transition).

Tuy nhiên, trong một số trường hợp có thể bạn muốn dùng cả transition và animation trên cùng một phần tử, ví dụ sử dụng Vue để kích hoạt một CSS animation, đồng thời áp dụng một hiệu ứng CSS transition khi hover. Trong những trường hợp này, bạn sẽ phải khai báo rõ kiểu chuyển động bạn muốn Vue xử lí bằng cách dùng một thuộc tính `type` với giá trị là `animation` hoặc `transition`.

### Chỉ định rõ thời lượng cho transition

> 2.2.0+

Trong đa số các trường hợp, Vue có thể tự biết được khi nào một transition kết thúc. Mặc định, Vue đợi cho sự kiện `transitionend` hoặc `animationend` của phần tử transition gốc được phát ra. Tuy nhiên, không phải lúc nào đây cũng là điều bạn muốn – ví dụ, chúng ta có thể có một chuỗi các transition nối tiếp nhau, trong đó một số phần tử bên trong có transition được trì hoãn (delay) hoặc kéo dài lâu hơn transition của phần tử transition gốc.

Trong những trường hợp như vậy, bạn có thể chỉ định một cách tường minh thời lượng (duration) của transition (với đơn vị là mili giây) dùng thuộc tính `duration` trên component `<transition>`:

``` html
<transition :duration="1000">...</transition>
```

Bạn cũng có thể chỉ định hai giá trị tách biệt nhau cho thời lượng `enter` và `leave`:

``` html
<transition :duration="{ enter: 500, leave: 800 }">...</transition>
```

### Hook JavaScript

Bạn cũng có thể định nghĩa các hook JavaScript trong các thuộc tính của component `<transition>`:

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
  // -----
  // ENTER
  // -----

  beforeEnter: function (el) {
    // ...
  },
  // callback `done()` là không bắt buộc
  // khi sử dụng cùng với CSS
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

  // -----
  // LEAVE
  // -----

  beforeLeave: function (el) {
    // ...
  },
  // callback `done()` là không bắt buộc
  // khi sử dụng cùng với CSS
  leave: function (el, done) {
    // ...
    done()
  },
  afterLeave: function (el) {
    // ...
  },
  // leaveCancelled chỉ hoạt động với v-show
  leaveCancelled: function (el) {
    // ...
  }
}
```

Những hook này có thể được sử dụng độc lập hoặc dùng chung với CSS transition/animation.

<p class="tip">Khi sử dụng các transition JavaScript, **hàm callback `done` là bắt buộc đối với các hook `enter` và `leave`**. Trong các trường hợp khác, các hook này sẽ được gọi một cách đồng bộ và transition sẽ kết thúc ngay lập tức.</p>

<p class="tip">Bạn cũng nên chỉ định rõ `v-bind:css="false"` cho các transition JavaScript để Vue có thể bỏ qua phần dò tìm CSS. Việc này cũng ngăn không cho các rule trong CSS can thiệp vào transition.</p>

Giờ chúng ta hãy xem một ví dụ. Đây là một transition JavaScript sử dụng Velocity.js:

``` html
<!--
Velocity hoạt động rất giống như jQuery.animate
và là một lựa chọn tuyệt vời cho animation bằng JavaScript
-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>

<div id="example-4">
  <button @click="show = !show">
    Kích hoạt
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
    Kích hoạt
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

## Transition khi render lần đầu tiên

Nếu muốn áp dụng một transition ngay trong lần render đầu tiên của một node, bạn có thể dùng thuộc tính `appear`:

``` html
<transition appear>
  <!-- ... -->
</transition>
```

Mặc định, các transition được chỉ định khi enter và leave sẽ được sử dụng. Nếu muốn, bạn cũng có thể dùng các class CSS tùy biến:

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

và các hook JavaScript tùy biến:

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

## Transition giữa các phần tử web

Chúng ta sẽ bàn về [transition giữa các component](#Transition-giua-cac-component) sau, nhưng bạn cũng có thể transition giữa các phần tử thô (raw element) sử dụng `v-if`/`v-else`. Một trong các transition giữa hai phần tử thông dụng nhất là giữa một phần tử chứa danh sách (`ul`, `ol`, `table`…) và một thông điệp mô tả một danh sách rỗng:

``` html
<transition>
  <table v-if="searchResults.length > 0">
    <!-- ... -->
  </table>
  <p v-else>Không tìm ra kết quả nào.</p>
</transition>
```

Cách này hoạt động tốt, nhưng có một điểm cần lưu ý:

<p class="tip">Khi kích hoạt giữa các phần tử **có cùng tên thẻ**, bạn phải cho Vue biết rằng đây là các phần tử khác nhau bằng cách cung cấp các giá trị `key` duy nhất. Nếu không, trình biên dịch của Vue sẽ chỉ thay đổi _nội dung_ của phần tử để hiệu quả hơn. Ngay cả khi về mặt kĩ thuật là không cần thiết, **hãy luôn dùng `key` cho các item trong một component `<transition>`.**</p>

Ví dụ:

``` html
<transition>
  <button v-if="isEditing" key="save">
    Lưu
  </button>
  <button v-else key="edit">
    Sửa
  </button>
</transition>
```

Trong những trường hợp này, bạn cũng có thể dùng thuộc tính `key` cho việc chuyển tiếp giữa các trạng thái khác nhau trong cùng một phần tử. Thay vì dùng `v-if` và `v-else`, ví dụ trên có thể được viết lại như sau:

``` html
<transition>
  <button v-bind:key="isEditing">
    {{ isEditing ? 'Lưu' : 'Sửa' }}
  </button>
</transition>
```

Thật ra chúng ta có thể chuyển tiếp giữa một số lượng bất kì các phần tử bằng cách dùng nhiều `v-if` hoặc bind một phần tử đơn lẻ vào một thuộc tính động. Ví dụ:

``` html
<transition>
  <button v-if="docState === 'saved'" key="saved">
    Sửa
  </button>
  <button v-if="docState === 'edited'" key="edited">
    Lưu
  </button>
  <button v-if="docState === 'editing'" key="editing">
    Hủy
  </button>
</transition>
```

Ví dụ trên cũng có thể được viết thành:

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
      case 'saved': return 'Sửa'
      case 'edited': return 'Lưu'
      case 'editing': return 'Hủy'
    }
  }
}
```

### Các chế độ transition

Chúng ta vẫn còn một vấn đề ở đây. Thử bấm vào nút bên dưới:

{% raw %}
<div id="no-mode-demo" class="demo">
  <transition name="no-mode-fade">
    <button v-if="on" key="on" @click="on = false">
      bật
    </button>
    <button v-else key="off" @click="on = true">
      tắt
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

Khi việc chuyển tiếp giữa hai nút "bật" và "tắt" diễn ra, cả hai nút đều được render - một nút mờ dần trong khi nút kia rõ dần. Đây là hành vi mặc định của `<transition>` - quá trình enter và leave xảy ra đồng thời.

Thỉnh thoảng đây là điều ta muốn, ví dụ khi chuyển tiếp giữa hai phần tử được sắp xếp chồng lên nhau:

{% raw %}
<div id="no-mode-absolute-demo" class="demo">
  <div class="no-mode-absolute-demo-wrapper">
    <transition name="no-mode-absolute-fade">
      <button v-if="on" key="on" @click="on = false">
        bật
      </button>
      <button v-else key="off" @click="on = true">
        tắt
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

Chúng ta cũng có thể sử dụng thêm [`translate`](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translate) để tạo hiệu ứng giống như slide:

{% raw %}
<div id="no-mode-translate-demo" class="demo">
  <div class="no-mode-translate-demo-wrapper">
    <transition name="no-mode-translate-fade">
      <button v-if="on" key="on" @click="on = false">
        bật
      </button>
      <button v-else key="off" @click="on = true">
        tắt
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

Tuy nhiên, không phải lúc nào chúng ta cũng muốn transition enter và leave xảy ra đồng thời. Vì thế, Vue cung cấp thêm một số **chế độ transition** thay thế:

- `in-out`: Transition đi vào (in) của phần tử mới xảy ra trước, và sau khi hoàn tất mới đến lượt transition đi ra (out) của phần tử hiện tại.

- `out-in`: Transition đi ra (out) của phần tử hiện tại xảy ra trước, và sau khi hoàn tất mới đến lượt transition đi vào (in) của phần tử mới.

Bây giờ chúng ta thử cập nhật transition cho các nút bật/tắt với `out-in`:

``` html
<transition name="fade" mode="out-in">
  <!-- ... hai nút bật/tắt ... -->
</transition>
```

{% raw %}
<div id="with-mode-demo" class="demo">
  <transition name="with-mode-fade" mode="out-in">
    <button v-if="on" key="on" @click="on = false">
      bật
    </button>
    <button v-else key="off" @click="on = true">
      tắt
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

Vậy là chỉ cần thêm một thuộc tính, chúng ta đã sửa xong transition ban đầu mà không cần phải viết bất kì style CSS đặc biệt nào.

Chế độ `in-out` không được dùng nhiều như `out-in`, nhưng thỉnh thoảng cũng có thể hữu dụng khi dùng cho một hiệu ứng transition hơi khác một chút. Chúng ta hãy thử kết hợp `in-out` với ví dụ slide-fade phía trên:

{% raw %}
<div id="in-out-translate-demo" class="demo">
  <div class="in-out-translate-demo-wrapper">
    <transition name="in-out-translate-fade" mode="in-out">
      <button v-if="on" key="on" @click="on = false">
        bật
      </button>
      <button v-else key="off" @click="on = true">
        tắt
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

Không đến nỗi nào, đúng không?

## Transition giữa các component

Transition giữa các component lại càng đơn giản hơn - chúng ta còn không cần dùng thuộc tính `key`. Thay vào đó, chúng ta wrap một [component động](components.html#component-dong):

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
/* .component-fade-leave-active ở các phiên bản trước 2.1.8 */ {
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

## Transition cho danh sách

Đến lúc này, chúng ta đã bàn về transition cho:

- Các node đơn
- Nhiều node khác nhau nhưng chỉ có một node được render mỗi lúc

Vậy nếu chúng ta có một danh sách chứa các item mà ta muốn render đồng thời, ví dụ với `v-for`, thì sao? Trong trường hợp này, ta sẽ dùng component `<transition-group>`. Trước khi xem ví dụ, có một số điều quan trọng mà bạn cần biết về component này:

- Khác với `<transition>`, `<transition-group>` render một phần tử thật sự, mặc định là `<span>`. Bạn có thể thay đổi kiểu phần tử được render ra bằng thuộc tính `tag`.
- Các phần tử bên trong `<transition-group>` **bắt buộc** phải có thuộc tính `key` duy nhất

### Transition enter/leave cho danh sách

Bây giờ chúng ta sẽ xem một ví dụ về transition cho enter/leave với cùng các class CSS mà ta đã dùng trên đây:

``` html
<div id="list-demo">
  <button v-on:click="add">Thêm</button>
  <button v-on:click="remove">Bớt</button>
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
  <button v-on:click="add">Thêm</button>
  <button v-on:click="remove">Bớt</button>
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

Có một vấn đề với ví dụ này: Khi bạn thêm hoặc bớt một item, những item xung quanh nó ngay lập tức nhảy đến vị trí mới thay vì chuyển tiếp một cách mềm mại. Chúng ta sẽ giải quyết vấn đề này sau.

### Transition dịch chuyển trong danh sách

Component `<transition-group>` có một tính năng nữa. Không chỉ có thể animate enter và leave, nó còn có thể animate vị trí của các item. Khái niệm mới duy nhất bạn cần biết đến để sử dụng tính năng này là **class `v-move`**, được thêm vào khi item thay đổi vị trí. Tương tự như các class khác, prefix của `v-mode` chính là thuộc tính `name`, và bạn có thể sử dụng một class khác với thuộc tính `move-class`.

Class này có ích nhất là để chỉ định thời lượng và hàm easing cho transition, như có thể thấy sau đây:

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>

<div id="flip-list-demo" class="demo">
  <button v-on:click="shuffle">Xáo trộn</button>
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
  <button v-on:click="shuffle">Xáo trộn</button>
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

Nhìn thì có vẻ như là phép màu, nhưng thật ra ở bên trong Vue đang dùng một kĩ thuật animation gọi là [FLIP](https://aerotwist.com/blog/flip-your-animations/) để thay đổi vị trí của các item một cách mềm mại bằng [`transform`](https://developer.mozilla.org/en-US/docs/Web/CSS/transform?v=a).

Chúng ta có thể kết hợp kĩ thuật này với các ví dụ phía trên để animate bất kì thay đổi nào xảy ra trong danh sách:

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>

<div id="list-complete-demo" class="demo">
  <button v-on:click="shuffle">Xáo trộn</button>
  <button v-on:click="add">Thêm</button>
  <button v-on:click="remove">Bớt</button>
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
/* .list-complete-leave-active đối với các phiên bản trước 2.1.8 */ {
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
  <button v-on:click="shuffle">Xáo trộn</button>
  <button v-on:click="add">Thêm</button>
  <button v-on:click="remove">Bớt</button>
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

<p class="tip">Một điểm quan trọng cần lưu ý là các transition FLIP này không hoạt động đối với các phần tử có `display: inline`. Để thay thế, bạn có thể dùng `display: inline-block` hoặc đặt trong một [flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes).</p>

FLIP animation cũng không bị giới hạn chỉ trong một trục. Item trong một grid (lưới) đa chiều cũng có thể [được animate](https://jsfiddle.net/chrisvfritz/sLrhk1bc/):

{% raw %}
<div id="sudoku-demo" class="demo">
  <strong>Sudoku dành cho mấy người lười</strong>
  <p>Cứ nằm khểnh bấm nút Xáo cho đến khi nào thắng thì thôi.<br>
  Chuẩn bị thêm thùng mì tôm càng tốt.</p>
  <button @click="shuffle">
    Này thì xáo này
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

### Transition tuần tự

Bằng cách giao tiếp với các transition JavaScript thông qua các thuộc tính dữ liệu, ta có thể khiến cho các transition trong một danh sách diễn ra một cách tuần tự:

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
      { msg: 'Hai Bà Trưng' },
      { msg: 'Ngô Quyền' },
      { msg: 'Đinh Tiên Hoàng' },
      { msg: 'Lý Thường Kiệt' },
      { msg: 'Trần Hưng Đạo' }
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
      { msg: 'Hai Bà Trưng' },
      { msg: 'Ngô Quyền' },
      { msg: 'Đinh Tiên Hoàng' },
      { msg: 'Lý Thường Kiệt' },
      { msg: 'Trần Hưng Đạo' }
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

## Transition tái sử dụng được

Transition có thể được tái sử dụng trong hệ thống component của Vue. Để tạo ra một transition sử dụng lại được, bạn chỉ cần đặt một component `<transition>` hoặc `<transition-group>` ở phần tử root, sau đó truyền bất cứ component con nào vào.

Đây là một ví dụ sử dụng một component template:

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
    </transition>\
  ',
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

Và component chức năng (functional component) đặc biệt phù hợp cho nhiệm vụ này:

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

## Transition động

Đúng, ngay cả transition trong Vue cũng hướng dữ liệu! Ví dụ cơ bản nhất của một transition động bind thuộc tính `name` vào một property động.

```html
<transition v-bind:name="transitionName">
  <!-- ... -->
</transition>
```

Điều này có thể có ích khi bạn đã định nghĩa transition/animation CSS với quy chuẩn đặt tên cho class transition của Vue và muốn hoán chuyển giữa các transition/animation này.

Tuy nhiên, sự thật thì bất kì thuộc tính transition nào cũng có thể được bind động. Và không chỉ có thuộc tính. Vì thật ra chỉ là các phương thức, các hook cho sự kiện có thể truy xuất đến bất kì dữ liệu nào trong ngữ cảnh hiện tại. Điều này có nghĩa là tùy vào trạng thái của component, các transition JavaScript của bạn có thể có các hành vi rất khác nhau.

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>

<div id="dynamic-fade-demo" class="demo">
  Thời gian hiện ra: <input type="range" v-model="fadeInDuration" min="0" v-bind:max="maxFadeDuration">
  Thời gian mờ đi: <input type="range" v-model="fadeOutDuration" min="0" v-bind:max="maxFadeDuration">
  <transition
    v-bind:css="false"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <p v-if="show">Xin chào</p>
  </transition>
  <button
    v-if="stop"
    v-on:click="stop = false; show = false"
  >Bắt đầu</button>
  <button
    v-else
    v-on:click="stop = true"
  >Dừng lại</button>
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
  Thời gian hiện ra: <input type="range" v-model="fadeInDuration" min="0" v-bind:max="maxFadeDuration">
  Thời gian mờ đi: <input type="range" v-model="fadeOutDuration" min="0" v-bind:max="maxFadeDuration">
  <transition
    v-bind:css="false"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <p v-if="show">Xin chào</p>
  </transition>
  <button
    v-if="stop"
    v-on:click="stop = false; show = false"
  >Bắt đầu</button>
  <button
    v-else
    v-on:click="stop = true"
  >Dừng lại</button>
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

Cuối cùng, cách tốt nhất để tạo transition động là thông qua các component nhận vào `props` để thay đổi bản chất của transition đang dùng. Nói thì có vẻ sến, nhưng thực sự giới hạn duy nhất là trí tưởng tượng của bạn.

