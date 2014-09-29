(function () {

  var each = [].forEach
  var main = document.getElementById('main')
  var doc = document.documentElement
  var body = document.body
  var header = document.getElementById('header')
  var menu = document.querySelector('.sidebar')
  var menuToggle = document.querySelector('.sidebar .toggle')
  var content = document.querySelector('.content')

  if (!menu) return

  menuToggle.addEventListener('click', function () {
    menu.classList.toggle('open')
  })

  // build sidebar
  var allLinks = []
  var currentPageAnchor = menu.querySelector('.sidebar-link.current')
  var sectionContainer = document.createElement('ul')
  sectionContainer.className = 'menu-sub'
  currentPageAnchor.parentNode.appendChild(sectionContainer)
  var h2s = content.querySelectorAll('h2')
  if (h2s.length) {
    each.call(h2s, function (h) {
      sectionContainer.appendChild(makeLink(h))
      var h3s = collectH3s(h)
      allLinks.push(h)
      allLinks.push.apply(allLinks, h3s)
      if (h3s.length) {
        sectionContainer.appendChild(makeSubLinks(h3s))
      }
    })
  } else {
    h2s = content.querySelectorAll('h3')
    each.call(h2s, function (h) {
      sectionContainer.appendChild(makeLink(h))
      allLinks.push(h)
    })
  }

  // init smooth scroll
  smoothScroll.init({
    speed: 400
  })

  var animating = false
  sectionContainer.addEventListener('click', function (e) {
    e.preventDefault()
    if (e.target.classList.contains('section-link')) {
      setActive(e.target)
      animating = true
      setTimeout(function () {
        animating = false
      }, 400)
    }
  }, true)

  // listen for scroll event to do positioning & highlights
  window.addEventListener('scroll', updateSidebar)
  window.addEventListener('resize', updateSidebar)

  function updateSidebar () {
    var top = doc && doc.scrollTop || body.scrollTop
    if (top > header.offsetHeight) {
      main.className = 'fix-sidebar'
    } else {
      main.className = ''
    }
    if (animating) return
    var last
    for (var i = 0; i < allLinks.length; i++) {
      var link = allLinks[i]
      if (link.offsetTop > top) {
        if (!last) last = link
        break
      } else {
        last = link
      }
    }
    if (last)
    setActive(last.id)
  }

  function makeLink (h) {
    var link = document.createElement('li')
    link.innerHTML =
      '<a class="section-link" data-scroll href="#' + h.id + '">' +
        h.textContent.replace(/\(.*\)$/, '') +
      '</a>'
    return link
  }

  function collectH3s (h) {
    var h3s = []
    var next = h.nextSibling
    while (next && next.tagName !== 'H2') {
      if (next.tagName === 'H3') {
        h3s.push(next)
      }
      next = next.nextSibling
    }
    return h3s
  }

  function makeSubLinks (h3s) {
    var container = document.createElement('ul')
    h3s.forEach(function (h) {
      container.appendChild(makeLink(h))
    })
    return container
  }

  function setActive (id) {
    var previousActive = menu.querySelector('.section-link.active')
    var currentActive = typeof id === 'string'
      ? menu.querySelector('.section-link[href="#' + id + '"]')
      : id
    if (currentActive !== previousActive) {
      if (previousActive) previousActive.classList.remove('active')
      currentActive.classList.add('active')
    }
  }

})()