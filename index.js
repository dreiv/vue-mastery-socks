var eventBus = new Vue();

Vue.filter('capitalize', (value) => {
  if (!value) return '';
  value = value.toString();

  return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.component('product-review', {
  template: `
    <form @submit.prevent="onSubmit" class="review-form">
      <label>
        Name:<br>
        <input v-model="name">
      </label>

      <label>
        Review:<br>
        <textarea v-model="review"/>
      </label>

      <label>
        Rating:
        <select v-model.number="rating">
        <option v-for="option in 5" :value="option">
          {{ option }}
        </option>
        </select>
      </label>

      <p>
        <input type="submit" value="Submit">
      </p>

      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>

        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>
    </form>
  `,
  data: () => ({
    name: null,
    review: null,
    rating: null,
    errors: []
  }),
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating
        };
        eventBus.$emit('review-submitted', productReview);

        this.name = null;
        this.review = null;
        this.rating = null;
      } else {
        if (!this.name) this.errors.push('Name required');
        if (!this.review) this.errors.push('Review required');
        if (!this.rating) this.errors.push('Rating required');
      }

    }
  }
});

Vue.component('product-tabs', {
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },
  template: `
    <div>
      <span
        class="tab"
        :class="{ activeTab: selectedTab === tab}"
        v-for="(tab, index) in tabs"
        :key="index"
        @click="selectedTab = tab">
        {{ tab }}</span>

      <div v-show="selectedTab === 'Reviews'">
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul v-else>
          <li v-for="review in reviews">
            <p v-for="(value, name) in review">
              {{ name | capitalize }}: {{ value }}
            </p>
          </li>
        </ul>
      </div>

      <product-review
        v-show="selectedTab === 'Make a Review'"
      />
    </div>
  `,
  data: () => ({
    tabs: ['Reviews', 'Make a Review'],
    selectedTab: 'Reviews'
  })
})

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

        <product-tabs :reviews="reviews" />
      </div>
    </div>
  `,
  data: () => ({
    brand: 'Vue Mastery',
    product: 'Socks',
    selectedVariant: 0,
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
    ],
    reviews: []
  }),
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
  },
  mounted() {
    eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview);
    })
  }
});

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
