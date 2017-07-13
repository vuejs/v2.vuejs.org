---
title: HackerNews 클론
type: examples
order: 12
---

> HN의 공식 Firebase API 인 Vue 2.0 + vue-router + vuex를 기반으로 서버 사이드 렌더링 기능을 갖춘 HackerNews 클론입니다.

{% raw %}
<div style="max-width:600px">
  <a href="https://github.com/vuejs/vue-hackernews-2.0" target="_blank">
    <img style="width:100%" src="/images/hn.png">
  </a>
</div>
{% endraw %}

> [Live Demo](https://vue-hn.now.sh/)
> Note: the demo may need some spin up time if nobody has accessed it for a certain period.
>
> [[Source](https://github.com/vuejs/vue-hackernews-2.0)]

## Features

- Server Side Rendering
  - Vue + vue-router + vuex working together
  - Server-side data pre-fetching
  - Client-side state & DOM hydration
- Single-file Vue Components
  - Hot-reload in development
  - CSS extraction for production
- Real-time List Updates with FLIP Animation

## Architecture Overview

<img width="973" alt="Hackernew clone architecture overview" src="/images/hn-architecture.png">
