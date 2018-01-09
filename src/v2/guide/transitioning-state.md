---
title: 트렌지션 상태
type: guide
order: 202
---

Vue의 트랜지션 시스템은 진입, 진출 및 목록을 애니메이션으로 만드는 많은 간단한 방법을 제공하지만 데이터 자체에 대한 애니메이션은 어떻게 해야할까요?

- 숫자와 계산
- 색 표시
- SVG노드의 위치
- 엘리먼트의 크기 및 기타 속성

이들 모두는 이미 원시 숫자로 저장되어 있거나 숫자로 변환 될 수 있습니다. 그렇게하면 Vue의 반응성 및 컴포넌트 시스템과 함께 써드파티 라이브러리를 사용하여 트윈 상태로 상태 변경 사항을 애니메이션으로 만들 수 있습니다.

## 감시자와 애니메이션 상태

감시자를 사용하면 숫자 속성의 변경 사항을 다른 속성으로 애니메이션 할 수 있습니다. 처음에는 복잡해 보일 수도 있으므로 [Tween.js](https://github.com/tweenjs/tween.js)를 사용하여 예제를 살펴 보겠습니다.

``` html
<script src="https://cdn.jsdelivr.net/npm/tween.js@16.3.4"></script>

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
    animatedNumber: 0
  },
  watch: {
    number: function(newValue, oldValue) {
      var vm = this
      function animate () {
        if (TWEEN.update()) {
          requestAnimationFrame(animate)
        }
      }

      new TWEEN.Tween({ tweeningNumber: oldValue })
        .easing(TWEEN.Easing.Quadratic.Out)
        .to({ tweeningNumber: newValue }, 500)
        .onUpdate(function () {
          vm.animatedNumber = this.tweeningNumber.toFixed(0)
        })
        .start()

      animate()
    }
  }
})
```

{% raw %}
<script src="https://cdn.jsdelivr.net/npm/tween.js@16.3.4"></script>
<div id="animated-number-demo" class="demo">
  <input v-model.number="number" type="number" step="20">
  <p>{{ animatedNumber }}</p>
</div>
<script>
new Vue({
  el: '#animated-number-demo',
  data: {
    number: 0,
    animatedNumber: 0
  },
  watch: {
    number: function(newValue, oldValue) {
      var vm = this
      function animate () {
        if (TWEEN.update()) {
          requestAnimationFrame(animate)
        }
      }

      new TWEEN.Tween({ tweeningNumber: oldValue })
        .easing(TWEEN.Easing.Quadratic.Out)
        .to({ tweeningNumber: newValue }, 500)
        .onUpdate(function () {
          vm.animatedNumber = this.tweeningNumber.toFixed(0)
        })
        .start()

      animate()
    }
  }
})
</script>
{% endraw %}

숫자를 갱신하면 변경 사항이 입력 아래에 애니메이션으로 표시됩니다. 이것은 멋진 멋져 보이지만, 예를 들어 유효한 CSS 색상과 같이 숫자로 직접 저장되지 않은 것은 어떻게 할까요? 다음은 [Color.js](https://github.com/brehaut/color-js)를 추가하여 이를 수행하는 방법입니다.

``` html
<script src="https://cdn.jsdelivr.net/npm/tween.js@16.3.4"></script>
<script src="https://cdn.jsdelivr.net/npm/color-js@1.0.3"></script>

<div id="example-7">
  <input
    v-model="colorQuery"
    v-on:keyup.enter="updateColor"
    placeholder="Enter a color"
  >
  <button v-on:click="updateColor">Update</button>
  <p>Preview:</p>
  <span
    v-bind:style="{ backgroundColor: tweenedCSSColor }"
    class="example-7-color-preview"
  ></span>
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
    placeholder="Enter a color"
  >
  <button v-on:click="updateColor">Update</button>
  <p>Preview:</p>
  <span
    v-bind:style="{ backgroundColor: tweenedCSSColor }"
    class="example-7-color-preview"
  ></span>
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

## 동적 상태 트랜지션

Vue의 트랜지션 컴포넌트와 마찬가지로 데이터 백업 상태 트랜지션을 실시간으로 업데이트 할 수 있으므로 프로토 타이핑에 특히 유용합니다! 간단한 SVG 다각형을 사용해도, 변수를 조금씩 사용하기 전까지는 생각하기 어려운 많은 효과를 얻을 수 있습니다.

{% raw %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.18.5/TweenLite.min.js"></script>
<div id="svg-polygon-demo" class="demo">
  <svg width="200" height="200" class="demo-svg">
    <polygon :points="points" class="demo-polygon"></polygon>
    <circle cx="100" cy="100" r="90" class="demo-circle"></circle>
  </svg>
  <label>Sides: {{ sides }}</label>
  <input
    class="demo-range-input"
    type="range"
    min="3"
    max="500"
    v-model.number="sides"
  >
  <label>Minimum Radius: {{ minRadius }}%</label>
  <input
    class="demo-range-input"
    type="range"
    min="0"
    max="90"
    v-model.number="minRadius"
  >
  <label>Update Interval: {{ updateInterval }} milliseconds</label>
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

위 데모의 전체 코드는 [이 fiddle](https://jsfiddle.net/chrisvfritz/65gLu2b6/) 참조하십시오.

## 컴포넌트를 이용한 트랜지션 구성

여러 상태 트랜지션을 관리하면 Vue 인스턴스 또는 컴포넌트의 복잡성을 빠르게 높일 수 있습니다. 다행히도 많은 애니메이션을 전용 하위 컴포넌트로 추출 할 수 있습니다. 이전 예제의 숫자를 이용하는 애니메이션을 사용해 보겠습니다.

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
// 이 복잡한 트위닝 로직은 이제 응용 프로그램에서
// 애니메이션을 적용하려는 숫자 사이에서 재사용 할 수 있습니다.
// 또한 컴포넌트는보다 동적인 트랜지션 및 복잡한 트랜지션 전략을
// 구성할 수 있는 깨끗한 인터페이스를 제공합니다.
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

// 모든 Vue 인스턴스에서 모든 복잡성이 제거 되었습니다!
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

자식 컴포넌트 내에서, 이 페이지에서 다룬 트랜지션 전략과 Vue의 [기본 제공 트랜지션 시스템](transitions.html)에서 제공하는 트랜지션 전략을 조합하여 사용할 수 있습니다. 함께 사용할 할 수 있는 것에는 거의 제한이 없습니다.

## 디자인에 생명을 불어넣기

애니메이션을 추가하는 것은 생명을 불어 넣는 일 입니다. 불행하게도 디자이너가 만든 아이콘, 로고 및 마스코트들은 이미지나 정적 SVG입니다. 그래서 Github의 octocat, Twitter의 새 및 기타 로고들은 살아있는 것들과 유사하지만 살아 움직이지는 못합니다.

Vue가 도와줄 수 있습니다. SVG는 단순한 데이터일 뿐이므로 놀라거나, 생각할 때, 경고할때 어떻게 할 지 예시가 필요합니다. 그 다음 Vue는 데이터들을 트랜지션하여 환영페이지, 로딩 표시기, 알림을 감정적이고 매력적으로 만들 수 있습니다.

Sarah Drasner는 타이밍과 인터랙션 중심의 상태 변화를 조합하여 아래의 데모를 만들었습니다.

<p data-height="265" data-theme-id="light" data-slug-hash="YZBGNp" data-default-tab="result" data-user="sdras" data-embed-version="2" data-pen-title="Vue-controlled Wall-E" class="codepen">See the Pen <a href="https://codepen.io/sdras/pen/YZBGNp/">Vue-controlled Wall-E</a> by Sarah Drasner (<a href="https://codepen.io/sdras">@sdras</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
