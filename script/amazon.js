import { cart, addToCart } from "../data/cart.js";

import { products, loadProducts } from "../data/products.js";
// import { formatCurrency } from "./utils/money.js";

const searchInputElement = document.querySelector(".search-bar");
const searchButtonElement = document.querySelector(".search-button");
const productsGridElement = document.querySelector(".js-products-grid");

function getSearchQueryFromUrl() {
  const url = new URL(window.location.href);
  return (url.searchParams.get("search") || "").trim().toLowerCase();
}

function getFilteredProducts(searchQuery) {
  if (!searchQuery) {
    return products;
  }

  return products.filter((product) => {
    const nameMatches = product.name.toLowerCase().includes(searchQuery);
    const keywordMatches = product.keywords.some((keyword) =>
      keyword.toLowerCase().includes(searchQuery)
    );
    return nameMatches || keywordMatches;
  });
}

function updateSearchQueryInUrl(searchQuery) {
  const url = new URL(window.location.href);

  if (searchQuery) {
    url.searchParams.set("search", searchQuery);
  } else {
    url.searchParams.delete("search");
  }

  history.replaceState({}, "", url);
}

function runSearch() {
  if (!searchInputElement) {
    return;
  }

  const searchQuery = searchInputElement.value.trim().toLowerCase();
  updateSearchQueryInUrl(searchQuery);
  renderProductsGrid(getFilteredProducts(searchQuery));
}

function setupSearch() {
  if (!searchInputElement || !searchButtonElement) {
    return;
  }

  searchInputElement.value = getSearchQueryFromUrl();

  searchButtonElement.addEventListener("click", runSearch);

  searchInputElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      runSearch();
    }
  });
}

loadProducts(() => {
  const searchQuery = getSearchQueryFromUrl();

  if (searchInputElement) {
    searchInputElement.value = searchQuery;
  }

  renderProductsGrid(getFilteredProducts(searchQuery));
  addCartQuantity();
});

setupSearch();

function renderProductsGrid(productsToRender) {
  if (!productsGridElement) {
    return;
  }

  let productsHTML = " ";

  productsToRender.forEach((product) => {
    productsHTML += `
<div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines ">
           ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="${product.getStarsUrl()}">
            <div class="product-rating-count link-primary">
             ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
          ${product.getPrice()}
          </div>

          <div class="product-quantity-container">
            <select>
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option> 
              <option value="8">8</option>
              <option value="9">9</option>          
              <option value="10">10</option>  
            </select>
          </div>
        
          
          ${product.extraInfoHtml()}


          <div class="product-spacer"></div>

          <div class="added-to-cart">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart"data-product-id="${product.id}">
            add to cart
          </button>
        </div>
`;
  });

  if (!productsToRender.length) {
    productsGridElement.innerHTML = "<p>No products match your search.</p>";
    return;
  }

  productsGridElement.innerHTML = productsHTML;

  document.querySelectorAll(".js-add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      addToCart(productId);

      addCartQuantity();
    });
  });
}
export function addCartQuantity() {
  const cartQuantityElement = document.querySelector(".js-cart-quantity");

  if (!cartQuantityElement) {
    return;
  }

  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  cartQuantityElement.innerHTML = cartQuantity;
}
