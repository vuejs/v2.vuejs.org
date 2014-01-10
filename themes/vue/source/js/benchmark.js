(function () {
    var data = {
        "Chrome": {
            "version": 32,
            "data": {
                "Vue": 467.46250000578584,
                "Backbone": 887.9549000077532,
                "Knockout": 423.5067999965395,
                "Ember": 2570.5534000022453,
                "Angular": 2097.935900001903,
                "React": 1883.75129999622,
                "Om": 496.92529999592807
            }
        },
        "Firefox": {
            "version": 26,
            "data": {
                "Vue":668.3608821000048,
                "Backbone":864.388752700001,
                "Knockout": 613.008195500002,
                "Ember":3849.261526499997,
                "Angular":2082.7088436999907,
                "React":1390.0224192000073,
                "Om":621.8296304999991
            }
        },
        "Safari": {
            "version": 7,
            "data": {
                "Vue": 257.9,
                "Backbone": 869.7,
                "Knockout": 560.6,
                "Ember": 1981.4,
                "Angular": 1702.7,
                "React": 983.8,
                "Om": 537.7
            }
        }
    }
    var container = document.getElementById('benchmark-results')
    data.Average = calcAverage(data)
    for (var key in data) {
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
                t = bar.dataset.time,
                pct = ~~(t / max * 100)
            if (t == min) bar.className = 'bar min'
            bar.querySelector('.inner').style.width = pct + '%'
        }
        return list
    }
    function calcAverage (data) {
        var output = {},
            n = Object.keys(data).length
        for (var browser in data) {
            for (var framework in data[browser].data) {
                output[framework] = output[framework] || 0
                output[framework] += data[browser].data[framework]
            }
        }
        for (var framework in output) {
            output[framework] = output[framework] / n
        }
        return { data: output }
    }
})()