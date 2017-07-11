---
title: Rencontrer l'équipe
type: guide
order: 31
---

{% raw %}
<script id="vuer-profile-template" type="text/template">
  <div class="vuer">
    <div class="avatar">
      <img v-if="profile.github"
        :src="'https://github.com/' + profile.github + '.png'"
        :alt="profile.name" width=80 height=80>
    </div>
    <div class="profile">
      <h3>
        {{ profile.name }}
        <sup v-if="profile.title" v-html="profile.title"></sup>
      </h3>
      <dl>
        <template v-if="profile.reposOfficial">
          <dt>Cœur de Vue</dt>
          <dd>
            <ul>
              <li v-for="dépôt à profile.reposOfficial">
                <a :href="githubUrl('vuejs', repo)" target=_blank>{{ repo }}</a>
              </li>
            </ul>
          </dd>
        </template>
        <template v-if="profile.github && profile.reposPersonal">
          <dt>Écosystème</dt>
          <dd>
            <ul>
              <li v-for="dépôt à profile.reposPersonal">
                <a :href="githubUrl(profile.github, repo)" target=_blank>{{ repo }}</a>
              </li>
            </ul>
          </dd>
        </template>
        <template v-if="profile.work">
          <dt>
            <i class="fa fa-briefcase"></i>
            <span class="sr-only">Travail</span>
          </dt>
          <dd v-html="workHtml"></dd>
        </template>
        <span v-if="profile.distanceInKm" class="distance">
          <dt>
            <i class="fa fa-map-marker"></i>
            <span class="sr-only">Distance</span>
          </dt>
          <dd>
            À
            <span
              v-if="profile.distanceInKm <= 150"
              :title="profile.name + ' est assez proche pour que vous puissiez vous rencontrer.'"
              class="user-match"
            >{{ textDistance }} de</span>
            <template v-else>{{ textDistance }} de</template>
            {{ profile.city }}
          </dd>
        </span>
        <template v-else-if="profile.city">
          <dt>
            <i class="fa fa-map-marker"></i>
            <span class="sr-only">Ville</span>
          </dt>
          <dd>
            {{ profile.city }}
          </dd>
        </template>
        <template v-if="profile.languages">
          <dt>
            <i class="fa fa-globe"></i>
            <span class="sr-only">Langues</span>
          </dt>
          <dd v-html="languageListHtml" class="language-list"></dd>
        </template>
        <template v-if="profile.links">
          <dt>
            <i class="fa fa-link"></i>
            <span class="sr-only">Liens</span>
          </dt>
          <dd>
            <ul>
              <li v-for="link in profile.links">
                <a :href="link" target=_blank>{{ minimizeLink(link) }}</a>
              </li>
            </ul>
          </dd>
        </template>
        <footer v-if="profile.github || profile.twitter" class="social">
          <a class=github v-if="profile.github" :href="githubUrl(profile.github)">
            <i class="fa fa-github"></i>
            <span class="sr-only">GitHub</span>
          </a>
          <a class=twitter v-if="profile.twitter" :href="'https://twitter.com/' + profile.twitter">
            <i class="fa fa-twitter"></i>
            <span class="sr-only">Twitter</span>
          </a>
        </footer>
      </dl>
    </div>
  </div>
</script>

<div id="team-members">
  <div class="team">

    <h2 id="the-core-team">
      Équipe principale
      <button
        v-if="geolocationSupported && !userPosition"
        @click="getUserPosition"
        :disabled="isSorting"
        class="sort-by-distance-button"
      >
        <i
          v-if="isSorting"
          class="fa fa-refresh rotating-clockwise"
        ></i>
        <template v-else>
          <i class="fa fa-map-marker"></i>
          <span>qui est près de moi</span>
        </template>
      </button>
    </h2>

    <p v-if="errorGettingLocation" class="tip">
      N'a pas trouver de lieu.
    </p>

    <p>
      Le développement de Vue et son écosystème est assuré par une équipe internationale. Certains d'entre eux ont choisi d'apparaître ci-dessous.
    </p>

    <p v-if="userPosition" class="success">
      L'équipe principale a été triée en fonction de la distance qui vous sépare.
    </p>

    <vuer-profile
      v-for="profile in sortedTeam"
      :key="profile.github"
      :profile="profile"
    ></vuer-profile>
  </div>

  <div class="team">
    <h2 id="community-partners">
      Partenaires de la communauté
      <button
        v-if="geolocationSupported && !userPosition"
        @click="getUserPosition"
        :disabled="isSorting"
        class="sort-by-distance-button"
      >
        <i
          v-if="isSorting"
          class="fa fa-refresh rotating-clockwise"
        ></i>
        <template v-else>
          <i class="fa fa-map-marker"></i>
          <span>qui est près de moi</span>
        </template>
      </button>
    </h2>

    <p v-if="errorGettingLocation" class="tip">
      N'a pas trouver de lieu.
    </p>

    <p>
      Certains membres de la communauté Vue l'ont tellement enrichie, qu'ils méritent une mention spéciale. Nous avons développé une relation plus intime avec ces partenaires clés, en nous coordonnant souvent sur les nouvelles fonctionnalités et les nouveautés.
    </p>

    <p v-if="userPosition" class="success">
      Les partenaires de la communauté ont été triés en fonction de la distance qui vous sépare.
    </p>

    <vuer-profile
      v-for="profile in sortedPartners"
      :key="profile.github"
      :profile="profile"
    ></vuer-profile>
  </div>
</div>

<script>
(function () {
  var cityCoordsFor = {
    'London, UK': [51.507351, -0.127758],
    'Wrocław, Poland': [51.107885, 17.038538],
    'Dubna, Russia': [56.732020, 37.166897],
    'Tokyo, Japan': [35.689487, 139.691706],
    'Lyon, France': [45.764043, 4.835659],
    'Mannheim, Germany': [49.487459, 8.466039],
    'Chengdu, China': [30.572815, 104.066801],
    'Chongqing, China': [29.431586, 106.912251],
    'Thessaloniki, Greece': [40.640063, 22.944419],
    'Paris, France': [48.856614, 2.352222],
    'Bordeaux, France': [44.837789, -0.579180],
    'Lansing, MI, USA': [42.732535, -84.555535],
    'Jersey City, NJ, USA': [40.728157, -74.558716],
    'Hangzhou, China': [30.274084, 120.155070],
    'Bangalore, India': [12.971599, 77.594563],
    'Kingston, Jamaica': [18.017874, -76.809904],
    'Tehran, Iran': [35.689197, 51.388974],
    'Shanghai, China': [31.230390, 121.473702],
    'Annecy, France': [45.899247, 6.129384]
  }
  var languageNameFor = {
    en: 'English',
    zh: '中文',
    vi: 'Tiếng Việt',
    pl: 'Polski',
    ru: 'Русский',
    jp: '日本語',
    fr: 'Français',
    de: 'Deutsch',
    el: 'Ελληνικά',
    es: 'Español',
    hi: 'हिंदी',
    fa: 'فارسی'
  }

  var team = [{
    name: 'Evan You',
    title: 'Benevolent Dictator For Life',
    city: 'Jersey City, NJ, USA',
    languages: ['zh', 'en'],
    github: 'yyx990803',
    twitter: 'youyuxi',
    work: {
      role: 'Creator',
      org: 'Vue.js'
    },
    reposOfficial: [
      'vuejs/*', 'vuejs-templates/*'
    ],
    links: [
      'https://www.patreon.com/evanyou'
    ]
  }]

  team = team.concat(shuffle([
    {
      name: 'Chris Fritz',
      title: 'Good Word Putter-Togetherer',
      city: 'Lansing, MI, USA',
      languages: ['en', 'de'],
      github: 'chrisvfritz',
      twitter: 'chrisvfritz',
      work: {
        role: 'Educator & Consultant'
      },
      reposOfficial: [
        'vuejs.org', 'vue-migration-helper'
      ],
      reposPersonal: [
        'vue-2.0-simple-routing-example', 'vue-ssr-demo-simple'
      ]
    },
    {
      name: 'Eduardo',
      title: 'Real-Time Rerouter',
      city: 'Paris, France',
      languages: ['es', 'fr', 'en'],
      github: 'posva',
      twitter: 'posva',
      work: {
        role: 'Lead Instructor',
        org: 'IronHack',
        orgUrl: 'https://www.ironhack.com/'
      },
      reposOfficial: [
        'vuefire', 'vue-router'
      ],
      reposPersonal: [
        'vuexfire', 'vue-mdc', 'vue-motion'
      ],
      links: [
        'https://www.codementor.io/posva'
      ]
    },
    {
      name: 'Jinjiang',
      title: 'Mobile Extrapolator',
      city: 'Hangzhou, China',
      languages: ['zh', 'en'],
      github: 'jinjiang',
      twitter: 'zhaojinjiang',
      work: {
        org: 'Alibaba',
        orgUrl: 'https://www.alibaba.com/'
      },
      reposOfficial: [
        'cn.vuejs.org'
      ],
      reposPersonal: [
        'apache/incubator-weex'
      ]
    },
    {
      name: 'EGOIST',
      title: 'Build Tool Simplificator',
      city: 'Chengdu, China',
      languages: ['zh', 'en'],
      github: 'egoist',
      twitter: 'rem_rin_rin',
      reposOfficial: [
        'vue-cli'
      ],
      reposPersonal: [
        'poi', 'ream', 'vue-play'
      ]
    },
    {
      name: 'Katashin',
      title: 'One of a Type State Manager',
      city: 'Tokyo, Japan',
      languages: ['jp', 'en'],
      work: {
        org: 'oRo Co., Ltd.',
        orgUrl: 'https://www.oro.com'
      },
      github: 'ktsn',
      twitter: 'ktsn',
      reposOfficial: [
        'vuex', 'vue-class-component'
      ]
    },
    {
      name: 'Kazupon',
      title: 'Validated Internationalizing Missionary',
      city: 'Tokyo, Japan',
      languages: ['jp', 'en'],
      github: 'kazupon',
      twitter: 'kazu_pon',
      work: {
        role: 'CTO & Full Stack Developer'
      },
      reposOfficial: [
        'vuejs.org', 'jp.vuejs.org'
      ],
      reposPersonal: [
        'vue-i18n', 'vue-i18n-loader', 'vue-validator'
      ],
      links: [
        'https://cuusoo.com', 'http://frapwings.jp'
      ]
    },
    {
      name: 'Rahul Kadyan',
      title: 'Ecosystem Glue Chemist',
      city: 'Bangalore, India',
      languages: ['hi', 'en'],
      work: {
        role: 'Software Engineer',
        org: 'Myntra',
        orgUrl: 'https://www.myntra.com/'
      },
      github: 'znck',
      twitter: 'znck0',
      reposOfficial: [
        'rollup-plugin-vue', 'vue-issue-helper'
      ],
      reposPersonal: [
        'vue-keynote', 'bootstrap-for-vue', 'vue-interop'
      ],
      links: [
        'https://znck.me', 'https://www.codementor.io/znck'
      ]
    },
    {
      name: 'Alan Song',
      title: 'Regent of Routing',
      city: 'Hangzhou, China',
      languages: ['zh', 'en'],
      work: {
        role: 'Cofounder',
        org: 'Futurenda',
        orgUrl: 'https://www.futurenda.com/'
      },
      github: 'fnlctrl',
      reposOfficial: [
        'vue-router'
      ]
    },
    {
      name: 'Blake Newman',
      title: 'Performance Specializer & Code Deleter',
      city: 'London, UK',
      languages: ['en'],
      work: {
        role: 'Software Engineer',
        org: 'Attest',
        orgUrl: 'https://www.askattest.com/'
      },
      github: 'blake-newman',
      twitter: 'blake-newman',
      reposOfficial: [
        'vuex', 'vue-router', 'vue-loader'
      ]
    },
    {
      name: 'Phan An',
      title: 'Backend Designer & Process Poet',
      city: 'London, UK',
      languages: ['vi', 'en'],
      github: 'phanan',
      twitter: 'notphanan',
      reposOfficial: [
        'vuejs.org'
      ],
      reposPersonal: [
        'vuequery', 'vue-google-signin-button'
      ],
      links: [
        'https://phanan.net/'
      ]
    },
    {
      name: 'Linusborg',
      title: 'Hive-Mind Community Wrangler (Probably a Bot)',
      city: 'Mannheim, Germany',
      languages: ['de', 'en'],
      github: 'LinusBorg',
      twitter: 'Linus_Borg',
      reposOfficial: [
        'vuejs/*', 'vuejs-templates/*', 'vue-touch'
      ],
      reposPersonal: [
        'portal-vue'
      ],
      links: [
        'https://forum.vuejs.org/'
      ]
    },
    {
      name: 'Denis Karabaza',
      title: 'Director of Directives (Emoji-Human Hybrid)',
      city: 'Dubna, Russia',
      languages: ['ru', 'en'],
      github: 'simplesmiler',
      twitter: 'simplesmiler',
      work: {
        role: 'Software Engineer',
        org: 'Neolant',
        orgUrl: 'http://neolant.ru/'
      },
      reposPersonal: [
        'vue-focus', 'vue-clickaway'
      ],
      links: [
        'mailto:denis.karabaza@gmail.com'
      ]
    },
    {
      name: 'Guillaume Chau',
      title: 'Client-Server Astronaut',
      city: 'Lyon, France',
      languages: ['fr', 'en'],
      github: 'Akryum',
      twitter: 'Akryum',
      reposOfficial: [
        'vue-curated'
      ],
      reposPersonal: [
        'vue-apollo', 'vue-meteor', 'vue-virtual-scroller'
      ]
    },
    {
      name: 'Edd Yerburgh',
      title: 'Testatron Alpha 9000',
      city: 'London, UK',
      languages: ['en'],
      github: 'eddyerburgh',
      twitter: 'EddYerburgh',
      work: {
        role: 'Full Stack Developer'
      },
      reposOfficial: [
        'vue-test-utils'
      ],
      reposPersonal: [
        'avoriaz'
      ],
      links: [
        'https://www.eddyerburgh.me'
      ]
    },
    {
      name: 'defcc',
      title: 'Details Deity & Bug Surgeon',
      city: 'Chongqing, China',
      languages: ['zh', 'en'],
      github: 'defcc',
      work: {
        org: 'zbj.com',
        orgUrl: 'http://www.zbj.com/'
      },
      reposOfficial: [
        'vue', 'vuejs.org', 'cn.vuejs.org'
      ],
      reposPersonal: [
        'weexteam/weex-vue-framework', 'into-vue'
      ]
    }
  ]))

  var partners = [
    {
      name: 'Sebastien Chopin',
      title: '#1 Nuxt Brother',
      city: 'Paris, France',
      languages: ['fr', 'en'],
      github: 'Atinux',
      twitter: 'Atinux',
      work: {
        org: 'Orion',
        orgUrl: 'https://orion.sh'
      },
      reposPersonal: [
        'nuxt/*', 'nuxt-community/*', 'declandewet/vue-meta'
      ]
    },
    {
      name: 'Alexandre Chopin',
      title: '#1 Nuxt Brother',
      city: 'Bordeaux, France',
      languages: ['fr', 'en'],
      github: 'alexchopin',
      twitter: 'ChopinAlexandre',
      work: {
        org: 'Orion',
        orgUrl: 'https://orion.sh'
      },
      reposPersonal: [
        'nuxt/*', 'nuxt-community/*', 'vue-flexboxgrid'
      ]
    },
    {
      name: 'Khary Sharpe',
      title: 'Viral Newscaster',
      city: 'Kingston, Jamaica',
      languages: ['en'],
      github: 'kharysharpe',
      twitter: 'kharysharpe',
      links: [
        'https://twitter.com/VueJsNews',
        'http://www.kharysharpe.com/'
      ]
    },
    {
      name: 'Damian Dulisz',
      title: 'Dark Mage of Plugins, News, and Confs',
      city: 'Wrocław, Poland',
      languages: ['pl', 'en'],
      github: 'shentao',
      twitter: 'DamianDulisz',
      work: {
        role: 'Senior Frontend Developer',
        org: 'Monterail',
        orgUrl: 'https://www.monterail.com/'
      },
      reposPersonal: [
        'monterail/vue-multiselect', 'monterail/vue-newsletter', 'monterail/vuelidate'
      ]
    }, {
      name: 'Alex Kyriakidis',
      title: 'Vueducator Extraordinaire',
      city: 'Thessaloniki, Greece',
      languages: ['el', 'en'],
      github: 'hootlex',
      twitter: 'hootlex',
      work: {
        role: 'Consultant / Author'
      },
      reposPersonal: [
        'vuejs-paginator', 'vuedo/vuedo', 'the-majesty-of-vuejs-2'
      ],
      links: [
        'https://vuejsfeed.com/', 'https://vueschool.io/'
      ]
    },
    {
      name: 'Pooya Parsa',
      title: 'Nuxtification Modularizer',
      city: 'Tehran, Iran',
      languages: ['fa', 'en'],
      github: 'pi0',
      twitter: '_pi0_',
      work: {
        role: 'Technical Advisor',
        org: 'Fandogh (AUT University)',
        orgUrl: 'https://fandogh.org'
      },
      reposPersonal: [
        'nuxt/nuxt.js', 'nuxt-community/modules', 'bootstrap-vue/bootstrap-vue'
      ]
    },
    {
      name: 'Yi Yang',
      city: 'Shanghai, China',
      title: 'Interface Elementologist',
      languages: ['zh', 'en'],
      github: 'Leopoldthecoder',
      work: {
        org: 'ele.me',
        orgUrl: 'https://www.ele.me',
      },
      reposPersonal: [
        'elemefe/element', 'elemefe/mint-ui'
      ]
    },
    {
      name: 'Bruno Lesieur',
      title: 'French Community Directeur',
      city: 'Annecy, France',
      languages: ['fr', 'en'],
      github: 'Haeresis',
      twitter: 'MachinisteWeb',
      work: {
        role: 'Cofounder',
        org: 'Orchard ID',
        orgUrl: 'https://www.orchard-id.com/'
      },
      reposPersonal: [
        'vuejs-fr/vuejs.org', 'Haeresis/node-atlas-hello-vue'
      ],
      links: [
        'https://node-atlas.js.org/', 'https://blog.lesieur.name/'
      ]
    }
  ]

  Vue.component('vuer-profile', {
    template: '#vuer-profile-template',
    props: {
      profile: Object
    },
    computed: {
      workHtml: function () {
        var work = this.profile.work
        var html = ''
        if (work.orgUrl) {
          html += '<a href="' + work.orgUrl + '" target="_blank">'
          if (work.org) {
            html += work.org
          } else {
            this.minimizeLink(work.orgUrl)
          }
          html += '</a>'
        } else if (work.org) {
          html += work.org
        }
        if (work.role) {
          if (html.length > 0) {
            html = work.role + ' @ ' + html
          } else {
            html = work.role
          }
        }
        return html
      },
      textDistance: function () {
        var distanceInKm = this.profile.distanceInKm || 0
        if (this.$root.useMiles) {
          return roundDistance(kmToMi(distanceInKm)) + ' miles'
        } else {
          return roundDistance(distanceInKm) + ' km'
        }
      },
      languageListHtml: function () {
        var vm = this
        var nav = window.navigator
        if (!vm.profile.languages) return ''
        var preferredLanguageCode = nav.languages
          // The preferred language set in the browser
          ? nav.languages[0]
          : (
              // The system language in IE
              nav.userLanguage ||
              // The language in the current page
              nav.language
            )
        return (
          '<ul><li>' +
          vm.profile.languages.map(function (languageCode, index) {
            var language = languageNameFor[languageCode]
            if (
              languageCode !== 'en' &&
              languageCode === preferredLanguageCode.slice(0, 2)
            ) {
              return (
                '<span ' +
                  'class="user-match" ' +
                  'title="' +
                    vm.profile.name +
                    ' peut discuter techniquement avec vous dans votre langue préférée.' +
                  '"' +
                '\>' + language + '</span>'
              )
            }
            return language
          }).join('</li><li>') +
          '</li></ul>'
        )
      }
    },
    methods: {
      minimizeLink: function (link) {
        return link
          .replace(/^https?:\/\/(www\.)?/, '')
          .replace(/\/$/, '')
          .replace(/^mailto:/, '')
      },
      /**
       * Generate a GitHub URL using a repo and a handle.
       */
      githubUrl: function (handle, repo) {
        if (repo && repo.indexOf('/') !== -1) {
          // If the repo name has a slash, it must be an organization repo.
          // In such a case, we discard the (personal) handle.
          return (
            'https://github.com/' +
            repo.replace(/\/\*$/, '')
          )
        }
        return 'https://github.com/' + handle + '/' + (repo || '')
      }
    }
  })

  new Vue({
    el: '#team-members',
    data: {
      team: team,
      partners: shuffle(partners),
      geolocationSupported: false,
      isSorting: false,
      errorGettingLocation: false,
      userPosition: null,
      useMiles: false
    },
    computed: {
      sortedTeam: function () {
        return this.sortVuersByDistance(this.team)
      },
      sortedPartners: function () {
        return this.sortVuersByDistance(this.partners)
      }
    },
    created: function () {
      var nav = window.navigator
      if ('geolocation' in nav) {
        this.geolocationSupported = true
        var imperialLanguageCodes = [
          'en-US', 'en-MY', 'en-MM', 'en-BU', 'en-LR', 'my', 'bu'
        ]
        if (imperialLanguageCodes.indexOf(nav.language) !== -1) {
          this.useMiles = true
        }
      }
    },
    methods: {
      getUserPosition: function () {
        var vm = this
        var nav = window.navigator
        vm.isSorting = true
        nav.geolocation.getCurrentPosition(
          function (position) {
            vm.userPosition = position
            vm.isSorting = false
          },
          function (error) {
            vm.isSorting = false
            vm.errorGettingLocation = true
          },
          {
            enableHighAccuracy: true
          }
        )
      },
      sortVuersByDistance: function (vuers) {
        var vm = this
        if (!vm.userPosition) return vuers
        var vuersWithDistances = vuers.map(function (vuer) {
          var cityCoords = cityCoordsFor[vuer.city]
          return Object.assign({}, vuer, {
            distanceInKm: getDistanceFromLatLonInKm(
              vm.userPosition.coords.latitude,
              vm.userPosition.coords.longitude,
              cityCoords[0],
              cityCoords[1]
            )
          })
        })
        vuersWithDistances.sort(function (a, b) {
          return (
            a.distanceInKm -
            b.distanceInKm
          )
        })
        return vuersWithDistances
      }
    }
  })

  /**
  * Shuffles array in place.
  * @param {Array} a items The array containing the items.
  */
  function shuffle (a) {
    a = a.concat([])
    if (window.location.hostname === 'localhost') {
      return a
    }
    var j, x, i
    for (i = a.length; i; i--) {
      j = Math.floor(Math.random() * i)
      x = a[i - 1]
      a[i - 1] = a[j]
      a[j] = x
    }
    return a
  }

  /**
  * Calculates great-circle distances between the two points – that is, the shortest distance over the earth’s surface – using the Haversine formula.
  * @param {Number} lat1 The latitude of the 1st location.
  * @param {Number} lon1 The longitute of the 1st location.
  * @param {Number} lat2 The latitude of the 2nd location.
  * @param {Number} lon2 The longitute of the 2nd location.
  */
  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371 // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1)  // deg2rad below
    var dLon = deg2rad(lon2-lon1)
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    var d = R * c // Distance in km
    return d
  }

  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  function kmToMi (km) {
    return km * 0.62137
  }

  function roundDistance (num) {
    return Number(Math.ceil(num).toPrecision(2))
  }
})()
</script>
{% endraw %}
