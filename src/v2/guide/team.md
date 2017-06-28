---
title: Meet the Team
type: guide
order: 31
---

{% raw %}
<div id="team-members">
  <p>
    The development of Vue and its ecosystem is guided by an international team, some of whom have chosen to be featured below.
  </p>

  <team-member
    v-for="member in team"
    :key="member.github"
    :member="member"
    inline-template>
    <div class="team-member">
      <h2 :id="'team-member-' + member.name.toLowerCase().replace(/\W/g, '-')">
        {{ member.name }}
        <img
          v-if="member.image"
          :src="member.image"
          :alt="member.name"
        >
      </h2>
      <ul
        v-if="member.reposOfficial"
        class="team-member-official-repos"
      >
        <li class="team-member-category-label">Core</li>
        <li v-for="repo in member.reposOfficial">
          <a
            :href="'https://github.com/vuejs/' + repo"
            target="_blank"
          >
            <img src="/images/logo.png" alt="Vue">
            {{ repo }}
          </a>
        </li>
      </ul>
      <ul v-if="member.github && member.reposPersonal">
        <li class="team-member-category-label">Community</li>
        <li v-for="repo in member.reposPersonal">
          <a
            :href="'https://github.com/' + member.github + '/' + repo"
            target="_blank"
          >
            <i class="fa fa-github"></i>
            {{ repo }}
          </a>
        </li>
      </ul>
      <ul v-if="member.github || member.twitter">
        <li class="team-member-category-label">Contact</li>
        <li v-if="member.github">
          <a
            :href="'https://github.com/' + member.github"
            target="_blank"
          >
            <i class="fa fa-github"></i>
            {{ member.github }}
          </a>
        </li>
        <li v-if="member.twitter">
          <a
            :href="'https://twitter.com/' + member.twitter"
            target="_blank"
          >
            <i class="fa fa-twitter"></i>
            {{ member.twitter }}
          </a>
        </li>
      </ul>
      <ul v-if="member.work || member.links">
        <li class="team-member-category-label">Work</li>
        <li v-if="member.work">
          <i class="fa fa-briefcase"></i>
          {{ member.work }}
        </li>
        <li v-for="link in member.links">
          <a :href="link" target="_blank">
            <i class="fa fa-link"></i>
            {{
              link
                .replace(/^https?:\/\/(www\.)?/, '')
                .replace(/\/$/, '')
            }}
          </a>
        </li>
      </ul>
    </div>
  </team-member>
</div>

<script>
(function () {
  var team = [{
    name: 'Evan You',
    image: 'https://avatars3.githubusercontent.com/u/499550?v=3&s=460',
    github: 'yyx990803',
    twitter: 'youyuxi',
    work: 'Creator @ Vue.js',
    links: [
      'https://www.patreon.com/evanyou'
    ]
  }]

  team = team.concat(shuffle([
    {
      name: 'Chris Fritz',
      image: 'https://avatars1.githubusercontent.com/u/2327556?v=3&s=460',
      github: 'chrisvfritz',
      twitter: 'chrisvfritz',
      work: 'Consultant',
      reposOfficial: [
        'vuejs.org', 'vue-migration-helper'
      ],
      reposPersonal: [
        'vue-2.0-simple-routing-example', 'vue-ssr-demo-simple'
      ]
    },
    {
      name: 'Eduardo',
      image: 'https://avatars0.githubusercontent.com/u/664177?v=3&s=460',
      github: 'posva',
      twitter: 'posva',
      work: 'Lead Instructor @ IronHack',
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
      image: 'https://en.gravatar.com/userimage/13176194/461845e850f200dd434da75b198f0952.jpg?size=800',
      github: 'jinjiang',
      twitter: 'zhaojinjiang',
      work: 'Alibaba',
      reposPersonal: [
        'Weex'
      ]
    },
    {
      name: 'Egoist',
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
      work: 'oRo Co., Ltd.',
      image: 'https://avatars1.githubusercontent.com/u/2194624?v=3&s=400',
      github: 'ktsn',
      twitter: 'ktsn',
      reposOfficial: [
        'vuex', 'vue-class-component'
      ]
    },
    {
      name: 'Kazupon',
      work: 'CTO',
      image: 'https://avatars0.githubusercontent.com/u/72989',
      github: 'kazupon',
      twitter: 'kazu_pon',
      reposOfficial: [
        'jp.vuejs.org'
      ],
      reposPersonal: [
        'vue-i18n', 'vue-i18n-loader', 'vue-validator'
      ],
      links: [
        'https://cuusoo.com', 'http://frapwings.jp'
      ]
    },
    {
      name: 'Sebastien Chopin',
      image: 'https://avatars0.githubusercontent.com/u/904724?v=3&s=460',
      github: 'Atinux',
      twitter: 'Atinux',
      reposPersonal: [
        'nuxt/nuxt.js'
      ],
      links: [
        'https://orion.sh/'
      ]
    },
    {
      name: 'Rahul Kadyan',
      work: 'Headout',
      image: 'https://github.com/znck.png',
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
      work: 'Cofounder @ Futurenda',
      github: 'fnlctrl',
      reposOfficial: [
        'vue-router'
      ]
    },
    {
      name: 'Khary Sharpe',
      github: 'kharysharpe',
      twitter: 'kharysharpe',
      links: [
        'https://twitter.com/VueJsNews',
        'http://www.kharysharpe.com/'
      ]
    },
    {
      name: 'Blake Newman',
      work: 'Software Engineer @ Attest (askattest.com)',
      image: 'https://pbs.twimg.com/profile_images/805492508826419200/tabo2HEa_400x400.jpg',
      github: 'blakenewman',
      twitter: 'blake-newman',
      reposOfficial: [
        'vuex', 'vue-router', 'vue-loader'
      ]
    },
    {
      name: 'Phan An',
      image: 'https://www.dropbox.com/s/u9tl5lkb7s8dw0b/avatar.jpg?dl=1',
      github: 'phanan',
      twitter: 'notphanan',
      reposOfficial: [
        'vuejs.org'
      ],
      reposPersonal: [
        'vuequery', 'vue-google-signin-button'
      ]
    }
  ]))

  Vue.component('team-member', {
    props: {
      member: Object
    }
  })

  new Vue({
    el: '#team-members',
    data: {
      team: team
    }
  })

  /**
  * Shuffles array in place.
  * @param {Array} a items The array containing the items.
  */
  function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }
    return a
  }
})()
</script>
{% endraw %}
