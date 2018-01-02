# Support Vue.js Development

Vue.js is an MIT licensed open source project and completely free to use.
However, the amount of effort needed to maintain and develop new features for the project is not sustainable without proper financial backing. You can support Vue.js development via the following methods:

## One-time Donations

We accept donations through these channels:

<div id="one-time-donations">
  <a href="https://www.paypal.me/evanyou" target="_blank"><img src="/images/paypal.png" style="width:100px"></a><a href="#btc"><svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><circle fill="#FFAD02" cx="19" cy="19" r="19"></circle><path d="M24.7 19.68a3.63 3.63 0 0 0 1.47-2.06c.74-2.77-.46-4.87-3.2-5.6l.89-3.33a.23.23 0 0 0-.16-.28l-1.32-.35a.23.23 0 0 0-.28.15l-.89 3.33-1.75-.47.88-3.32a.23.23 0 0 0-.16-.28l-1.31-.35a.23.23 0 0 0-.28.15l-.9 3.33-3.73-1a.23.23 0 0 0-.27.16l-.36 1.33c-.03.12.04.25.16.28l.22.06a1.83 1.83 0 0 1 1.28 2.24l-1.9 7.09a1.83 1.83 0 0 1-2.07 1.33.23.23 0 0 0-.24.12l-.69 1.24a.23.23 0 0 0 0 .2c.02.07.07.12.14.13l3.67.99-.89 3.33c-.03.12.04.24.16.27l1.32.35c.12.03.24-.04.28-.16l.89-3.32 1.76.47-.9 3.33c-.02.12.05.24.16.27l1.32.35c.12.03.25-.04.28-.16l.9-3.32.87.23c2.74.74 4.83-.48 5.57-3.25.35-1.3-.05-2.6-.92-3.48zm-5.96-5.95l2.64.7a1.83 1.83 0 0 1 1.28 2.24 1.83 1.83 0 0 1-2.23 1.3l-2.64-.7.95-3.54zm1.14 9.8l-3.51-.95.95-3.54 3.51.94a1.83 1.83 0 0 1 1.28 2.24 1.83 1.83 0 0 1-2.23 1.3z" fill="#FFF"></path></g></svg> BTC
  </a><a href="#bch"><svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><circle fill="#8DC451" cx="19" cy="19" r="19"></circle><path d="M24.5 16.72c.37-.76.48-1.64.25-2.52-.75-2.76-2.84-3.98-5.58-3.25l-.89-3.32a.23.23 0 0 0-.28-.16l-1.32.35a.23.23 0 0 0-.16.27l.9 3.33-1.76.47-.9-3.32a.23.23 0 0 0-.27-.16l-1.32.35a.23.23 0 0 0-.16.28l.9 3.32-3.74 1a.23.23 0 0 0-.16.29l.35 1.32c.04.12.16.2.28.17l.22-.06c.97-.26 1.97.32 2.23 1.3l1.9 7.08c.25.93-.25 1.87-1.13 2.2a.23.23 0 0 0-.14.21l.02 1.43c0 .07.04.13.1.18.05.04.12.05.19.04l3.67-.99.9 3.33c.03.12.15.19.27.15l1.31-.35c.12-.03.2-.16.16-.28l-.88-3.32 1.75-.47.9 3.33c.03.12.15.19.27.15l1.32-.35c.12-.03.19-.16.16-.28l-.9-3.32.88-.24c2.75-.73 3.95-2.83 3.2-5.6a3.63 3.63 0 0 0-2.54-2.56zm-8.13-2.17l2.63-.7c.97-.26 1.97.32 2.23 1.3.27.97-.3 1.98-1.28 2.24l-2.63.7-.95-3.54zm5.88 7.91l-3.5.94-.96-3.54 3.51-.94c.97-.26 1.97.32 2.24 1.3.26.98-.32 1.98-1.29 2.24z" fill="#FFF"></path></g></svg> BCH
  </a><a href="#eth"><svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 32 32"><g fill="none" fill-rule="evenodd"><ellipse cx="16" cy="16" fill="#6F7CBA" rx="16" ry="16"></ellipse><path fill="#FFF" d="M10.13 17.76c-.1-.15-.06-.2.09-.12l5.49 3.09c.15.08.4.08.56 0l5.58-3.08c.16-.08.2-.03.1.11L16.2 25.9c-.1.15-.28.15-.38 0l-5.7-8.13zm.04-2.03a.3.3 0 0 1-.13-.42l5.74-9.2c.1-.15.25-.15.34 0l5.77 9.19c.1.14.05.33-.12.41l-5.5 2.78a.73.73 0 0 1-.6 0l-5.5-2.76z"></path></g></svg> ETH
  </a><a href="#ltc"><svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38"><g fill="none" fill-rule="evenodd"><circle cx="19" cy="19" r="19" fill="#B5B5B5" fill-rule="nonzero"></circle><path fill="#FFF" d="M12.29 28.04l1.29-5.52-1.58.67.63-2.85 1.64-.68L16.52 10h5.23l-1.52 7.14 2.09-.74-.58 2.7-2.05.8-.9 4.34h8.1l-.99 3.8z"></path></g></svg> LTC
  </a>
</div>

{% raw %}
<div id="coin-details" v-if="type && coins[type]">
  <p>{{ coins[type].name }} Address:<br>{{ coins[type].address }}</p>
  <img :src="'/images/coin-' + type + '.png'">
</div>
{% endraw %}

<script>
var coins = new Vue({
  el: '#coin-details',
  data: {
    type: window.location.hash.slice(1),
    coins: {
      btc: {
        name: 'Bitcoin',
        address: '14MEpy5a9MwDZa9CUzrfDhTU8dy2KKJ5mU'
      },
      bch: {
        name: 'Bitcoin Cash',
        address: '15gftB3fwumFRWGWFhVzTgc4nhM5w1F2Tu'
      },
      eth: {
        name: 'Ethereum',
        address: '0x3411356C1f0Bf5D859464eD2AC54DD2C222519B7'
      },
      ltc: {
        name: 'Litecoin',
        address: 'LUcHis3B8SFtEeZtuCaZoqsyN9XFAKmbCP'
      }
    }
  }
})
window.addEventListener('hashchange', function () {
  coins.type = window.location.hash.slice(1)
})
</script>

## Recurring Pledges

Recurring pledges come with exclusive perks, e.g. having your name listed in the Vue GitHub repository, or have your company logo placed on this website.

- [Become a backer or sponsor via Patreon](https://www.patreon.com/evanyou) (goes directly to support Evan You's full-time work on Vue)

- [Become a backer or sponsor via OpenCollective](https://opencollective.com/vuejs) (goes into a fund with transparent expense models supporting community efforts and events)

## Current Premium Sponsors:

### Platinum

<p style="text-align: center;">
  <a href="https://stdlib.com">
    <img src="/images/stdlib.png" style="width: 300px;">
  </a>
  <a href="http://tooltwist.com/" target="_blank">
    <img src="/images/tooltwist.png" style="width: 300px;">
  </a>
  <a href="https://www.infinitynewtab.com/donate/index.html" target="_blank">
    <img src="/images/infinitynewtab.png" style="width: 300px">
  </a>
</p>

### OpenCollective Platinum

<p class="open-collective-sponsors sponsor-section">
  <a href="https://opencollective.com/vuejs/tiers/platinum-sponsors/0/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/platinum-sponsors/0/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/platinum-sponsors/1/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/platinum-sponsors/1/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/platinum-sponsors/2/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/platinum-sponsors/2/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/platinum-sponsors/3/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/platinum-sponsors/3/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/platinum-sponsors/4/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/platinum-sponsors/4/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/platinum-sponsors/5/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/platinum-sponsors/5/avatar.svg"></a>
</p>

### Patreon Gold

<p class="patreon-sponsors sponsor-section">
  <a href="https://jsfiddle.net">
    <img src="/images/jsfiddle.png">
  </a><a href="https://laravel.com">
    <img src="/images/laravel.png">
  </a><a href="https://chaitin.cn">
    <img src="/images/chaitin.png">
  </a><a href="https://htmlburger.com" target="_blank">
    <img src="/images/htmlburger.png">
  </a><a href="https://starter.someline.com/" target="_blank">
    <img src="/images/someline.png">
  </a><a href="http://monterail.com/" target="_blank">
    <img src="/images/monterail.png">
  </a><a href="https://www.2mhost.com/" target="_blank">
    <img src="/images/2mhost.png">
  </a><a href="https://vuejobs.com/?ref=vuejs" target="_blank" style="position: relative; top: 6px;">
    <img src="/images/vuejobs.svg">
  </a><a href="https://leanpub.com/vuejs2" target="_blank">
    <img src="/images/tmvuejs2.png">
  </a><a href="https://anymod.com" target="_blank" style="width: 140px;">
    <img src="/images/anymod.png" style="width: 140px;">
  </a><a href="https://www.xfive.co/" target="_blank" style="width: 80px;">
    <img src="/images/xfive.png" style="width: 80px;">
  </a><a href="https://www.frontenddeveloperlove.com/" target="_blank" style="width: 150px;">
    <img src="/images/frontend-love.png" style="width: 150px;">
  </a><a href="https://onsen.io/vue/" target="_blank" style="width: 125px;">
    <img src="/images/onsen-ui.png" style="width: 125px;">
  </a><a href="https://vuetifyjs.com" target="_blank">
    <img src="/images/vuetify.png">
  </a>
</p>

### OpenCollective Gold

<p class="open-collective-sponsors sponsor-section">
  <a href="https://opencollective.com/vuejs/tiers/gold-sponsors/0/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/0/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/1/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/1/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/2/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/2/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/3/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/3/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/4/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/4/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/5/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/5/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/6/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/6/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/7/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/7/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/8/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/8/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/9/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/9/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/10/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/10/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/11/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/11/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/12/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/12/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/13/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/13/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/14/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/14/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/15/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/15/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/16/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/16/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/17/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/17/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/18/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/18/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/19/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/19/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/20/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/20/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/21/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/21/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/22/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/22/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/23/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/23/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/24/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/24/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/25/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/25/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/26/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/26/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/27/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/27/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/28/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/28/avatar.svg"></a><a href="https://opencollective.com/vuejs/tiers/gold-sponsors/29/website" target="_blank"><img src="https://opencollective.com/vuejs/tiers/gold-sponsors/29/avatar.svg"></a>
</p>

If you run a business and are using Vue in a revenue-generating product, it makes business sense to sponsor Vue development: **it ensures the project that your product relies on stays healthy and actively maintained.** It can also help your exposure in the Vue community and makes it easier to attract Vue developers.

If you are a business that is building core products using Vue.js, I am also open to conversations regarding custom sponsorship / consulting arrangements. [Get in touch on Twitter](https://twitter.com/youyuxi).

If you are an individual user and have enjoyed the productivity of using Vue, consider donating as a sign of appreciation - like buying me coffee once in a while :)
