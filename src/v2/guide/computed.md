---
title: Computed property và watcher
type: guide
order: 5
---

## Computed property

<p class="tip">Computed property có thể hiểu là một "thuộc tính được tính toán." Để cho nhất quán, chúng tôi sẽ giữ nguyên cụm từ `computed property`.</p>

Viết biểu thức trực tiếp trong template rất tiện, nhưng chỉ dành cho những biểu thức có tính toán đơn giản. Những biểu thức phức tạp được viết theo cách đó sẽ khiến template cồng kềnh và khó bảo trì. Ví dụ:

``` html
<div id="example">
  {{ message.split('').reverse().join('') }}
</div>
```

Đến đây, template không còn đơn giản và mang tính khai báo (declarative) nữa. Bạn sẽ phải mất chút thời gian thì mới nhận ra được `message` đã bị đảo ngược. Càng tệ hơn khi bạn sử dụng biến `message` đảo ngược này nhiều lần trong code.

Đó là lí do tại sao đối với bất kì logic nào phức tạp, bạn nên sử dụng **computed property**.

### Ví dụ cơ bản

``` html
<div id="example">
  <p>Thông điệp ban đầu: "{{ message }}"</p>
  <p>Thông điệp bị đảo ngược bằng tính toán (computed): "{{ reversedMessage }}"</p>
</div>
```

``` js
var vm = new Vue({
  el: '#example',
  data: {
    message: 'người đông bến đợi thuyền xuôi ngược'
  },
  computed: {
    // một computed getter
    reversedMessage: function () {
      // `this` trỏ tới đối tượng vm
      return this.message.split(' ').reverse().join(' ')
    }
  }
})
```

Kết quả là:

{% raw %}
<div id="example" class="demo">
  <p>Thông điệp ban đầu: "{{ message }}"</p>
  <p>Thông điệp bị đảo ngược (computed): "{{ reversedMessage }}"</p>
</div>
<script>
var vm = new Vue({
  el: '#example',
  data: {
    message: 'người đông bến đợi thuyền xuôi ngược'
  },
  computed: {
    reversedMessage: function () {
      return this.message.split(' ').reverse().join(' ')
    }
  }
})
</script>
{% endraw %}

Ở đây chúng ta khai báo một computed property là `reversedMessage`. Hàm mà chúng ta đã cung cấp sẽ được sử dụng như một hàm getter cho thuộc tính `vm.reversedMessage`:

``` js
console.log(vm.reversedMessage) // => 'ngược xuôi thuyền đợi bến đông người'
vm.message = 'xa ngân tiếng hát đàn trầm bổng'
console.log(vm.reversedMessage) // => 'bổng trầm đàn hát tiếng ngân xa'
```

Bạn có thể mở console và thử chạy đối tượng vm mẫu ở trên. Giá trị của `vm.reversedMessage` luôn phụ thuộc vào giá trị của `vm.message`.

Bạn có thể ràng buộc dữ liệu (data-bind) cho computed property trong template một cách bình thường như những thuộc tính khác. Vue biết được `vm.reversedMessage` phụ thuộc vào `vm.message` nên sẽ cập nhật bất kì ràng buộc (binding) nào phụ thuộc vào `vm.reversedMessage` khi `vm.message` thay đổi. Điểm hay nhất ở đây là chúng ta tạo ra được mối liên hệ giữa các thành phần phụ thuộc (dependency): các hàm getter của computed thì không bị hiệu ứng phụ (side effect), chính điều đó giúp dễ hiểu và dễ kiểm tra.

### Computed caching và phương thức

Bạn có lẽ đã nhận ra chúng ta cũng có thể đạt được cùng một kết quả bằng cách sử dụng một phương thức:

``` html
<p>Thông điệp bị đảo ngược: "{{ reverseMessage() }}"</p>
```

``` js
// trong component
methods: {
  reverseMessage: function () {
    return this.message.split(' ').reverse().join(' ')
  }
}
```

Thay vì sử dụng computed property, chúng ta cũng có thể dùng một phương thức thay thế. Nếu xét về kết quả cuối cùng thì hai cách tiếp cận này thât ra chỉ là một. Tuy nhiên, sự khác biệt ở đây là **computed property được cache lại dựa vào những những thành phần phụ thuộc (dependency).** Một computed property chỉ được tính toán lại khi những thành phần phụ thuộc của chúng thay đổi. Điều này có nghĩa: miễn là giá trị của `message` không thay đổi, thì những truy cập tới computed `reversedMessage` sẽ ngay lập tức trả về kết quả được tính toán trước đó mà không phải chạy lại hàm một lần nữa.

Điểu này cũng có nghĩa là computed property dưới đây sẽ không bao giờ cập nhật, bởi vì `Data.now()` không phải là một thành phần phụ thuộc phản ứng (reactive dependency) :

``` js
computed: {
  now: function () {
    return Date.now()
  }
}
```

Để so sánh, một phương phương thức **luôn** được gọi khi có một sự kiện render lại (re-render) xảy ra.

Tại sao chúng ta lại cần phải cache? Thử tưởng tượng chúng ta có một computed property **A** có nhiều thao tác tính toán trên một mảng dữ liệu lớn. Chúng ta lại có nhiều computed property phụ thuộc vào **A**. Nếu không cache lại, chúng ta phải thực thi hàm getter của **A** nhiều hơn mức cần thiết rất nhiều! Trong trường hợp bạn không muốn cache, hãy sử dụng một phương thức thay thế.

### Computed và watched

Vue cung cấp một cách khái quát hơn để quan sát và phản ứng (react) lại những thay đổi trên dữ liệu: **watch property**. Khi bạn có một số dữ liệu cần được thay đổi dựa trên những dữ liệu khác, bạn rất dễ lạm dụng `watch` - nhất là nếu bạn có nền tảng về AngularJS. Tuy nhiên, thường thì bạn nên dùng `computed` thay vì `watch`. Hãy xem ví dụ sau:

``` html
<div id="demo">{{ fullName }}</div>
```

``` js
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Trần',
    lastName: 'Lập',
    fullName: 'Trần Lập'
  },
  watch: {
    firstName: function (val) {
      this.fullName = val + ' ' + this.lastName
    },
    lastName: function (val) {
      this.fullName = this.firstName + ' ' + val
    }
  }
})
```

Đoạn code phía trên theo hướng mệnh lệnh và lặp lại. Hãy so sánh với phiên bản dùng computed property:

``` js
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Evan',
    lastName: 'You'
  },
  computed: {
    fullName: function () {
      return this.firstName + ' ' + this.lastName
    }
  }
})
```

Cách này tốt hơn nhiều đúng không?

### Computed Setter

Những computed property mặc định chỉ có getter, nhưng bạn cũng có thể cung cấp setter nếu cần thiết:

``` js
// ...
computed: {
  fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
// ...
```

Bây giờ, khi bạn gán `vm.fullName = 'John Doe'`, thì setter sẽ được gọi, `vm.firstName` và `vm.lastName` sẽ được cập nhật tương ứng.

## Watcher

Computed property thích hợp cho hầu hết các trường hợp, nhưng cũng có lúc cần tới những watcher tùy biến. Đó là lí do tại sao Vue cung cấp một cách khái quát hơn để phản ứng lại với việc thay đổi dữ liệu trong `watch`. Cách sử dụng này rất hữu ích khi bạn muốn thực hiện những tính toán không đồng bộ và tốn kém liên quan đến việc thay đổi dữ liệu.

Ví dụ:

``` html
<div id="watch-example">
  <p>
    Hãy hỏi một câu hỏi yes/no:
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>
```

``` html
<script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: 'Không thể trả lời nếu bạn chưa đặt câu hỏi!'
  },
  watch: {
    // bất cứ lúc nào câu hỏi thay đổi, hàm bên dưới sẽ chạy
    question: function (newQuestion, oldQuestion) {
      this.answer = 'Đang chờ bạn đặt xong câu hỏi...'
      this.getAnswer()
    }
  },
  methods: {
    // _.debounce là một hàm do Lodash cung cấp
    // Để tìm hiểu rõ hơn cách hoạt động của hàm này,
    // bạn có thể truy cập: https://lodash.com/docs#debounce 
    getAnswer: _.debounce(
      function () {
        if (this.question.indexOf('?') === -1) {
          this.answer = 'Câu hỏi thì thường chứa một dấu "?" ;-)'
          return
        }
        this.answer = 'Đang suy nghĩ...'
        var vm = this
        axios.get('https://yesno.wtf/api')
          .then(function (response) {
            vm.answer = _.capitalize(response.data.answer)
          })
          .catch(function (error) {
            vm.answer = 'Lỗi! Không thể truy cập API. ' + error
          })
      },
      // Đây là thời gian (đơn vị mili giây) chúng ta đợi người dùng dừng gõ.
      500
    )
  }
})
</script>
```

Kết quả:

{% raw %}
<div id="watch-example" class="demo">
  <p>
    Hãy hỏi một câu hỏi yes/no:
    <input v-model="question">
  </p>
  <p>{{ answer }}</p>
</div>
<script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.13.1/lodash.min.js"></script>
<script>
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: 'Không thể trả lời nếu bạn chưa đặt câu hỏi!'
  },
  watch: {
    question: function (newQuestion, oldQuestion) {
      this.answer = 'Đang chờ bạn đặt xong câu hỏi...'
      this.getAnswer()
    }
  },
  methods: {
    getAnswer: _.debounce(
      function () {
        var vm = this
        if (this.question.indexOf('?') === -1) {
          vm.answer = 'Câu hỏi thì thường chứa một dấu "?" ;-)'
          return
        }
        vm.answer = 'Đang suy nghĩ...'
        axios.get('https://yesno.wtf/api')
          .then(function (response) {
            vm.answer = _.capitalize(response.data.answer)
          })
          .catch(function (error) {
            vm.answer = 'Lỗi! Không thể truy cập API. ' + error
          })
      },
      500
    )
  }
})
</script>
{% endraw %}

Trong trường hợp này, sử dụng `watch` cho phép chúng ta thực hiện những tính toán không đồng bộ (ví dụ: truy cập tới một API), giới hạn việc chúng ta thường xuyên thực hiện tính toán đó và gán trạng thái trung gian cho tới khi chúng ta có được kết quả cuối cùng. Nếu dùng computed property bạn sẽ không làm được những chuyện này.

Ngoài tùy chọn `watch`, bạn cũng có thể sử dụng [vm.$watch API](../api/#vm-watch).
