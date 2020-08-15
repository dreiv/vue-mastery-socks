Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
    <div class="product">
      <div class="product-image">
        <img :src="image" :alt="altText">
      </div>

      <div class="product-info">
        <h1>{{ title }}</h1>
        <p v-if="inStock > 10">In Stock</p>
        <p v-else-if="inStock > 0 && inStock <= 10">Almost out of Stock</p>
        <p v-else>Out of Stock</p>

        <p>Shipping: {{ shipping }}</p>

        <ul>
          <li v-for="detail in details">{{ detail }}</li>
        </ul>

        <div v-for="(variant, index) in variants" :key="variant.variantId" class="color-box"
          :style="{ backgroundColor: variant.variantColor }" @mouseover="updateProduct(index)">
        </div>

        <button @click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">
          Add to Cart
        </button>
      </div>
    </div>
  `,
  data() {
    return {
      brand: 'Vue Mastery',
      product: 'Socks',
      selectedVariant:0,
      altText: "A pair of socks",
      details: [
        '80% cotton',
        '20% polyester',
        'Gender-neutral'
      ],
      variants: [
        {
          variantId: 2234,
          variantColor: 'green',
          variantImage: './assets/vmSocks-green.png',
          variantQuantity: 10
        },
        {
          variantId: 2235,
          variantColor: 'blue',
          variantImage: './assets/vmSocks-blue.png',
          variantQuantity: 0
        }
      ]
    }
  },
  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.selectedVariant.variantId);
    },
    updateProduct(index) {
      this.selectedVariant = index;
    }
  },
  computed: {
    title() {
      return `${this.brand} ${this.product}`
    },
    image() {
      return this.variants[this.selectedVariant].variantImage
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity
    },
    shipping() {
      return this.premium ? 'Free' : '2.99';
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    }
  }
});
