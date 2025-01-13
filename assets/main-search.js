class MainSearch extends SearchForm {
  constructor() {
    super();
    this.allSearchInputs = document.querySelectorAll('input[type="search"]');
    this.setupEventListeners();
  }

  setupEventListeners() {
    let allSearchForms = [];
    this.allSearchInputs.forEach((input) => allSearchForms.push(input.form));
    this.input.addEventListener('focus', this.onInputFocus.bind(this));
    if (allSearchForms.length < 2) return;
    allSearchForms.forEach((form) => form.addEventListener('reset', this.onFormReset.bind(this)));
    this.allSearchInputs.forEach((input) => input.addEventListener('input', this.onInput.bind(this)));
  }

  onFormReset(event) {
    super.onFormReset(event);
    if (super.shouldResetForm()) {
      this.keepInSync('', this.input);
    }
  }

  onInput(event) {
    const target = event.target;
    this.keepInSync(target.value, target);
  }

  onInputFocus() {
    const isSmallScreen = window.innerWidth < 750;
    if (isSmallScreen) {
      this.scrollIntoView({ behavior: 'smooth' });
    }
  }

  keepInSync(value, target) {
    this.allSearchInputs.forEach((input) => {
      if (input !== target) {
        input.value = value;
      }
    });
  }
}

customElements.define('main-search', MainSearch);

<script>

document.addEventListener("DOMContentLoaded", function () {
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");
  const nextButton = document.getElementById("next-to-step-2");
  const addToCartButton = document.getElementById("add-to-cart");

  // Move to Step 2
  nextButton.addEventListener("click", function () {
    const selectedBox = document.querySelector('input[name="box"]:checked');
    if (!selectedBox) {
      alert("Please select a box before proceeding.");
      return;
    }
    step1.classList.remove("active");
    step2.classList.add("active");
  });

  // Add to Cart Functionality
  addToCartButton.addEventListener("click", function () {
    const selectedBox = document.querySelector('input[name="box"]:checked').value;
    const selectedProducts = Array.from(document.querySelectorAll('input[name="products"]:checked')).map(input => input.value);

    if (selectedProducts.length === 0) {
      alert("Please select at least one product to add to the box.");
      return;
    }

    // Add the box and products to the cart
    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: [
          { id: selectedBox, quantity: 1 },
          ...selectedProducts.map(id => ({ id, quantity: 1 }))
        ]
      })
    })
    .then(response => response.json())
    .then(data => {
      window.location.href = '/cart';
    })
    .catch(error => console.error('Error:', error));
  });
});
 
</script>