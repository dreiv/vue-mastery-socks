var app = new Vue({
  el: '#app',
  data: {
    product: 'Socks',
    image: './assets/vmSocks-green.png',
    altText: "A pair of socks",
    inventory: 100,
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
    cart: 0
  },
  methods: {
    addToCart() {
      this.cart++;
    },
    updateProduct(variantImage) {
      this.image = variantImage;
    }
  }
});
