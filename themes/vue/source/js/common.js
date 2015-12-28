(function () {

  initSearch()
  initMobileMenu()
  if (PAGE_TYPE) {
    initVersionSelect()
    initSubHeaders()
  }

  /**
   * Swiftype search box
   */

  function initSearch () {
    (function(w,d,t,u,n,s,e){w['SwiftypeObject']=n;w[n]=w[n]||function(){
    (w[n].q=w[n].q||[]).push(arguments);};s=d.createElement(t);
    e=d.getElementsByTagName(t)[0];s.async=1;s.src=u;e.parentNode.insertBefore(s,e);
    })(window,document,'script','//s.swiftypecdn.com/install/v2/st.js','_st');

    _st('install','HgpxvBc7pUaPUWmG9sgv','2.0.0');
  }

  /**
   * Mobile burger menu button for toggling sidebar
   */

  function initMobileMenu () {
    var mobileBar = document.getElementById('mobile-bar')
    var sidebar = document.querySelector('.sidebar')
    var menuButton = mobileBar.querySelector('.menu-button')

    menuButton.addEventListener('click', function () {
      sidebar.classList.toggle('open')
    })

    document.body.addEventListener('click', function (e) {
      if (e.target !== menuButton && !sidebar.contains(e.target)) {
        sidebar.classList.remove('open')
      }
    })
  }

  /**
   * Doc version select
   */

  function initVersionSelect () {
    // version select
    document.querySelector('.version-select').addEventListener('change', function (e) {
      var version = e.target.value
      if (version.indexOf('1.') !== 0) {
        version = version.replace('.', '')
        var section = window.location.pathname.match(/\/(\w+?)\//)[1]
        window.location.assign('http://' + version + '.vuejs.org/' + section + '/')
      } else {
        // TODO when 1.x is out
      }
    })
  }

  /**
   * Sub headers in sidebar
   */

  function initSubHeaders () {
    var each = [].forEach
    var main = document.getElementById('main')
    var header = document.getElementById('header')
    var sidebar = document.querySelector('.sidebar')
    var content = document.querySelector('.content')

    // build sidebar
    var currentPageAnchor = sidebar.querySelector('.sidebar-link.current')
    var isAPI = document.querySelector('.content').classList.contains('api')
    if (currentPageAnchor || isAPI) {
      var allHeaders = []
      var sectionContainer
      if (isAPI) {
        sectionContainer = document.querySelector('.menu-root')
      } else {
        sectionContainer = document.createElement('ul')
        sectionContainer.className = 'menu-sub'
        currentPageAnchor.parentNode.appendChild(sectionContainer)
      }
      var headers = content.querySelectorAll('h2')
      if (headers.length) {
        each.call(headers, function (h) {
          sectionContainer.appendChild(makeLink(h))
          var h3s = collectH3s(h)
          allHeaders.push(h)
          allHeaders.push.apply(allHeaders, h3s)
          if (h3s.length) {
            sectionContainer.appendChild(makeSubLinks(h3s, isAPI))
          }
        })
      } else {
        headers = content.querySelectorAll('h3')
        each.call(headers, function (h) {
          sectionContainer.appendChild(makeLink(h))
          allHeaders.push(h)
        })
      }

      var animating = false
      sectionContainer.addEventListener('click', function (e) {
        e.preventDefault()
        if (e.target.classList.contains('section-link')) {
          sidebar.classList.remove('open')
          setActive(e.target)
          animating = true
          setTimeout(function () {
            animating = false
          }, 400)
        }
      }, true)

      // make links clickable
      allHeaders.forEach(makeHeaderClickable)

      // init smooth scroll
      smoothScroll.init({
        speed: 400,
        offset: window.innerWidth > 720
          ? 40
          : 58
      })
    }

    // listen for scroll event to do positioning & highlights
    window.addEventListener('scroll', updateSidebar)
    window.addEventListener('resize', updateSidebar)

    function updateSidebar () {
      var doc = document.documentElement
      var top = doc && doc.scrollTop || document.body.scrollTop
      var headerHeight = header.offsetHeight
      if (top > headerHeight) {
        main.className = 'fix-sidebar'
      } else {
        main.className = ''
      }
      if (animating || !allHeaders) return
      var last
      for (var i = 0; i < allHeaders.length; i++) {
        var link = allHeaders[i]
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
      var text = h.textContent.replace(/\(.*\)$/, '')
      // make sure the ids are link-able...
      h.id = h.id
        .replace(/_28.*$/, '') // remove anything after brackets
        .replace(/_24/g, '') // remove $
      link.innerHTML =
        '<a class="section-link" data-scroll href="#' + h.id + '">' +
          text +
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

    function makeSubLinks (h3s, small) {
      var container = document.createElement('ul')
      if (small) {
        container.className = 'menu-sub'
      }
      h3s.forEach(function (h) {
        container.appendChild(makeLink(h))
      })
      return container
    }

    function setActive (id) {
      var previousActive = sidebar.querySelector('.section-link.active')
      var currentActive = typeof id === 'string'
        ? sidebar.querySelector('.section-link[href="#' + id + '"]')
        : id
      if (currentActive !== previousActive) {
        if (previousActive) previousActive.classList.remove('active')
        currentActive.classList.add('active')
      }
    }

    function makeHeaderClickable (link) {
      var wrapper = document.createElement('a')
      wrapper.href = '#' + link.id
      wrapper.setAttribute('data-scroll', '')
      link.parentNode.insertBefore(wrapper, link)
      wrapper.appendChild(link)
    }
  }
})()
