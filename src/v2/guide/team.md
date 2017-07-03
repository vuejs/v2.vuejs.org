---
title: Meet the Team
type: guide
order: 31
---

{% raw %}
<style>
  #team-members .vuer {
    display: flex;
    padding: 20px 0;
    border-bottom: 1px dotted #ddd;
  }

  #team-members .vuer .avatar {
    flex: 0 0 80px;
  }

  #team-members .vuer .avatar img {
    border-radius: 50%;
  }

  #team-members .vuer .profile {
    padding-left: 26px;
    flex: 1;
  }

  #team-members .vuer .profile h3 {
    margin: 0;
    font-size: 1.3em;
  }

  #team-members .vuer .profile h3::before, #team-members .vuer .profile h3::after {
    display: none;
  }

  #team-members .vuer .profile dl {
    margin: 5px 0 0;
  }

  #team-members .vuer .profile dt, 
  #team-members .vuer .profile dd,
  #team-members .vuer .profile ul,
  #team-members .vuer .profile li {
    display: inline;
    padding: 0;
    margin: 0;
    line-height: 1.6;
  }

  #team-members .vuer .profile li::after {
    content: ' · ';
  }

  #team-members .vuer .profile li:last-child::after {
    content: '';
  }

  #team-members .vuer .profile dt::after {
    content: ':';
  }

  #team-members .vuer .profile dd {
    font-weight: 600;
  }

  #team-members .vuer .profile dd::after {
    content: ' ';
    display: block;
  }

  #team-members .vuer .profile .social {
    margin-top: 3px;
    font-size: 1.3em;
  }

  #team-members .vuer .profile .social a {
    margin-right: 5px;
  }

  #team-members .vuer .profile .social a.github {
    color: #000;
  }

  #team-members .vuer .profile .social a.twitter {
    color: #1da1f3;
  }
</style>

<script id="memberTemplate" type="text/tmpl">
  <div class="vuer">
    <div class="avatar">
      <img v-if="profile.github" 
        :src="'https://github.com/' + profile.github + '.png'" 
        :alt="profile.name" width=80 height=80>
    </div>
    <div class="profile">
      <h3>{{ profile.name }}</h3>
      <dl>
        <template v-if="profile.reposOfficial">
          <dt>Core focus</dt>
          <dd>
            <ul>
              <li v-for="repo in profile.reposOfficial">
                <a :href="githubUrl('vuejs', repo)" target=_blank>{{ repo }}</a>
              </li>
            </ul>
          </dd>
        </template>
        <template v-if="profile.github && profile.reposPersonal">
          <dt>Ecosystem</dt>
          <dd>
            <ul>
              <li v-for="repo in profile.reposPersonal">
                <a :href="githubUrl(profile.github, repo)" target=_blank>
                  {{ repo}}
                </a>
              </li>
            </ul>
          </dd>
        </template>
        <template v-if="profile.work">
          <dt>Work</dt>
          <dd>{{ profile.work }}</dd>
        </template>
        <template v-if="profile.links">
          <dt>Website{{ profile.links.length > 1 ? 's' : '' }}</dt>
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
          </a>
          <a class=twitter v-if="profile.twitter" :href="'https://twitter.com/' + profile.twitter">
            <i class="fa fa-twitter"></i>
          </a>
        </footer>
      </dl>
    </div>
  </div>
</script>

<div id="team-members">
  <div class="team">
    <h2 id="the-core-team">The Core Team</h2>

    <p>
      The development of Vue and its ecosystem is guided by an international team, 
      some of whom have chosen to be featured below.
    </p>

    <member v-for="profile in team" :key="profile.github" :profile="profile"></member>
  </div>

  <div class="team">
    <h2 id="community-partners">Community Partners</h2>

    <p>
      Some members of the Vue community have so enriched it, that they deserve special mention. 
      We've developed a more intimate relationship with these key partners, often coordinating 
      with them on upcoming news and features.
    </p>

    <partner v-for="profile in partners" :key="profile.github" :profile="profile"></partner>
  </div>
</div>

<script>
(function () {
  var team = [{
    name: 'Evan You',
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
      github: 'jinjiang',
      twitter: 'zhaojinjiang',
      work:'Alibaba',
      reposPersonal: [
        'apache/incubator-weex'
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
      github: 'ktsn',
      twitter: 'ktsn',
      reposOfficial: [
        'vuex', 'vue-class-component'
      ]
    },
    {
      name: 'Kazupon',
      github: 'kazupon',
      twitter: 'kazu_pon',
      work: 'CTO',
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
      name: 'Rahul Kadyan',
      work: 'Headout',
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
      name: 'Blake Newman',
      work: 'Software Engineer @ Attest (askattest.com)',
      github: 'blake-newman',
      twitter: 'blake-newman',
      reposOfficial: [
        'vuex', 'vue-router', 'vue-loader'
      ]
    },
    {
      name: 'Phan An',
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
    }
  ]))

  var partners = [
    {
      name: 'Sebastien Chopin',
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
      name: 'Khary Sharpe',
      github: 'kharysharpe',
      twitter: 'kharysharpe',
      links: [
        'https://twitter.com/VueJsNews',
        'http://www.kharysharpe.com/'
      ]
    }
  ]

  var mixin = {
    methods: {
      minimizeLink: function (link) {
        return link
          .replace(/^https?:\/\/(www\.)?/, '')
          .replace(/\/$/, '')
      },
      /**
       * Generate a GitHub URL using a repo and a handle.
       */
      githubUrl: function (handle, repo) {
        if (repo && repo.indexOf('/') !== -1) {
          // If the repo name has a slash, it must be an organization repo.
          // In such a case, we discard the (personal) handle.
          return 'https://github.com/' + repo;
        }
        return 'https://github.com/' + handle + '/' + (repo || '');
      }
    }
  }

  Vue.component('member', {
    template: document.getElementById('memberTemplate').innerHTML,
    props: {
      profile: Object
    },
    mixins: [mixin] 
  })

  Vue.component('partner', {
    template: document.getElementById('memberTemplate').innerHTML,
    props: {
      profile: Object
    },
    mixins: [mixin]
  })

  new Vue({
    el: '#team-members',
    data: {
      team: team,
      partners: shuffle(partners)
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
