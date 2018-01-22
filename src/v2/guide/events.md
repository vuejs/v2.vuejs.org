---
title: Xử lí sự kiện
type: guide
order: 9
---

## Lắng nghe sự kiện

Chúng ta có thể dùng directive `v-on` để lắng nghe các sự kiện DOM và thực thi JavaScript khi những sự kiện này được kích hoạt. Ví dụ:

``` html
<div id="example-1">
  <button v-on:click="counter += 1">Đếm cừu</button>
  <p>{{ counter }} con cừu.</p>
</div>
```
``` js
var example1 = new Vue({
  el: '#example-1',
  data: {
    counter: 0
  }
})
```

Kết quả:

{% raw %}
<div id="example-1" class="demo">
  <button v-on:click="counter += 1">Đếm cừu</button>
  <p>{{ counter }} con cừu.</p>
</div>
<script>
var example1 = new Vue({
  el: '#example-1',
  data: {
    counter: 0
  }
})
</script>
{% endraw %}

## Phương thức xử lí sự kiện

Trong thực tế, logic để xử lí sự kiện thường phức tạp hơn, vì thế chứa JavaScript trực tiếp trong giá trị của thuộc tính `v-on` như trên là không khả thi. Đó là lí do `v-on` cũng có thể nhận tên của một phương thức mà bạn muốn gọi. Ví dụ:

``` html
<div id="example-2">
  <!-- `greet` là tên của phương thức bạn muốn gọi -->
  <button v-on:click="greet">Chào mừng</button>
</div>
```

``` js
var example2 = new Vue({
  el: '#example-2',
  data: {
    name: 'Vue.js'
  },
  // định nghĩa phương thức trong object `methods`
  methods: {
    greet: function (event) {
      // bên trong một phương thức, `this` trỏ đến đối tượng Vue
      alert('Xin chào ' + this.name + '!')
      // `event` là sự kiện DOM native
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
})

// bạn cũng có thể gọi phương thức từ JavaScript
example2.greet() // => 'Xin chào Vue.js!'
```

Kết quả:

{% raw %}
<div id="example-2" class="demo">
  <!-- `greet` là tên của phương thức bạn muốn gọi -->
  <button v-on:click="greet">Chào mừng</button>
</div>
<script>
var example2 = new Vue({
  el: '#example-2',
  data: {
    name: 'Vue.js'
  },
  // định nghĩa phương thức trong object `methods`
  methods: {
    greet: function (event) {
      // bên trong một phương thức, `this` trỏ đến đối tượng Vue
      alert('Xin chào ' + this.name + '!')
      // `event` là sự kiện DOM native
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
})
</script>
{% endraw %}

## Gọi phương thức inline

Thay vì bind trực tiếp tên phương thức, ta cũng có thể gọi phương thức trong một câu lệnh JavaScript:

``` html
<div id="example-3">
  <button v-on:click="say('Konica')">Hãy nói Konica</button>
  <button v-on:click="say('Viettel')">Hãy nói theo cách của bạn</button>
</div>
```
``` js
new Vue({
  el: '#example-3',
  methods: {
    say: function (message) {
      alert(message)
    }
  }
})
```

Kết quả:

{% raw %}
<div id="example-3" class="demo">
  <button v-on:click="say('Konica')">Hãy nói Konica</button>
  <button v-on:click="say('Viettel')">Hãy nói theo cách của bạn</button>
</div>
<script>
new Vue({
  el: '#example-3',
  methods: {
    say: function (message) {
      alert(message)
    }
  }
})
</script>
{% endraw %}

Đôi khi chúng ta cũng muốn truy xuất đến sự kiện DOM ban đầu từ câu lệnh JavaScript inline. Bạn có thể truyền sự kiện DOM vào phương thức thông qua biến `$event`:

``` html
<button v-on:click="warn('Chưa submit được form.', $event)">
  Submit
</button>
```

``` js
// ...
methods: {
  warn: function (message, event) {
    // bây giờ chúng ta có thể truy xuất đến sự kiện DOM native
    if (event) event.preventDefault()
    alert(message)
  }
}
```

## Event modifier

Trong rất nhiều trường hợp, chúng ta cần gọi `event.preventDefault()` hoặc `event.stopPropagation()` bên trong một phương thức xử lí sự kiện. Tuy việc này không có gì khó, sẽ tốt hơn nếu các phương thức chỉ phải tập trung giải quyết logic dữ liệu thay vì cáng đáng các sự kiện DOM.

Để giải quyết vấn đề này, Vue cung cấp các **event modifier** cho `v-on`. `Event modfier` là một hậu tố (postfix) cho directive, được biểu thị bằng một dấu chấm.

- `.stop`
- `.prevent`
- `.capture`
- `.self`
- `.once`

``` html
<!--
  sự kiện click sẽ không được propagate (lan truyền)
  điều này tương đương với event.stopPropagation()
-->
<a v-on:click.stop="doThis"></a>

<!--
  sự kiện submit sẽ không reload trang
  điều này tương đương với event.preventDefault()
-->
<form v-on:submit.prevent="onSubmit"></form>

<!-- ta có thể nối modifier với nhau -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- chỉ có modifier, không có phương thức xử lí -->
<form v-on:submit.prevent></form>

<!--
  dùng "capture mode" khi thêm event listener
  nghĩa là một sự kiện xảy ra với một phần tử bên trong sẽ được xử lí ở đây
  trước khi được xử lí bởi phần tử đó
  đọc thêm về event capturing: https://javascript.info/bubbling-and-capturing#capturing
-->
<div v-on:click.capture="doThis">...</div>

<!--
  chỉ kích hoạt phương thức xử lí nếu event.target là chính phần tử được click,
  chứ không phải là một phần tử con
-->
<div v-on:click.self="doThat">...</div>
```

<p class="tip">Khi sử dụng nhiều modifier cùng lúc, thứ tự nối là rất quan trọng, vì code sẽ được tạo ra theo đúng thứ tự đó. Ví dụ, `@click.prevent.self` sẽ ngăn **toàn bộ click** còn `@click.self.prevent` chỉ ngăn các click trên chính phần tử đang được nhắc đến.</p>

> Từ phiên bản 2.1.4 trở đi

``` html
<!-- sự kiện click sẽ chỉ được kích hoạt tối đa một lần -->
<a v-on:click.once="donateKidney"></a>
```

Không như các modifier khác, vốn chỉ dùng được cho các sự kiện DOM native, modifier `.once` cũng có thể dùng cho các [sự kiện component](components.html#Su-dung-v-on-voi-cac-su-kien-tuy-bien). Nếu bạn chưa đọc về component, có thể bỏ qua và quay lại sau.

> Từ phiên bản 2.3.0 trở đi

Vue cũng cung cấp modifier `.passive`, tương ứng với [tùy chọn `passive` cho `addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters).

```html
<!-- 
hành vi mặc định của sự kiện scroll (cuộn trang) sẽ xảy ra 
ngay lập tức, thay vì đợi `onScroll` hoàn tất.
-->
<div v-on:scroll.passive="onScroll">...</div>
```

Modifier `.passive` đặc biệt hữu ích để cải thiện hiệu năng của ứng dụng trên các thiết bị di động.

<p class="tip">Đừng dùng `.passive` và `.prevent` cùng nhau, vì `.prevent` sẽ không có hiệu lực, và trình duyệt có thể sẽ bật cảnh báo. Nên nhớ rằng `.passive` thông báo cho trình duyệt biết rằng bạn _không muốn_ ngăn chặn hành vi mặc định của sự kiện.</p>

## Key modifier

Khi lắng nghe các sự kiện bàn phím (keyboard event), chúng ta thường phải kiểm tra mã phím (key code). Vue hỗ trợ thêm key modifier (modifer cho mã phím) cho `v-on` trong các trường hợp này:

``` html
<!-- chỉ gọi vm.submit() khi keyCode là 13 (phím Enter) -->
<input v-on:keyup.13="submit">
```

Tất nhiên nếu phải nhớ toàn bộ các mã phím thì rất mệt mỏi, nên Vue cung cấp alias (bí danh) cho các phím thông dụng nhất:

``` html
<!-- như trên -->
<input v-on:keyup.enter="submit">

<!-- cũng hoạt động với cách viết tắt của v-on -->
<input @keyup.enter="submit">
```

Sau đây là danh sách đầy đủ của các key modifier:

- `.enter`
- `.tab`
- `.delete` (dùng cho cả hai phím "Delete" và "←")
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

Bạn cũng có thể [tự định nghĩa alias cho key modifier](../api/#keyCodes) bằng object toàn cục `config.keyCodes`:

``` js
// cho phép sử dụng v-on:keyup.f1
Vue.config.keyCodes.f1 = 112
```

### Key modifier tự động

> 2.5.0+

Bạn cũng có thể sử dụng bất kì [tên phím hợp lệ](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values) nào để làm modifier bằng cách chuyển sang kebab-case:

``` html
<input @keyup.page-down="onPageDown">
```

Trong ví dụ trên, hàm `onPageDown` chỉ được gọi nếu `$event.key === 'PageDown'`.

<p class="tip">Một số ít phím (`esc` và các phím mũi tên) có giá trị `key` không thống nhất trên IE9. Nếu cần hỗ trợ IE9, bạn nên dùng các alias như trên đây.</p>

## Các phím modifier hệ thống

> Từ phiên bản 2.1.0 trở đi

Bạn có thể sử dụng các modifier sau để chỉ kích hoạt các event listener khi các phím modifier tương ứng được nhấn:

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

> Trên các bàn phím của hệ Macintosh, meta là phím Command (⌘). Trên bàn phím Windows, meta là phím Windows (⊞). Trên bàn phím Sun Microsystems, meta được đánh dấu bằng một hình thoi (◆). Trên một số loại bàn phím nhất định như bàn phím của MIT và Lisp, meta có nhãn “META”. Trên bàn phím Symbolics, meta có nhãn “META” hoặc “Meta”.

Ví dụ:

```html
<!-- Alt + C -->
<input @keyup.alt.67="clear">

<!-- Cmd + Click -->
<div @click.meta="openNewTab">Mở tab mới</div>
```

<p class="tip">Các phím modifier có cách hoạt động khác với phím thông thường, và khi dùng với sự kiện `keyup`, phím modifier phải được nhấn khi sự kiện được phát ra. Nói một cách khác, `keyup.ctrl` sẽ chỉ được kích hoạt khi bạn thả một phím khi vẫn đang ấn phím `ctrl`. Sự kiện này sẽ không được kích hoạt nếu bạn chỉ thả một mình phím `ctrl`.</p>

### Modifier `.exact`

> 2.5.0+

Modifier `.exact` (chính xác) có thể được sử dụng kết hợp với các modifier khác để chỉ rõ rằng hàm xử lí sự kiện chỉ nên được thực thi khi _chính xác_ tổ hợp phím/chuột đó được bấm.

``` html
<!-- onClick vẫn sẽ được gọi nếu người dùng nhấn thêm phím Alt hoặc Shift -->
<button @click.ctrl="onClick">A</button>

<!-- onClick chỉ được gọi nếu chỉ phím Ctrl được nhấn -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- this will only fire when no system modifiers are pressed -->
<button @click.exact="onClick">A</button>
```

### Modifier cho phím chuột

> Từ phiên bản 2.2.0 trở đi

- `.left`
- `.right`
- `.middle`

Những modifier này giới hạn xử lí cho những sự kiện được kích hoạt bởi một phím chuột nhất định (trái, phải, hoặc giữa).

## Tại sao lại lắng nghe sự kiện trong HTML?

Bạn có thể lo ngại rằng toàn bộ việc lắng nghe sự kiện bằng cách đặt event listener trong HTML như thế này là vi phạm quy tắc "[separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns)." Cứ yên tâm, vì tất cả các hàm và biểu thức xử lí sự kiện của Vue được ràng buộc chặt chẽ với ViewModel, sẽ không có khó khăn gì trong việc bảo trì. Thật ra, sử dụng `v-on` còn có những lợi ích sau:

1. Giúp định vị hàm xử lí trong code JavaScript được dễ dàng hơn bằng cách đọc lướt template HTML.

2. Vì không phải attach hàm xử lí sự kiện trong JavaScript một cách thủ công, code trong ViewModel trở nên thuần logic và không phụ thuộc vào DOM. Điều này giúp chúng ta dễ viết test.

3. Khi một ViewModel bị hủy, tất cả hàm xử lí sự kiện đính kèm cũng được tự động gỡ bỏ mà không cần bạn phải dọn dẹp.
