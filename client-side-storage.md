---
title: Client-Side Storage
type: cookbook
order: 11
---

## 기본 예제

클라이언트 사이드 스토리지를 사용하면 응용프로그램의 성능을 빠르게 향상시킬 수 있습니다. 브라우저 내에 데이터를 저장함으로써, 매번 서버에서 데이터를 가져오는 일을 줄일 수 있습니다. 특히 이 전략은 오프라인 환경에서 유용하지만, 서버에 접속할 수 있는 온라인 유저에게도 효과적입니다. [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies), [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) (기술적으로는 “웹 스토리지”), [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), [WebSQL](https://www.w3.org/TR/webdatabase/)(지원 중지된 방법으로, 새 프로젝트에서는 쓰면 안됨)으로 클라이언트 사이드 스토리지를 구성할 수 있습니다.

이번 실습에서는 가장 간단한 스토리지 메커니즘으로 구성된 Local Storage를 이용할 것입니다. Local Storage는 키/값 형태로 데이터를 저장합니다. 이러한 구조로 인해 간단한 값만 저장할 수 있겠지만, 데이터를 JSON encode, decode한다면 복잡한 값도 저장할 수 있습니다. 일반적으로 Local Storage는 사용자 기본 설정, 양식 데이터와 같이 지속적으로 유지해야하는 작은 데이터 세트에 사용하는 것이 적합합니다. 복잡하고 큰 데이터들을 저장하기 위해서는 일반적으로 IndexedDB를 활용하는 것이 적합합니다.

간단한 양식으로 시작해봅시다.

``` html
<div id="app">
  My name is <input v-model="name">
</div>
```

위 예제에는 `name`이라는 이름의 Vue 값에 묶인 양식 필드가 있습니다. 아래에서 자바스크립트를 보시죠.

``` js
const app = new Vue({
  el: '#app',
  data: {
    name: ''
  },
  mounted() {
    if (localStorage.name) {
      this.name = localStorage.name;
    }
  },
  watch: {
    name(newName) {
      localStorage.name = newName;
    }
  }
});
```

`mounted`와 `watch`에 집중하세요. Local Storage에서 값을 불러오기 위해 `mounted`를 사용하였습니다. Local Storage에 데이터를 입력하기 위해 `name` 값의 변경을 주시하면서 즉시 반영하였습니다.

아래에서 직접 실행하실 수 있습니다.

<p data-height="265" data-theme-id="0" data-slug-hash="KodaKb" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="testing localstorage" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/KodaKb/">testing localstorage</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

양식에 아무것이나 입력해보신 뒤 페이지를 새로고침해보세요. 이전에 입력했던 데이터가 자동으로 나타남을 알 수 있습니다. 웹브라우저에서 클라이언트 사이드 스토리지 분석을 위한 우수한 툴이 제공된다는 점을 잊지마세요. 아래 사진은 파이어폭스의 개발자 분석 도구입니다.
(파이어폭스: F12 → 저장소 → Local Storage → 웹사이트 주소)
(구글 크롬: F12 → Application → Storage → Local Storage → 웹사이트 주소)
(Edge: F12 → 저장소 → 로컬 저장소 → 웹사이트 주소)

![Storage devtools in Firefox](/images/devtools-storage.png)

그리고 아래 사진은 크롬에서의 화면입니다.

![Storage devtools in Chrome](/images/devtools-storage-chrome.png)

마지막으로 Edge에서의 화면입니다.

![Storage devtools in Edge](/images/devtools-storage-edge.png)

<p class="tip">개발자 도구를 이용하여 Storage에 저장된 값을 빠르게 변경하거나 제거할 수 있습니다. 이 도구들을 테스트 간에 유용하게 활용할 수 있습니다.</p>

값 변경을 즉시 Storage에 반영하는 것이 적절하지 않을 수 있습니다. 더 고급 예제를 살펴보도록 하겠습니다. 첫번째로 양식을 재작성하였습니다.

``` html
<div id="app">
  <p>
    My name is <input v-model="name">
    and I am <input v-model="age"> years old.
  </p>
  <p>
    <button @click="persist">Save</button>
  </p>
</div>
```

이제 (Vue 인스턴스에 묶인) 필드가 두 개가 되었을뿐만 아니라 `persist` 메소드가 포함된 버튼이 추가되었습니다. 자바스크립트 코드를 보시죠.

``` js
const app = new Vue({
  el: '#app',
  data: {
    name: '',
    age: 0
  },
  mounted() {
    if (localStorage.name) {
      this.name = localStorage.name;
    }
    if (localStorage.age) {
      this.age = localStorage.age;
    }
  },
  methods: {
    persist() {
      localStorage.name = this.name;
      localStorage.age = this.age;
      console.log('now pretend I did more stuff...');
    }
  }
})
```

이전과 같이, 지속된 데이터를 가져오기 위해서 `mounted`가 사용됩니다. 하지만 이전과 달리 버튼을 클릭해야만 데이터가 유지됩니다. 이 과정을 통해 값을 저장하기 전에 데이터를 검증하거나 변환할 수 있게 되었습니다. 또한 값이 저장된 시각을 남길 수도 있습니다. 이러한 메타데이터를 참고하면, `mounted`에서 값을 다시 저장해야하는지 유무에 대해서 결정할 수 있습니다. 아래에서 직접 실행하실 수 있습니다.

<p data-height="265" data-theme-id="0" data-slug-hash="rdOjLN" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="testing localstorage 2" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/rdOjLN/">testing localstorage 2</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## 복잡한 값 활용하기

상술한 바와 같이, Local Storage는 간단한 값에 사용할 수 있습니다. 객체나 배열과 같은 복잡한 값을 저장하기 위해서는 값을 JSON 형태로 serialize, deserialize해야합니다. 아래에 고양이 배열(현존 최고의 배열입니다)을 유지하는 더 발전된 예제가 있습니다.

``` html
<div id="app">
  <h2>Cats</h2>
  <div v-for="(cat, n) in cats">
    <p>
      <span class="cat">{{ cat }}</span>
      <button @click="removeCat(n)">Remove</button>
    </p>
  </div>

  <p>
    <input v-model="newCat">
    <button @click="addCat">Add Cat</button>
  </p>
</div>
```

이 "앱"은 상단에 고양이의 목록(고양이 제거 버튼을 포함)과 하단에 고양이를 추가하기 위한 작은 양식으로 이루어져있습니다. 자바스크립트 코드를 보시죠.

``` js
const app = new Vue({
  el: '#app',
  data: {
    cats: [],
    newCat: null
  },
  mounted() {
    if (localStorage.getItem('cats')) {
      try {
        this.cats = JSON.parse(localStorage.getItem('cats'));
      } catch(e) {
        localStorage.removeItem('cats');
      }
    }
  },
  methods: {
    addCat() {
      // ensure they actually typed something
      if (!this.newCat) {
        return;
      }

      this.cats.push(this.newCat);
      this.newCat = '';
      this.saveCats();
    },
    removeCat(x) {
      this.cats.splice(x, 1);
      this.saveCats();
    },
    saveCats() {
      const parsed = JSON.stringify(this.cats);
      localStorage.setItem('cats', parsed);
    }
  }
})
```

이 어플리케이션에서는 Local Storage에 “직접” 접근하지 않는 대신 API를 사용하였습니다. 두 방법 모두 작동하지만, API를 사용한 방법이 일반적으로 선호됩니다. 이제 `mounted`에서는 값을 가져오면서 JSON 값을 파싱해야합니다. 파싱이 이루어지지 않으면 데이터가 손상된 것으로 간주하여 삭제합니다.(클라이언트 사이드 스토리지는 언제나 유저가 자유롭게 접근하여 수정할 수 있음을 잊지마세요.)

고양이 배열을 다루기 위한 세 개의 메소드가 있습니다. `addCat`, `removeCat`은 `this.cats`에 있는 “살아있는” Vue 데이터를 처리합니다. 그리고는 `saveCats` 메소드를 실행시켜 데이터를 serialize한 뒤 데이터를 유지시킵니다. 아래에서 직접 실행하실 수 있습니다.

<p data-height="265" data-theme-id="0" data-slug-hash="qoYbyW" data-default-tab="js,result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="localstorage, complex" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/qoYbyW/">localstorage, complex</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## 대체 패턴

Local Storage API는 비교적 간단하지만, 많은 어플리케이션이 필요로하는 기본 기능들을 모두 제공하지는 않습니다. 다음의 플러그인들은 Local Storage의 접근을 래핑하여 더 사용하기 쉽게 해줄뿐만 아니라, 기본 값과 같은 기능을 제공합니다.

* [vue-local-storage](https://github.com/pinguinjkeke/vue-local-storage)
* [vue-reactive-storage](https://github.com/ropbla9/vue-reactive-storage)
* [vue2-storage](https://github.com/yarkovaleksei/vue2-storage)

## 마무리

웹브라우저가 서버 상태유지 시스템을 대체할 날은 없겠지만, 데이터를 로컬에 캐싱하는 여러가지 방법을 사용함으로써 어플리케이션의 성능을 크게 향상시킬뿐만 아니라, Vue.js를 더욱 활용도 높게 사용할 수 있습니다.
