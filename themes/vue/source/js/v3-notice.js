;(() => {
  if (!location.search.includes(`redirect=true`)) {
    return
  }

  const v3Url = document.body.dataset.v3Url
  if (!v3Url) {
    return
  }

  const hashRedirect =
    typeof __pageRedirects !== 'undefined' && __pageRedirects[location.hash]
  const finalUrl = hashRedirect || v3Url

  const preferV3 = localStorage.getItem('prefer-v3')
  if (preferV3 === 'true') {
    location.href = `https://vuejs.org${finalUrl}`
  } else if (preferV3 === 'false') {
    return
  }

  const today = new Date()
  const target = new Date('2022-05-07')
  const timeinmilisec = target.getTime() - today.getTime()
  const days = Math.ceil(timeinmilisec / (1000 * 60 * 60 * 24))

  const el = document.createElement('div')
  el.className = `v3-notice`
  el.innerHTML = `
<h3>Heads Up!</h3>
<p>
This page contains documentation for Vue 2. The Vue 3 version of the URL you are visiting is: <a id="v3-url" target="_blank"></a>.
</p>
<p>
The original URL, <code>https://vuejs.org<span id="original-url"></span></code>
will permanantly redirect to the v3 URL above after <b>May 7th, 2022 (${days} days from now).</b> If you need
future access to this v2 page, please use the v2-prefixed URL
<code>https://v2.vuejs.org<span id="current-url"></span></code>.
</p>
<p>
You can learn more about the Vue 2 -> Vue 3 default version switch in
<a target="_blank" href="https://blog.vuejs.org/posts/vue-3-as-the-new-default.html">this blog post</a>.
</p>
<p>
Would you like to start redirecting all v2 URLs to v3 right now?
</p>
<p>
<a class="go">Yes</a>
<a class="stay">Not yet</a>
</p>
  `.trim()

  const style = document.createElement('style')
  style.textContent = `
.v3-notice {
  position: fixed;
  top: 20px;
  --width: min(calc(100vw - 20px), 500px);
  left: calc(50vw - var(--width) / 2);
  width: var(--width);
  z-index: 9999;
  background-color: #f8f8f8;
  border: 2px solid #ffa500;
  border-radius: 8px;
  padding: 0 20px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.25);
}
.v3-notice a {
  color: #42b983;
  font-weight: bold;
}
.v3-notice .go, .v3-notice .stay {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.v3-notice .go {
  background-color: #42b983;
  color: #fff;
}
.v3-notice .stay {
  background-color: #ddd;
  color: #666;
}
.v3-notice code {
  background-color: transparent;
}
  `

  document.body.appendChild(style)
  document.body.appendChild(el)

  el.querySelector('#original-url').textContent = location.pathname
  el.querySelector('#current-url').textContent = location.pathname
  const v3Link = el.querySelector('#v3-url')

  v3Link.textContent =
    v3Link.href =
    el.querySelector('.go').href =
      `https://vuejs.org${finalUrl}`

  el.querySelector('.go').addEventListener('click', () => {
    localStorage.setItem('prefer-v3', 'true')
  })

  el.querySelector('.stay').addEventListener('click', () => {
    localStorage.setItem('prefer-v3', 'false')
    document.body.removeChild(el)
    document.body.removeChild(style)
    location.href = location.pathname
  })
})()
