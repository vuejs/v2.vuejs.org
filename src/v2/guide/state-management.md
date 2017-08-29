---
title: 상태 관리
type: guide
order: 502
---

## 공식 Flux-유사 구현

대규모 응용 프로그램은 여러 컴포넌트에 분산되어있는 여러 상태와 그 상호 작용으로 인해 복잡해집니다. 이 문제를 해결하기 위해 Vue는 Elm에서 영감을 얻은 상태 관리 라이브러리 인 [vuex](https://github.com/vuejs/vuex)를 제공합니다. 또한 [vue-devtools](https://github.com/vuejs/vue-devtools)를 사용한다면 설정에 따로 시간을 보내지 않아도 됩니다.

### React 개발자를 위한 안내

만약 당신이 React로 부터 왔다면, vuex가 그 생태계에서 가장 인기있는 Flux 구현 인 [redux](https://github.com/reactjs/redux)와 어떻게 비교되는지 궁금할 것입니다. Redux는 실제로 뷰 레이어(view-layer)에 무관하므로 몇 가지 [간단한 바인딩](https://github.com/egoist/revue)을 해준다면 Vue에서도 Redux를 쉽게 사용할 수 있습니다. Vuex가 Redux와 다른 점이라면 Vue app에 대해서 알고 있다는 점입니다. 이를 통해 더 직관적인 API와 향상된 개발경험을 Vue에 통합할 수 있습니다.

## 간단한 상태 관리 시작하기

Vue 응용 프로그램에서 가장 근본이 되는 것은 원시 `data` 객체라는 것을 종종 간과하게됩니다. Vue 인스턴스는 단순히 그것에 대한 액세스를 프록시합니다. 따라서 여러 인스턴스에서 공유해야하는 상태가 있으면 ID로 간단히 공유 할 수 있습니다.

``` js
const sourceOfTruth = {}

const vmA = new Vue({
  data: sourceOfTruth
})

const vmB = new Vue({
  data: sourceOfTruth
})
```

이제 `sourceOfTruth`가 변형 될 때마다`vmA`와`vmB`가 자동으로 뷰를 갱신합니다. 이 인스턴스들 각각의 하위 컴포넌트들은`this.$root.$data`를 통해 접근 할 수 있습니다. 우리는 현재 단일 소스를 가지고 있지만 디버깅은 악몽 같을 것입니다. 모든 데이터는 흔적을 남기지 않고 언제든지 앱의 일부에서 변경할 수 있습니다.

이 문제를 해결하기 위해 간단한 **store 패턴** 을 사용할 수 있습니다.

``` js
var store = {
  debug: true,
  state: {
    message: 'Hello!'
  },
  setMessageAction (newValue) {
    if (this.debug) console.log('setMessageAction triggered with', newValue)
    this.state.message = newValue
  },
  clearMessageAction () {
    if (this.debug) console.log('clearMessageAction triggered')
    this.state.message = ''
  }
}
```

store의 상태를 변경시키는 모든 조치는 store 자체에 들어 있습니다. 이러한 유형의 중앙 집중식 상태 관리는 어떤 유형의 돌연변이가 발생할 수 있는지, 어떻게 유발되는지를보다 쉽게 이해할 수있게 합니다. 무언가가 잘못 될 경우 버그에 이르는 일에 대한 로그가 생성됩니다.

또한 각 인스턴스 / 컴포넌트는 여전히 자체적으로 비공개 상태를 가지고 관리할 수 있습니다.

``` js
var vmA = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})

var vmB = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})
```

![상태 관리](/images/state.png)

<p class="tip">액션에서 원래 상태 객체를 절대 교체하면 안된다는 점에 유의해야 합니다. 컴포넌트와 저장소는 변이를 관찰하기 위해 같은 객체에 대한 참조를 공유해야 합니다.</p>

컴포넌트가 store에 속한 상태를 직접 변이 시킬 수 없지만 store에 조작을 수행하도록 알리는 이벤트를 보내야하는 컨벤션을 계속 개발할 때 결국 [Flux](https://facebook.github.io/flux) 아키텍처에 다다르게 됩니다. 이 컨벤션의 이점은 store에서 발생하는 모든 상태 변이를 기록하고 mutation 로그, 스냅 샷 및 히스토리 되돌리기 / 시간 여행과 같은 고급 디버깅 도우미를 구현할 수 있다는 것입니다.

이것은 우리에게 [vuex](https://github.com/vuejs/vuex)에 대한 완전함을 가져다 줍니다. 이제 지금까지 읽은 것을 시험해 볼 시간입니다!
