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

  const el = document.createElement('div')
  el.className = `v3-notice`
  el.innerHTML = `
<h3>Heads Up!</h3>
<p>
This page contains documentation for Vue 2. The Vue 3 version of the URL you are visiting is: <a id="v3-url" target="_blank"></a>.
</p>
<p>
You can learn more about the Vue 2 -> Vue 3 default version switch in
<a target="_blank" href="https://blog.vuejs.org/posts/vue-3-as-the-new-default.html">this blog post</a>.
</p>
<p>
  <a class="stay">Stay on Vue 2 docs</a>
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

  el.querySelector('.stay').addEventListener('click', () => {
    document.body.removeChild(el)
  })

  const v3Link = el.querySelector('#v3-url')
  v3Link.textContent = v3Link.href = `https://vuejs.org${finalUrl}`
})()
