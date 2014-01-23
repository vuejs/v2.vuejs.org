(function () {

    var main = document.getElementById('main'),
        doc = document.documentElement,
        body = document.body,
        header = document.getElementById('header'),
        menu = document.querySelector('.sidebar'),
        menuToggle = document.querySelector('.sidebar .toggle')

    if (menu) {
        window.addEventListener('scroll', function () {
            var top = doc && doc.scrollTop || body.scrollTop
            if (top > header.offsetHeight) {
                main.className = 'fix-sidebar'
            } else {
                main.className = ''
            }
        })
        menuToggle.addEventListener('click', function () {
            menu.classList.toggle('open')
        })
    }

    if (PAGE_TYPE === 'api') {
        var h1 = document.querySelector('h1'),
            h3s = document.querySelectorAll('h3'),
            list = document.createElement('ul'),
            inner = '',
            replaceRE = /\(.*$/
        for (var i = 0, l = h3s.length; i < l; i++) {
            var h3 = h3s[i]
            inner += '<li><a href="#' + h3.id + '">' +
                    h3.textContent.replace(replaceRE, '') +
                '</a></li>'
        }
        list.innerHTML = inner
        h1.parentNode.insertBefore(list, h1.nextSibling)
    }

})()