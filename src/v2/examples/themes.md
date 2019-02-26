---
title: Themes
type: examples
is_new: true
order: 13
---
> With the examples below built by our partners from [Creative Tim](https://creative-tim.com?affiliate_id=116187) you can see how a real world application is built, the technology stack behind it and how most of the concepts you've learned so far apply in a real world application. 

{% raw %}
<div id="themes-example" class="themes-grid">
   <div v-for="product in products" :key="product.name" class="item-preview">
     <a class="item-preview-img" v-bind:href="`https://www.creative-tim.com/product/${product.name}?affiliate_id=${affiliateId}`" rel="nofollow">
     <img :src="`https://raw.githubusercontent.com/creativetimofficial/public-assets/master/${product.name}/${product.name}.jpg`" :alt="`${product.title} - ${product.description}`"></a>
     <div class="item-preview-title-container">
      <h3 class="item-preview-title" :class="{'free': product.free}">{{product.title}}</h3>
      <b v-if="product.price" class="item-preview-price">{{product.price}}$</b>
     </div>
     <div class="item-preview-description">{{product.description}}</div>
   </div>
   <div class="see-more-container">
    <a :href="`https://www.creative-tim.com/bootstrap-themes/vuejs-themes?affiliate_id=${affiliateId}`"
       class="button white see-more-link">
       See More Themes
    </a>
   </div>
</div>
<script>
new Vue({
  el: '#themes-example',
  data: {
    affiliateId: 116187,
    products: [
      {
        name: 'vue-argon-design-system',
        title: 'Vue Argon Design System',
        free: true,
        description: 'Free Vue.js Design System',
        image: 'https://s3.amazonaws.com/creativetim_bucket/products/92/original/opt_argon_vue_thumbnail.jpg',
      },
      {
        name: 'vue-black-dashboard-pro',
        title: 'Vue Black Dashboard Pro',
        free: false,
        price: 59,
        description: 'Premium Vue.js Admin Template',
        image: 'https://s3.amazonaws.com/creativetim_bucket/products/135/original/opt_bdp_vue_thumbnail.jpg',
      },
      {
        name: 'vue-paper-dashboard-2-pro',
        title: 'Vue Paper Dashboard 2 Pro',
        free: false,
        price: 59,
        description: 'Premium Vue.js Admin Template',
        image: 'https://s3.amazonaws.com/creativetim_bucket/products/88/original/opt_pd2p_vue_thumbnail.jpg',
      },
      {
        name: 'vue-material-kit',
        title: 'Vue Material Kit',
        free: true,
        description: 'Free Vue.js UI Kit',
        image: 'https://s3.amazonaws.com/creativetim_bucket/products/97/original/opt_mk_vue_thumbnail.jpg',
      },
      {
        name: 'vue-black-dashboard',
        title: 'Vue Black Dashboard',
        free: true,
        description: 'Free Vue.js Admin Template',
        image: 'https://s3.amazonaws.com/creativetim_bucket/products/99/original/opt_bd_vue_thumbnail.jpg',
      },
      {
        name: 'vue-now-ui-kit-pro',
        title: 'Vue Now UI Kit Pro',
        free: false,
        price: 79,
        description: 'Premium Vue.js UI Kit',
        image: 'https://s3.amazonaws.com/creativetim_bucket/products/91/original/opt_nukp_vue_thumbnail.jpg',
      },
      {
        name: 'vue-now-ui-dashboard-pro',
        title: 'Vue Now UI Dashboard Pro',
        free: false,
        price: 59,
        description: 'Premium Vue.js Admin Template',
        image: 'https://s3.amazonaws.com/creativetim_bucket/products/79/original/opt_nudp_vue_thumbnail.jpg',
      },
      {
        name: 'vue-now-ui-kit',
        title: 'Vue Now UI Kit',
        free: true,
        description: 'Free Vue.js UI Kit',
        image: 'https://s3.amazonaws.com/creativetim_bucket/products/94/original/opt_nuk_vue_thumbnail_%281%29.jpg',
      },
      {
        name: 'vue-light-bootstrap-dashboard-pro',
        title: 'Vue Light Bootstrap Dashboard Pro',
        free: false,
        price: 49,
        description: 'Premium Vue.js Admin Template',
        image: 'https://s3.amazonaws.com/creativetim_bucket/products/69/original/opt_lbdp_vue_thumbnail.jpg',
      },
      {
        name: 'vue-material-dashboard-pro',
        title: 'Vue Material Dashboard Pro',
        free: false,
        price: 59,
        description: 'Premium Vue.js Admin Template',
        image: 'https://s3.amazonaws.com/creativetim_bucket/products/87/original/opt_mdp_vue_thumbnail.jpg',
      },
      {
        name: 'vue-material-kit-pro',
        title: 'Vue Material Kit Pro',
        free: false,
        price: 89,
        description: 'Premium Vue.js UI Kit',
        image: 'https://s3.amazonaws.com/creativetim_bucket/products/139/original/opt_mkp_vue_thumbnail.jpg',
      },
      {
        name: 'vue-light-bootstrap-dashboard',
        title: 'Vue Light Bootstrap Dashboard',
        free: true,
        description: 'Free Vue.js Admin Template',
        image: 'https://s3.amazonaws.com/creativetim_bucket/products/67/original/opt_lbd_vue_thumbnail.jpg',
      },
    ]
  }
})
</script>
{% endraw %}
