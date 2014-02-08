(function () {

    var xhr = new XMLHttpRequest()
    xhr.open('GET', 'todomvc-benchmark/results.json')
    xhr.onload = function () {
        drawChart(JSON.parse(xhr.responseText))
    }
    xhr.send()

    function drawChart (data) {

        data = data[data.length - 1]

        var container = document.getElementById('benchmark-results')
        data.Average = calcAverage(data)
        for (var key in data) {
            if (key.charAt(0) === '_') {
                document.getElementById(key).textContent = data[key]
                continue
            }
            container.appendChild(buildEntry(key, data[key].version, data[key].data))
        }

        function buildEntry (browser, version, data) {
            var li = document.createElement('LI')
            li.textContent = browser + ' ' + (version || '')
            li.appendChild(buildList(data))
            return li
        }

        function buildList (data) {
            var list = document.createElement('UL'),
                li, time, max = 0, min = Infinity
            for (var key in data) {
                time = data[key]
                li = document.createElement('LI')
                li.innerHTML =
                    '<span class="framework">' + key + '</span>' +
                    '<span class="time">' + time.toFixed(2) + 'ms</span>' +
                    '<span class="bar" data-time="' + time + '"><span class="inner"></span></span>'
                list.appendChild(li)
                if (time > max) max = time
                if (time < min) min = time
            }
            var bars = list.querySelectorAll('.bar'),
                i = bars.length
            while (i--) {
                var bar = bars[i],
                    t = bar.getAttribute('data-time'),
                    pct = ~~(t / max * 100)
                if (t == min) bar.className = 'bar min'
                bar.querySelector('.inner').style.width = pct + '%'
            }
            return list
        }

        function calcAverage (data) {
            var output = {}, numBrowsers = 0
            for (var browser in data) {
                if (browser.charAt(0) === '_') continue
                numBrowsers++
                for (var framework in data[browser].data) {
                    output[framework] = output[framework] || 0
                    output[framework] += data[browser].data[framework]
                }
            }
            for (var framework in output) {
                output[framework] = output[framework] / numBrowsers
            }
            return { data: output }
        }
    }
})()