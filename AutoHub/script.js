document.addEventListener("DOMContentLoaded", function () {
  // Initialize Carousel
  initializeCarousel();

  // Fetch Products Data from JSON and Display Products
  loadProducts();

  // Smooth scroll to top
  initializeSmoothScroll();

  // Additional site interactions
  toggleNavigation();

  // Handle search functionality
  initializeSearch();

  // Display search results on the search results page
  displaySearchResults();

  // Display cart items on the cart page
  displayCartItems();
});

function initializeCarousel() {
  $(".carousel").carousel({
    interval: 2000,
  });
}

let products = [];
let cart = [];
// Currency conversion rates
const exchangeRates = {
  USD: 1.3,
  CAD: 1.7,
  NGN: 550,
};

// Currency conversion
document.querySelectorAll(".currency-option").forEach((option) => {
  option.addEventListener("click", function (e) {
    e.preventDefault();
    const selectedCurrency = this.dataset.currency;
    const exchangeRate = exchangeRates[selectedCurrency];
    document.querySelectorAll(".price").forEach((price) => {
      const gbpPrice = parseFloat(price.dataset.price);
      const convertedPrice = (gbpPrice * exchangeRate).toFixed(2);
      price.innerHTML = `${selectedCurrency} ${convertedPrice}`;
    });
    document.getElementById("currencyDropdown").textContent = selectedCurrency;
  });
});

function loadProducts() {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      products = data.products;
      displayProducts(products);
    })
    .catch((err) => console.error("Failed to load products:", err));
}

function displayProducts(products) {
  const productsContainer = document.querySelector("#products-container");
  if (productsContainer) {
    productsContainer.innerHTML = products.map(createProductHTML).join("");
    productsContainer.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", addToCartHandler);
    });
  }
}

function createProductHTML(product) {
  return `
    <div class="col-md-4 mb-4">
      <div class="card">
        <img src="${product.imageUrl}" class="card-img-top" alt="${
    product.name
  }">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${product.description}</p>
          <p class="card-text"><strong>$${product.price.toFixed(2)}</strong></p>
          <a href="#" class="btn btn-primary add-to-cart" data-product-id="${
            product.id
          }">Add to Cart</a>
        </div>
      </div>
    </div>
  `;
}

function addToCartHandler(event) {
  event.preventDefault();
  const productId = this.dataset.productId;
  const product = products.find((p) => p.id == productId);
  addToCart(product);
}

function addToCart(product) {
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Product added to cart!");
}

function displayCartItems() {
  const cartContainer = document.querySelector("#cart-container");
  cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cartContainer) {
    if (cart.length > 0) {
      cartContainer.innerHTML = cart.map(createCartHTML).join("");
      cartContainer.querySelectorAll(".remove-from-cart").forEach((button) => {
        button.addEventListener("click", removeFromCartHandler);
      });
    } else {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    }
  }
}

function createCartHTML(product) {
  return `
    <div class="col-md-4 mb-4">
      <div class="card">
        <img src="${product.imageUrl}" class="card-img-top" alt="${
    product.name
  }">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${product.description}</p>
          <p class="card-text"><strong>$${product.price.toFixed(2)}</strong></p>
          <a href="#" class="btn btn-danger remove-from-cart" data-product-id="${
            product.id
          }">Remove</a>
        </div>
      </div>
    </div>
  `;
}

function removeFromCartHandler(event) {
  event.preventDefault();
  const productId = this.dataset.productId;
  removeFromCart(productId);
  this.closest(".col-md-4").remove();
}

function removeFromCart(productId) {
  cart = cart.filter((product) => product.id != productId);
  localStorage.setItem("cart", JSON.stringify(cart));
}

function initializeSmoothScroll() {
  document
    .querySelector(".back-to-top")
    .addEventListener("click", function (event) {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
}

function toggleNavigation() {
  const navButton = document.querySelector(".nav-toggle");
  const navigation = document.querySelector(".navigation");

  navButton.addEventListener("click", () => {
    navigation.classList.toggle("active");
  });
}

function initializeSearch() {
  const searchForm = document.querySelector("#search-form");
  const searchInput = document.querySelector("#search-input");

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput.value.trim().toLowerCase();
    const searchResults = searchFunc(query, products);
    localStorage.setItem("searchResults", JSON.stringify(searchResults));
    window.location.href = "search_results.html";
  });
}

function searchFunc(query, products) {
  return products.filter(
    (product) =>
      isSimilar(query, product.name.toLowerCase()) ||
      isSimilar(query, product.category.toLowerCase())
  );
}

function isSimilar(query, text) {
  return (
    text.includes(query) || query.split(" ").some((word) => text.includes(word))
  );
}

function displaySearchResults() {
  const searchResults = JSON.parse(localStorage.getItem("searchResults"));
  const searchResultsContainer = document.querySelector(
    "#search-results-container"
  );

  if (searchResultsContainer && searchResults) {
    searchResultsContainer.innerHTML = searchResults
      .map(createSearchResultHTML)
      .join("");
    searchResultsContainer
      .querySelectorAll(".add-to-cart")
      .forEach((button) => {
        button.addEventListener("click", addToCartHandler);
      });
  }
}

function createSearchResultHTML(product) {
  return `
    <div class="col-md-4 mb-4">
      <div class="card">
        <img src="${product.imageUrl}" class="card-img-top" alt="${
    product.name
  }">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${product.description}</p>
          <p class="card-text"><strong>$${product.price.toFixed(2)}</strong></p>
          <a href="#" class="btn btn-primary add-to-cart" data-product-id="${
            product.id
          }">Add to Cart</a>
        </div>
      </div>
    </div>
  `;
}
