---
title: Vuex 0.6.x에서 1.0로 마이그레이션
type: guide
order: 603
---

> Vuex 2.0이 출시되었지만이 가이드에서는 1.0으로의 마이그레이션만 다룹니다. 오타 아닌가요? 또한 Vuex 1.0과 2.0이 동시에 출시 된 것처럼 보입니다. 어떻게 된거죠? Vue 2.0과 호환되는 것은 무엇입니까?

Vuex 1.0 및 2.0:

- Vue 1.0 and 2.0 둘다 완전히 지원합니다.
- 가까운 미래까지는 유지 됩니다.

하지만 이들은 약간 다른 타겟 사용자를 가지고 있습니다.

__Vuex 2.0__은 새로운 프로젝트를 시작하거나 클라이언트측 상태 관리의 최신에 있기를 원하는 사람들을 위해 API의 근본적인 재 설계 및 단순화를 하였습니다. __이 마이그레이션 가이드에서는 다루지 않습니다__ 자세한 내용은 [Vuex 2.0 문서](https://vuex.vuejs.org/en/index.html)를 참조하십시오.

__Vuex 1.0__ 은 대부분 하위 버전과 호환되므로 업그레이드하는 데 필요한 변경 사항은 거의 없습니다. 기존 코드베이스가 큰 사람들이나 Vue 2.0으로의 가장 매끄러운 업그레이드 경로를 원하는 사람들에게 권장됩니다. 이 가이드는 해당 프로세스를 용이하게하기 위해 작성된 것이지만 마이그레이션 참고 사항만 포함합니다. 전체 사용법 안내는 [Vuex 1.0 문서](https://github.com/vuejs/vuex/tree/1.0/docs/en)를 참조하십시오.

## `store.watch` 와 문자열 속성 패스 <sup>교체됨</sup>

`store.watch` 는 이제 함수만 허용됩니다. 예를 들어 아래 처럼 바꾸어야 합니다.

``` js
store.watch('user.notifications', callback)
```

아래처럼 사용하세요

``` js
store.watch(
  // 변경이 완료되었습니다...
  function (state) {
    return state.user.notifications
  },
  // 아래 콜백을 실행하세요
  callback
)
```

이렇게 하면 반응성 속성을 보다 완벽하게 제어 할 수 있습니다.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 문자열로 <code>store.watch</code>가 첫번째 전달인자로 사용되는 예를 찾아보십시오. </p>
</div>
{% endraw %}

## Store의 Event Emitter <sup>제거</sup>

store 인스턴스는 더이상 event emitter 인터페이스 (`on`, `off`, `emit`)를 노출하지 않습니다. 이전에 store를 전역 이벤트 버스로 사용했다면 마이그레이션 지침 [이 섹션을 보세요](migration.html#dispatch-and-broadcast-removed)을 참조하십시오.

이 인터페이스를 사용하여 store 자체에서 emit 된 이벤트(예 `store.on('mutation', callback)`)를 보지않고 `store.subscribe`라는 새로운 메소드가 도입되었습니다. 플러그인 내부의 일반적인 사용법은 다음과 같습니다.

``` js
var myPlugin = store => {
  store.subscribe(function (mutation, state) {
    // 무언가 하세요...
  })
}

```

[the plugins docs](https://github.com/vuejs/vuex/blob/1.0/docs/en/plugins.md)에서 더 자세한 내용을 보세요.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 <code>store.on</code>, <code>store.off</code> 및 <code>store.emit</code>의 예를 찾아보십시오.</p>
</div>
{% endraw %}

## 미들웨어 <sup>변경</sup>

미들웨어는 플러그인에 의해 변경되었습니다. 플러그인은 store를 유일한 전달인자로 받는 함수이며 store에서 mutation 이벤트를 받을 수 있습니다.

``` js
const myPlugins = store => {
  store.subscribe('mutation', (mutation, state) => {
    // 무언가 하세요...
  })
}
```

[the plugins docs](https://github.com/vuejs/vuex/blob/1.0/docs/en/plugins.md)에서 더 자세한 내용을 보세요.

{% raw %}
<div class="upgrade-path">
  <h4>업그레이드 방법</h4>
  <p>코드베이스에서 <a href="https://github.com/vuejs/vue-migration-helper">마이그레이션 도우미</a>를 실행하여 상점에서 <code>middlewares</code> 옵션의 예를 찾으십시오.</p>
</div>
{% endraw %}
