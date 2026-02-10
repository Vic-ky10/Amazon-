import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { orders, replaceOrders } from "../data/order.js";
import { addToCart, cart } from "../data/cart.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

const ordersGrid = document.querySelector(".js-orders-grid");

function normalizeOrders(data) {
  if (!data) {
    return [];
  }
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data.orders)) {
    return data.orders;
  }
  return [data];
}

function formatOrderDate(order) {
  const rawDate =
    order.orderTime || order.orderPlaced || order.orderDate || order.date;
  if (!rawDate) {
    return "Unknown date";
  }
  return dayjs(rawDate).format("MMMM D");
}

function formatDeliveryDate(item) {
  const rawDate =
    item.estimatedDeliveryTime || item.deliveryDate || item.arrivalDate;
  if (!rawDate) {
    return "Date unavailable";
  }
  return dayjs(rawDate).format("MMMM D");
}

function getOrderTotalCents(order) {
  if (typeof order.totalCostCents === "number") {
    return order.totalCostCents;
  }

  const items = order.products || order.items || [];
  let total = 0;
  items.forEach((item) => {
    const productId = item.productId || item.id;
    const product = productId ? getProduct(productId) : null;
    if (product) {
      total += product.priceCents * (item.quantity || 1);
    }
  });
  return total;
}

function updateCartQuantity() {
  const cartQuantityElement = document.querySelector(".js-cart-quantity");
  if (!cartQuantityElement) {
    return;
  }

  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  cartQuantityElement.textContent = cartQuantity;
}

function renderOrders(ordersToRender) {
  if (!ordersGrid) {
    return;
  }

  if (!ordersToRender.length) {
    ordersGrid.innerHTML = `
      <div class="order-container">
        <div class="order-details-grid">
          <div class="product-details">
            <div class="product-name">You have no orders yet.</div>
          </div>
        </div>
      </div>
    `;
    return;
  }

  let ordersHtml = "";
  ordersToRender.forEach((order) => {
    const orderDate = formatOrderDate(order);
    const orderTotal = formatCurrency(getOrderTotalCents(order));
    const orderId = order.id || order.orderId || "Unknown ID";
    const items = order.products || order.items || [];

    let itemsHtml = "";
    items.forEach((item) => {
      const productId = item.productId || item.id;
      const productIdValue = productId || "";
      const product = productId ? getProduct(productId) : null;
      const productName = product ? product.name : "Product unavailable";
      const productImage = product ? product.image : "images/amazon-logo.png";
      const quantity = item.quantity || 1;
      const arrivalDate = formatDeliveryDate(item);

      itemsHtml += `
        <div class="product-image-container">
          <img src="${productImage}">
        </div>

        <div class="product-details">
          <div class="product-name">
            ${productName}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${arrivalDate}
          </div>
          <div class="product-quantity">
            Quantity: ${quantity}
          </div>
          <button class="buy-again-button button-primary js-buy-again"
            data-product-id="${productIdValue}">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
          <a href="tracking.html?orderId=123&productId=456">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
    });

    ordersHtml += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderDate}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${orderTotal}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${orderId}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${itemsHtml}
        </div>
      </div>
    `;
  });

  ordersGrid.innerHTML = ordersHtml;

  document.querySelectorAll(".js-buy-again").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      if (!productId) {
        return;
      }
      addToCart(productId);
      updateCartQuantity();
    });
  });
}

async function fetchOrders() {
  try {
    const response = await fetch("https://supersimplebackend.dev/orders");
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    const data = await response.json();
    return normalizeOrders(data);
  } catch (error) {
    console.error("Failed to load orders:", error);
    return [];
  }
}

async function init() {
  if (!ordersGrid) {
    return;
  }

  ordersGrid.innerHTML = `
    <div class="order-container">
      <div class="order-details-grid">
        <div class="product-details">
          <div class="product-name">Loading orders...</div>
        </div>
      </div>
    </div>
  `;

  await loadProductsFetch();

  const fetchedOrders = await fetchOrders();
  if (fetchedOrders.length) {
    replaceOrders(fetchedOrders);
  }

  renderOrders(fetchedOrders.length ? fetchedOrders : orders);
  updateCartQuantity();
}

init();
