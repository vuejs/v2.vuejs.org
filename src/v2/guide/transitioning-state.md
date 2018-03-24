---
title: Transition cho trạng thái
type: guide
order: 202
---

[Hệ thống transition](transitions.html) của Vue cung cấp nhiều cách để animate enter/leave và danh sách, nhưng còn về animation cho chính dữ liệu thì sao? Ví dụ:

- các con số và phép tính
- màu sắc được hiển thị
- vị trí của các node SVG
- kích cỡ và các thuộc tính khác của các phần tử web

Tất cả những thông tin này đều hoặc đã được lưu trữ sẵn dưới dạng số liệu, hoặc có thể được chuyển đổi thành số liệu. Một khi làm vậy, chúng ta có thể animate những thay đổi trạng thái này bằng cách dùng những thư viện bên thứ ba, kết hợp với hệ thống phản ứng (reactivity) và component của Vue.

## Animate cho trạng thái bằng watcher

Watcher cho phép chúng ta animate các thay đổi từ bất kì thuộc tính dạng số nào sang một thuộc tính khác. Điều này nói một cách trừu tượng thì nghe có vẻ phức tạp, vì thế chúng ta hãy xem một ví dụ với [Greensock](https://greensock.com/):

``` html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.3/TweenMax.min.js"></script>

<div id="animated-number-demo">
  <input v-model.number="number" type="number" step="20">
  <p>{{ animatedNumber }}</p>
</div>
```

``` js
new Vue({
  el: '#animated-number-demo',
  data: {
    number: 0,
    tweenedNumber: 0
  },
  computed: {
    animatedNumber: function() {
      return this.tweenedNumber.toFixed(0);
    }
  },
  watch: {
    number: function(newValue) {
      TweenLite.to(this.$data, 0.5, { tweenedNumber: newValue });
    }
  }
})
```

{% raw %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.3/TweenMax.min.js"></script>
<div id="animated-number-demo" class="demo">
  <input v-model.number="number" type="number" step="20">
  <p>{{ animatedNumber }}</p>
</div>
<script>
new Vue({
  el: '#animated-number-demo',
  data: {
    number: 0,
    tweenedNumber: 0
  },
  computed: {
    animatedNumber: function() {
      return this.tweenedNumber.toFixed(0);
    }
  },
  watch: {
    number: function(newValue) {
      TweenLite.to(this.$data, 0.5, { tweenedNumber: newValue });
    }
  }
})
</script>
{% endraw %}

Khi bạn cập nhật con số trong input trên đây, thay đổi sẽ được animate. Ví dụ này khá ổn, nhưng nếu dữ liệu không phải là một con số trực tiếp mà là một cái gì đó khác, ví dụ như màu CSS thì sao? Dưới đây là một cách thực hiện điều này khi tích hợp với [Tween.js](https://github.com/tweenjs/tween.js) và [Color.js](https://github.com/brehaut/color-js):

``` html
<script src="https://cdn.jsdelivr.net/npm/tween.js@16.3.4"></script>
<script src="https://cdn.jsdelivr.net/npm/color-js@1.0.3"></script>

<div id="example-7">
  <input
    v-model="colorQuery"
    v-on:keyup.enter="updateColor"
    placeholder="Nhập vào một màu"
  >
  <p>
    <span
      v-bind:style="{ backgroundColor: tweenedCSSColor }"
      class="example-7-color-preview"
    ></span>
  </p>
  <p>{{ tweenedCSSColor }}</p>
</div>
```

``` js
var Color = net.brehaut.Color

new Vue({
  el: '#example-7',
  data: {
    colorQuery: '',
    color: {
      red: 0,
      green: 0,
      blue: 0,
      alpha: 1
    },
    tweenedColor: {}
  },
  created: function () {
    this.tweenedColor = Object.assign({}, this.color)
  },
  watch: {
    color: function () {
      function animate () {
        if (TWEEN.update()) {
          requestAnimationFrame(animate)
        }
      }

      new TWEEN.Tween(this.tweenedColor)
        .to(this.color, 750)
        .start()

      animate()
    }
  },
  computed: {
    tweenedCSSColor: function () {
      return new Color({
        red: this.tweenedColor.red,
        green: this.tweenedColor.green,
        blue: this.tweenedColor.blue,
        alpha: this.tweenedColor.alpha
      }).toCSS()
    }
  },
  methods: {
    updateColor: function () {
      this.color = new Color(this.colorQuery).toRGB()
      this.colorQuery = ''
    }
  }
})
```

``` css
.example-7-color-preview {
  display: inline-block;
  width: 50px;
  height: 50px;
}
```

{% raw %}
<script src="https://cdn.jsdelivr.net/npm/tween.js@16.3.4"></script>
<script src="https://cdn.jsdelivr.net/npm/color-js@1.0.3"></script>
<div id="example-7" class="demo">
  <input
    v-model="colorQuery"
    v-on:keyup.enter="updateColor"
    placeholder="Nhập vào một màu"
  >
  <button v-on:click="updateColor">Cập nhật</button>
  <p>
    <span
      v-bind:style="{ backgroundColor: tweenedCSSColor }"
      class="example-7-color-preview"
    ></span>
  </p>
  <p>{{ tweenedCSSColor }}</p>
</div>
<script>
var Color = net.brehaut.Color
new Vue({
  el: '#example-7',
  data: {
    colorQuery: '',
    color: {
      red: 0,
      green: 0,
      blue: 0,
      alpha: 1
    },
    tweenedColor: {}
  },
  created: function () {
    this.tweenedColor = Object.assign({}, this.color)
  },
  watch: {
    color: function () {
      function animate () {
        if (TWEEN.update()) {
          requestAnimationFrame(animate)
        }
      }

      new TWEEN.Tween(this.tweenedColor)
        .to(this.color, 750)
        .start()

      animate()
    }
  },
  computed: {
    tweenedCSSColor: function () {
      return new Color({
        red: this.tweenedColor.red,
        green: this.tweenedColor.green,
        blue: this.tweenedColor.blue,
        alpha: this.tweenedColor.alpha
      }).toCSS()
    }
  },
  methods: {
    updateColor: function () {
      this.color = new Color(this.colorQuery).toRGB()
      this.colorQuery = ''
    }
  }
})
</script>
<style>
.example-7-color-preview {
  display: inline-block;
  width: 50px;
  height: 50px;
}
</style>
{% endraw %}

## Transition động cho trạng thái

Cũng giống như component transition của Vue, transition cho dữ liệu cũng có thể được cập nhật trong thời gian thực (real time), và việc này đặc biệt hữu ích khi tạo các prototype (bản thử nghiệm, khuôn mẫu). Ngay cả khi sử dụng một đa giác SVG đơn giản, bạn cũng có thể đạt được nhiều hiệu ứng mà nếu không sử dụng transition bạn có thể sẽ phải tốn kha khá thời gian thử đi thử lại mới tưởng tượng ra được.

{% raw %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.18.5/TweenLite.min.js"></script>
<div id="svg-polygon-demo" class="demo">
  <svg width="200" height="200" class="demo-svg">
    <polygon :points="points" class="demo-polygon"></polygon>
    <circle cx="100" cy="100" r="90" class="demo-circle"></circle>
  </svg>
  <label>Số cạnh: {{ sides }}</label>
  <input
    class="demo-range-input"
    type="range"
    min="3"
    max="500"
    v-model.number="sides"
  >
  <label>Bán kính tối thiểu: {{ minRadius }}%</label>
  <input
    class="demo-range-input"
    type="range"
    min="0"
    max="90"
    v-model.number="minRadius"
  >
  <label>Quãng cập nhật: {{ updateInterval }} mili giây</label>
  <input
    class="demo-range-input"
    type="range"
    min="10"
    max="2000"
    v-model.number="updateInterval"
  >
</div>
<script>
new Vue({
  el: '#svg-polygon-demo',
  data: function () {
    var defaultSides = 10
    var stats = Array.apply(null, { length: defaultSides })
      .map(function () { return 100 })
    return {
      stats: stats,
      points: generatePoints(stats),
      sides: defaultSides,
      minRadius: 50,
      interval: null,
      updateInterval: 500
    }
  },
  watch: {
    sides: function (newSides, oldSides) {
      var sidesDifference = newSides - oldSides
      if (sidesDifference > 0) {
        for (var i = 1; i <= sidesDifference; i++) {
          this.stats.push(this.newRandomValue())
        }
      } else {
        var absoluteSidesDifference = Math.abs(sidesDifference)
        for (var i = 1; i <= absoluteSidesDifference; i++) {
          this.stats.shift()
        }
      }
    },
    stats: function (newStats) {
      TweenLite.to(
        this.$data,
        this.updateInterval / 1000,
        { points: generatePoints(newStats) }
      )
    },
    updateInterval: function () {
      this.resetInterval()
    }
  },
  mounted: function () {
    this.resetInterval()
  },
  methods: {
    randomizeStats: function () {
      var vm = this
      this.stats = this.stats.map(function () {
        return vm.newRandomValue()
      })
    },
    newRandomValue: function () {
      return Math.ceil(this.minRadius + Math.random() * (100 - this.minRadius))
    },
    resetInterval: function () {
      var vm = this
      clearInterval(this.interval)
      this.randomizeStats()
      this.interval = setInterval(function () {
        vm.randomizeStats()
      }, this.updateInterval)
    }
  }
})

function valueToPoint (value, index, total) {
  var x     = 0
  var y     = -value * 0.9
  var angle = Math.PI * 2 / total * index
  var cos   = Math.cos(angle)
  var sin   = Math.sin(angle)
  var tx    = x * cos - y * sin + 100
  var ty    = x * sin + y * cos + 100
  return { x: tx, y: ty }
}

function generatePoints (stats) {
  var total = stats.length
  return stats.map(function (stat, index) {
    var point = valueToPoint(stat, index, total)
    return point.x + ',' + point.y
  }).join(' ')
}
</script>
<style>
.demo-svg { display: block; }
.demo-polygon { fill: #41B883; }
.demo-circle {
  fill: transparent;
  stroke: #35495E;
}
.demo-range-input {
  display: block;
  width: 100%;
  margin-bottom: 15px;
}
</style>
{% endraw %}

Đây là [code hoàn thiện](https://jsfiddle.net/chrisvfritz/65gLu2b6/) của demo trên.

## Sắp xếp transtion vào component

Quản lí nhiều transition cho trạng thái có thể làm độ phức tạp của một đối tượng hoặc component Vue tăng lên một cách nhanh chóng. May thay, nhiều animation có thể được trích xuất ra thành các component con chuyên dụng. Chúng ta hãy thử làm chuyện này với ví dụ animate số nguyên ở trên:

``` html
<script src="https://cdn.jsdelivr.net/npm/tween.js@16.3.4"></script>

<div id="example-8">
  <input v-model.number="firstNumber" type="number" step="20"> +
  <input v-model.number="secondNumber" type="number" step="20"> =
  {{ result }}
  <p>
    <animated-integer v-bind:value="firstNumber"></animated-integer> +
    <animated-integer v-bind:value="secondNumber"></animated-integer> =
    <animated-integer v-bind:value="result"></animated-integer>
  </p>
</div>
```

``` js
// Giờ thì logic tween phức tạp này có thể được dùng lại giữa
// hai số nguyên bất kì nào mà chúng ta muốn animte trong ứng dụng.
// Component cũng cung cấp một giao diện rõ ràng để thiết lập
// thêm nhiều transition động cũng như các kĩ thuật transition
// phức tạp.
Vue.component('animated-integer', {
  template: '<span>{{ tweeningValue }}</span>',
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data: function () {
    return {
      tweeningValue: 0
    }
  },
  watch: {
    value: function (newValue, oldValue) {
      this.tween(oldValue, newValue)
    }
  },
  mounted: function () {
    this.tween(0, this.value)
  },
  methods: {
    tween: function (startValue, endValue) {
      var vm = this
      function animate () {
        if (TWEEN.update()) {
          requestAnimationFrame(animate)
        }
      }

      new TWEEN.Tween({ tweeningValue: startValue })
        .to({ tweeningValue: endValue }, 500)
        .onUpdate(function (object) {
          vm.tweeningValue = object.tweeningValue.toFixed(0)
        })
        .start()

      animate()
    }
  }
})

// Đối tượng Vue chính bây giờ không còn gì phức tạp cả!
new Vue({
  el: '#example-8',
  data: {
    firstNumber: 20,
    secondNumber: 40
  },
  computed: {
    result: function () {
      return this.firstNumber + this.secondNumber
    }
  }
})
```

{% raw %}
<script src="https://cdn.jsdelivr.net/npm/tween.js@16.3.4"></script>
<div id="example-8" class="demo">
  <input v-model.number="firstNumber" type="number" step="20"> +
  <input v-model.number="secondNumber" type="number" step="20"> =
  {{ result }}
  <p>
    <animated-integer v-bind:value="firstNumber"></animated-integer> +
    <animated-integer v-bind:value="secondNumber"></animated-integer> =
    <animated-integer v-bind:value="result"></animated-integer>
  </p>
</div>
<script>
Vue.component('animated-integer', {
  template: '<span>{{ tweeningValue }}</span>',
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data: function () {
    return {
      tweeningValue: 0
    }
  },
  watch: {
    value: function (newValue, oldValue) {
      this.tween(oldValue, newValue)
    }
  },
  mounted: function () {
    this.tween(0, this.value)
  },
  methods: {
    tween: function (startValue, endValue) {
      var vm = this
      function animate () {
        if (TWEEN.update()) {
          requestAnimationFrame(animate)
        }
      }

      new TWEEN.Tween({ tweeningValue: startValue })
        .to({ tweeningValue: endValue }, 500)
        .onUpdate(function () {
          vm.tweeningValue = this.tweeningValue.toFixed(0)
        })
        .start()

      animate()
    }
  }
})
new Vue({
  el: '#example-8',
  data: {
    firstNumber: 20,
    secondNumber: 40
  },
  computed: {
    result: function () {
      return this.firstNumber + this.secondNumber
    }
  }
})
</script>
{% endraw %}

Bên trong các component con, chúng ta có thể kết hợp bất kì kĩ thuật transition nào đã được bàn đến trên trang này với các kĩ thuật được [hệ thống transition có sẵn](transitions.html) của Vue cung cấp. Với hai công cụ này, thật sự những điều chúng ta không làm được là rất ít.

## Làm cho thiết kế trở nên sinh động

Theo một định nghĩa, animate nghĩa là "(làm gì đó) trở nên sinh động." Tiếc thay, các icon, logo và mascot (linh vật) thường chỉ được tạo ra dưới dạng hình ảnh hoặc SVG tĩnh. Vì vậy tuy mang hình ảnh các con vật, octocat của GitHub hay con chim của Twitter không thực sự sống động.

Vue có thể giúp bạn. Vì SVG thực chất chỉ là dữ liệu, chúng ta chỉ cần biết các sinh vật này trông như thế nào khi hứng khởi, khi đang suy nghĩ, hoặc khi sợ hãi. Sau đó Vue có thể giúp transition giữa các trạng thái này và làm cho ứng dụng của bạn trở nên sinh động hơn.

Kết hợp giữa các thay đổi trạng thái theo hướng tương tác và tính toán thời gian, [Sarah Drasner](https://sarahdrasnerdesign.com/) minh họa cho điều này trong demo dưới đây:

<p data-height="265" data-theme-id="light" data-slug-hash="YZBGNp" data-default-tab="result" data-user="sdras" data-embed-version="2" data-pen-title="Vue-controlled Wall-E" class="codepen">See the Pen <a href="https://codepen.io/sdras/pen/YZBGNp/">Vue-controlled Wall-E</a> by Sarah Drasner (<a href="https://codepen.io/sdras">@sdras</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
