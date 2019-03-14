---
title: Themes
type: guide
order: 804
---
{% raw %}
<div id="themes">
  <section v-for="partner in partners" :key="partner.name" class="partner-wrapper">
    <partner-component :partner="partner"></partner-component>
  </section>
</div>

<script type="text/template" id="partnerTemplate">
  <div>
    <h2 :id="partner.name">{{partner.name}}</h2>
    <blockquote class="theme-partner-description" v-html="partnerDescription"></blockquote>
    <div class="themes-grid">
      <div v-for="product in partner.products" :key="product.name" class="item-preview">
        <a class="item-preview-img" :href="product.url" rel="nofollow">
        <img :src="product.image" :alt="`${product.name} - ${product.description}`"></a>
        <div class="item-preview-name-container">
          <h3 class="item-preview-name" :class="{'free': product.free}">{{product.name}}</h3>
          <b v-if="product.price" class="item-preview-price">{{product.price}}$</b>
        </div>
        <div class="item-preview-description">{{product.description}}</div>
      </div>
      <div class="see-more-container">
        <a :href="partner.seeMoreUrl" class="button white see-more-link">See More Themes from {{partner.name}}</a>
      </div>
    </div>
  </div>
</script>

<script>
var mdConverter = new showdown.Converter()

Vue.component('partner-component', {
  template: document.getElementById('partnerTemplate').innerHTML,
  props: {
    partner: {
      type: Object,
      required: true
    }
  },
  computed: {
    partnerDescription: function () {
      return mdConverter.makeHtml(this.partner.description)
    }
  }
})

const app = new Vue({
  el: '#themes',
  data: function () {
    return {
      partners: themeData
    }
  }
})
</script>
{% endraw %}
