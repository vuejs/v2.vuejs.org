---
title: Conheça a Equipe
type: guide
order: 703
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
      <h3 :data-official-title="profile.title">
        {{ profile.name }}
        <sup v-if="profile.title && titleVisible" v-html="profile.title"></sup>
      </h3>
      <dl>
        <template v-if="profile.reposOfficial">
          <dt>Focado em</dt>
          <dd>
            <ul>
              <li v-for="repo in profile.reposOfficial">
                <a :href="githubUrl('vuejs', repo)" target=_blank>{{ repo }}</a>
              </li>
            </ul>
          </dd>
        </template>
        <template v-if="profile.github && profile.reposPersonal">
          <dt>Ecossistema</dt>
          <dd>
            <ul>
              <li v-for="repo in profile.reposPersonal">
                <a :href="githubUrl(profile.github, repo)" target=_blank>{{ repo }}</a>
              </li>
            </ul>
          </dd>
        </template>
        <template v-if="profile.work">
          <dt>
            <i class="fa fa-briefcase"></i>
            <span class="sr-only">Trabalho</span>
          </dt>
          <dd v-html="workHtml"></dd>
        </template>
        <span v-if="profile.distanceInKm" class="distance">
          <dt>
            <i class="fa fa-map-marker"></i>
            <span class="sr-only">Distância</span>
          </dt>
          <dd>
            Aproximadamente
            <span
              v-if="profile.distanceInKm <= 500"
              :title="profile.name + ' está perto o bastante para viajar até sua localidade.'"
              class="user-match"
            >{{ textDistance }} distante,</span>
            <template v-else>{{ textDistance }} distante,</template>
            em {{ profile.city }}
          </dd>
        </span>
        <template v-else-if="profile.city">
          <dt>
            <i class="fa fa-map-marker"></i>
            <span class="sr-only">Cidade</span>
          </dt>
          <dd>
            {{ profile.city }}
          </dd>
        </template>
        <template v-if="profile.languages">
          <dt>
            <i class="fa fa-globe"></i>
            <span class="sr-only">Línguas</span>
          </dt>
          <dd v-html="languageListHtml" class="language-list"></dd>
        </template>
        <template v-if="profile.links">
          <dt>
            <i class="fa fa-link"></i>
            <span class="sr-only">Links</span>
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
            <span class="sr-only">Github</span>
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
      Equipe Principal
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
          <span>encontre perto de mim</span>
        </template>
      </button>
    </h2>

    <p v-if="errorGettingLocation" class="tip">
      Falha ao tentar obter sua localização.
    </p>

    <p>
      A equipe principal de desenvolvimento do Vue e seu ecossistema é guiada por um time internacional, alguns dos quais escolheram estar destacados a seguir.
    </p>

    <p v-if="userPosition" class="success">
      A equipe principal foi ordenada pela distância até você.
    </p>

    <vuer-profile
      v-for="profile in sortedTeam"
      :key="profile.github"
      :profile="profile"
      :title-visible="titleVisible"
    ></vuer-profile>
  </div>

  <div class="team">
    <h2 id="community-partners">
      Parceiros da Comunidade
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
          <span>encontre perto de mim</span>
        </template>
      </button>
    </h2>

    <p v-if="errorGettingLocation" class="tip">
      Falha ao tentar obter sua localização.
    </p>

    <p>
      Alguns membros da comunidade Vue ajudaram tanto a enriquecê-la que merecem menção especial. Nós desenvolvemos uma relação mais intimista com estes parceiros, por vezes coordenando com eles sobre funcionalidades futuras e novidades em geral.
    </p>

    <p v-if="userPosition" class="success">
      Os parceiros da comunidade foram ordenados pela distância até você.
    </p>

    <vuer-profile
      v-for="profile in sortedPartners"
      :key="profile.github"
      :profile="profile"
      :title-visible="titleVisible"
    ></vuer-profile>
  </div>
</div>

<script>
(function () {
  var cityCoordsFor = {
    'Alicante, Espanha' : [38.346543, -0.483838],
    'Annecy, França': [45.899247, 6.129384],
    'Bangalore, Índia': [12.971599, 77.594563],
    'Bordéus, França': [44.837789, -0.579180],
    'Bucareste, Romênia': [44.426767, 26.102538],
    'Chengtu, China': [30.572815, 104.066801],
    'Denver, Estados Unidos': [39.739236, -104.990251],
    'Dubna, Rússia': [56.732020, 37.166897],
    'East Lansing, Estados Unidos': [42.736979, -84.483865],
    'Hancheu, China': [30.274084, 120.155070],
    'Jersey City, Estados Unidos': [40.728157, -74.558716],
    'Kingston, Jamaica': [18.017874, -76.809904],
    'Krasnodar, Rússia': [45.039267, 38.987221],
    'Lansing, Estados Unidos': [42.732535, -84.555535],
    'Londres, Reino Unido': [51.507351, -0.127758],
    'Lyon, França': [45.764043, 4.835659],
    'Mannheim, Alemanha': [49.487459, 8.466039],
    'Moscou, Rússia': [55.755826, 37.617300],
    'Orlando, Estados Unidos': [28.538335, -81.379236],
    'Paris, França': [48.856614, 2.352222],
    'Seul, Coreia do Sul': [37.566535, 126.977969],
    'Taquaritinga, Brasil': [-21.430094, -48.515285],
    'Teerã, Irã': [35.689197, 51.388974],
    'Tessalônica, Grécia': [40.640063, 22.944419],
    'Tóquio, Japão': [35.689487, 139.691706],
    'Toronto, Canadá': [43.653226, -79.383184],
    'Wroclaw, Polônia': [51.107885, 17.038538],
    'Xangai, China': [31.230390, 121.473702],
    'Xunquim, China': [29.431586, 106.912251]
  }
  var languageNameFor = {
    en: 'Inglês',
    zh: 'Chinês',
    vi: 'Vietnamita',
    pl: 'Polonês',
    pt: 'Português',
    ru: 'Russo',
    jp: 'Japonês',
    fr: 'Francês',
    de: 'Alemão',
    el: 'Grego',
    es: 'Espanhol',
    hi: 'Hindi',
    fa: 'Persa',
    ko: 'Coreano',
    ro: 'Romeno'
  }

  var team = [{
    name: 'Evan You',
    title: 'Ditador Benevolente Vitalício',
    city: 'Jersey City, Estados Unidos',
    languages: ['zh', 'en'],
    github: 'yyx990803',
    twitter: 'youyuxi',
    work: {
      role: 'Criador',
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
      title: 'Organizador de Boas Palavras',
      city: 'Lansing, Estados Unidos',
      languages: ['en', 'de'],
      github: 'chrisvfritz',
      twitter: 'chrisvfritz',
      work: {
        role: 'Educador & Consultor'
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
      title: 'Re-Roteador em Tempo Real',
      city: 'Paris, França',
      languages: ['es', 'fr', 'en'],
      github: 'posva',
      twitter: 'posva',
      work: {
        role: 'Instrutor Líder',
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
      title: 'Extrapolador de Mobilidade',
      city: 'Hancheu, China',
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
      title: 'Simplificador de Compilação',
      city: 'Chengtu, China',
      languages: ['zh', 'en'],
      github: 'egoist',
      twitter: '_egoistlily',
      reposOfficial: [
        'vue-cli'
      ],
      reposPersonal: [
        'poi', 'ream', 'vue-play'
      ]
    },
    {
      name: 'Katashin',
      title: 'Um Tipo de Gerente de Estado',
      city: 'Tóquio, Japão',
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
      title: 'Missionário de Internacionalização Validado',
      city: 'Tóquio, Japão',
      languages: ['jp', 'en'],
      github: 'kazupon',
      twitter: 'kazu_pon',
      work: {
        role: 'CTO & Desenvolvedor Full Stack'
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
      title: 'Químico de Colas de Ecossistemas',
      city: 'Bangalore, Índia',
      languages: ['hi', 'en'],
      work: {
        role: 'Engenheiro de Software',
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
      title: 'Regente de Roteamento',
      city: 'Hancheu, China',
      languages: ['zh', 'en'],
      work: {
        role: 'Co-Fundador',
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
      title: 'Técnico de Desempenho & Deletador de Código',
      city: 'Londres, Reino Unido',
      languages: ['en'],
      work: {
        role: 'Engenheiro de Software',
        org: 'Attest',
        orgUrl: 'https://www.askattest.com/'
      },
      github: 'blake-newman',
      twitter: 'blakenewman',
      reposOfficial: [
        'vuex', 'vue-router', 'vue-loader'
      ]
    },
    {
      name: 'Phan An',
      title: 'Designer de Backend & Poeta de Processos',
      city: 'Londres, Reino Unido',
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
      title: 'Polêmico Moderador (Talvez um Bot)',
      city: 'Mannheim, Alemanha',
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
      title: 'Diretor de Diretivas (Híbrido Emoji-Humano)',
      city: 'Dubna, Rússia',
      languages: ['ru', 'en'],
      github: 'simplesmiler',
      twitter: 'simplesmiler',
      work: {
        role: 'Engenheiro de Software',
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
      title: 'Astronauta Cliente-Servidor',
      city: 'Lyon, França',
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
      city: 'Londres, Reino Unido',
      languages: ['en'],
      github: 'eddyerburgh',
      twitter: 'EddYerburgh',
      work: {
        role: 'Desenvolvedor Full Stack'
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
      title: 'Divindade do Detalhismo & Cirurgião de Insetos',
      city: 'Xunquim, China',
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
    },
    {
      name: 'gebilaoxiong',
      title: 'Aniquilador de Problemas',
      city: 'Xunquim, China',
      languages: ['zh', 'en'],
      github: 'gebilaoxiong',
      work: {
        org: 'zbj.com',
        orgUrl: 'http://www.zbj.com/'
      },
      reposOfficial: [
        'vue'
      ]
    },
    {
      name: 'Andrew Tomaka',
      title: 'O Servidor do Servidor',
      city: 'East Lansing, Estados Unidos',
      languages: ['en'],
      github: 'atomaka',
      twitter: 'atomaka',
      reposOfficial: [
        'vuejs/*'
      ],
      work: {
        org: 'Universidade Estadual de Michigan',
        orgUrl: 'https://msu.edu/'
      },
      links: [
        'https://atomaka.com/'
      ]
    }
  ]))

  var partners = [
    {
      name: 'Sebastien Chopin',
      title: 'Irmão Número 1 do Projeto Nuxt',
      city: 'Paris, França',
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
      title: 'Irmão Número 1 do Projeto Nuxt',
      city: 'Bordéus, França',
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
      title: 'Disseminador de Notícias Viral',
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
      title: 'Mago Negro dos Plugins, Notícias e Conferências',
      city: 'Wroclaw, Polônia',
      languages: ['pl', 'en'],
      github: 'shentao',
      twitter: 'DamianDulisz',
      work: {
        role: 'Desenvolvedor Frontend Sênior',
        org: 'Monterail',
        orgUrl: 'https://www.monterail.com/'
      },
      reposPersonal: [
        'monterail/vue-multiselect', 'monterail/vue-newsletter', 'monterail/vuelidate'
      ]
    }, {
      name: 'Alex Kyriakidis',
      title: 'Vueducador Extraordinário',
      city: 'Tessalônica, Grécia',
      languages: ['el', 'en'],
      github: 'hootlex',
      twitter: 'hootlex',
      work: {
        role: 'Consultor & Escritor'
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
      title: 'Modularizador de Nuxtificação',
      city: 'Teerã, Irã',
      languages: ['fa', 'en'],
      github: 'pi0',
      twitter: '_pi0_',
      work: {
        role: 'Assessor Técnico',
        org: 'Fandogh (Universidade AUT)',
        orgUrl: 'https://fandogh.org'
      },
      reposPersonal: [
        'nuxt/nuxt.js', 'nuxt-community/modules', 'bootstrap-vue/bootstrap-vue'
      ]
    },
    {
      name: 'Yi Yang',
      city: 'Xangai, China',
      title: 'Elementologista de Interfaces',
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
      title: 'Diretor da Comunidade Francesa',
      city: 'Annecy, França',
      languages: ['fr', 'en'],
      github: 'Haeresis',
      twitter: 'MachinisteWeb',
      work: {
        role: 'Co-Fundador',
        org: 'Orchard ID',
        orgUrl: 'https://www.orchard-id.com/'
      },
      reposPersonal: [
        'vuejs-fr/vuejs.org', 'Haeresis/node-atlas-hello-vue'
      ],
      links: [
        'https://node-atlas.js.org/', 'https://blog.lesieur.name/'
      ]
    },
    {
      name: 'ChangJoo Park',
      title: 'Vuentusiasta Organizador da Equipe Coreana',
      city: 'Seul, Coreia do Sul',
      languages: ['ko', 'en'],
      github: 'changjoo-park',
      twitter: 'pcjpcj2',
      reposPersonal: [
        'vuejs-kr/kr.vuejs.org', 'ChangJoo-Park/vue-component-generator'
      ],
      links: [
        'https://vuejs-kr.github.io',
        'https://twitter.com/pcjpcj2'
      ]
    },
    {
      name: 'Erick Petrucelli',
      title: 'Perfeccionista Tradutor-Chefe para Português',
      city: 'Taquaritinga, Brasil',
      languages: ['pt', 'en'],
      github: 'ErickPetru',
      twitter: 'erickpetru',
      work: {
        role: 'Professor',
        org: 'Fatec Taquaritinga',
        orgUrl: 'http://www.fatectq.edu.br/'
      },
      reposPersonal: [
        'vuejs-br/br.vuejs.org', 'ErickPetru/vue-feathers-chat'
      ]
    },
    {
      name: 'Razvan Stoenescu',
      title: 'Criador de Quasars do Espaço Profundo',
      city: 'Bucareste, Romênia',
      languages: ['ro', 'en'],
      github: 'rstoenescu',
      twitter: 'quasarframework',
      work: {
        role: 'Desenvolvedor',
        org: 'Quasar Framework',
        orgUrl: 'http://quasar-framework.org/'
      },
      reposPersonal: [
        'quasarframework/quasar', 'quasarframework/quasar-cli', 'quasarframework/quasar-play'
      ]
    },
    {
      name: 'Jilson Thomas',
      title: 'Promotor Vue e Cara do VueJobs',
      city: 'Toronto, Canadá',
      languages: ['en'],
      github: 'JillzTom',
      twitter: 'jilsonthomas',
      work: {
        role: 'Desenvolvedor Frontend Sênior',
        org: 'Nominator',
        orgUrl: 'https://nominator.com/'
      },
      links: [
        'https://vuejobs.com'
      ]
    },
    {
      name: 'Israel Ortuño',
      title: 'Corsário do VueJobs',
      city: 'Alicante, Espanha',
      languages: ['es', 'en'],
      github: 'IsraelOrtuno',
      twitter: 'IsraelOrtuno',
      work: {
        role: 'Desenvolvedor Web Full Stack',
        org: 'Autônomo'
      },
      links: [
        'https://vuejobs.com'
      ]
    },
    {
      name: 'John Leider',
      title: 'Vuepletamente Escultor de Framework',
      city: 'Orlando, Estados Unidos',
      languages: ['en'],
      github: 'vuetifyjs',
      twitter: 'vuetifyjs',
      work: {
        role: 'Desenvolvedor',
        org: 'Fast Forward Academy',
        orgUrl: 'https://fastforwardacademy.com'
      },
      reposPersonal: [
        'vuetifyjs/vuetify'
      ]
    },
    {
      name: 'Grigoriy Beziuk',
      title: 'Líder de Gangue de Tradutores',
      city: 'Moscou, Rússia',
      languages: ['ru', 'de', 'en'],
      github: 'gbezyuk',
      work: {
        role: 'Desenvolvedor Web Full Stack',
        org: 'Autônomo',
        orgUrl: 'http://gbezyuk.ru'
      },
      reposPersonal: [
        'translation-gang/ru.vuejs.org'
      ]
    },
    {
      name: 'Alexander Sokolov',
      title: 'Olhar Afiado da Tradução Russa',
      city: 'Krasnodar, Rússia',
      languages: ['ru', 'en'],
      github: 'Alex-Sokolov',
      reposPersonal: [
        'translation-gang/ru.vuejs.org'
      ]
    },
    {
      name: 'Sarah Drasner',
      city: 'Denver, Estados Unidos',
      languages: ['en'],
      work: {
        role: 'Consultora'
      },
      github: 'sdras',
      twitter: 'sarah_edo',
      codepen: 'sdras',
      reposPersonal: [
        'intro-to-vue', 'vue-sublime-snippets', 'nuxt-type', 'animating-vue-workshop', 'vue-wine-label', 'vue-weather-notifier'
      ]
    }
  ]

  Vue.component('vuer-profile', {
    template: '#vuer-profile-template',
    props: {
      profile: Object,
      titleVisible: Boolean
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
          return roundDistance(kmToMi(distanceInKm)) + ' milhas'
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
              preferredLanguageCode &&
              languageCode === preferredLanguageCode.slice(0, 2)
            ) {
              return (
                '<span ' +
                  'class="user-match" ' +
                  'title="' +
                    vm.profile.name +
                    ' pode palestrar sobre Vue em sua língua preferida.' +
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
      useMiles: false,
      konami: {
        position: 0,
        code: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]
      }
    },
    computed: {
      sortedTeam: function () {
        return this.sortVuersByDistance(this.team)
      },
      sortedPartners: function () {
        return this.sortVuersByDistance(this.partners)
      },
      titleVisible: function () {
        return this.konami.code.length === this.konami.position
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
      document.addEventListener('keydown', this.konamiKeydown)
    },
    beforeDestroy: function () {
      document.removeEventListener('keydown', this.konamiKeydown)
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
      },
      konamiKeydown: function (event) {
        if (this.titleVisible) {
          return
        }

        if (event.keyCode !== this.konami.code[this.konami.position++]) {
          this.konami.position = 0
        }
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
