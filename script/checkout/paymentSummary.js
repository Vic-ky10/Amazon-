import { cart } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/money.js";
import { addOrders, orders } from "../../data/order.js";

const productById = buildLookup(products, "id");
const deliveryOptionById = buildLookup(deliveryOptions, "id");

function buildLookup(list, key) {
  const lookup = {};
  list.forEach((item) => {
    lookup[item[key]] = item;
  });
  return lookup;
}

function calculateTotals() {
  let itemCount = 0;
  let itemsTotalCents = 0;
  let shippingTotalCents = 0;

  cart.forEach((cartItem) => {
    itemCount += cartItem.quantity;

    const product = productById[cartItem.productId];
    if (product) {
      itemsTotalCents += product.priceCents * cartItem.quantity;
    }

    const deliveryOptionId = cartItem.deliveryOptionId || deliveryOptions[0].id;
    const deliveryOption =
      deliveryOptionById[deliveryOptionId] || deliveryOptions[0];
    shippingTotalCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = itemsTotalCents + shippingTotalCents;
  const taxCents = Math.round(totalBeforeTaxCents * 0.1);
  const orderTotalCents = totalBeforeTaxCents + taxCents;

  return {
    itemCount,
    itemsTotalCents,
    shippingTotalCents,
    totalBeforeTaxCents,
    taxCents,
    orderTotalCents,
  };
}

function renderPaymentSummaryHtml(totals) {
  return `
    <div class="payment-summary-title">Order Summary</div>

    <div class="payment-summary-row">
      <div>Items (${totals.itemCount}):</div>
      <div class="payment-summary-money">$${formatCurrency(totals.itemsTotalCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatCurrency(totals.shippingTotalCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(totals.totalBeforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(totals.taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatCurrency(totals.orderTotalCents)}</div>
    </div>

    <button class="place-order-button button-primary
    js-place-order" >
      Place your order
    </button>
  `;
}

function updateCheckoutHeader(itemCount) {
  const checkoutCart = document.querySelector(".checkout-cart-js");
  if (!checkoutCart) {
    return;
  }
  const itemLabel = itemCount === 1 ? "item" : "items";
  checkoutCart.textContent = ` ${itemCount} ${itemLabel}`;
}

export function renderPaymentSummary() {
  const totals = calculateTotals();
  const paymentSummary = document.querySelector(".payment-summary");
  if (paymentSummary) {
    paymentSummary.innerHTML = renderPaymentSummaryHtml(totals);
  }
  updateCheckoutHeader(totals.itemCount);
  attachPlaceOrderHandler();
}

function attachPlaceOrderHandler() {
  const placeOrderButton = document.querySelector(".js-place-order");
  if (!placeOrderButton) {
    return;
  }

  placeOrderButton.addEventListener("click", async () => {
    try {
      const response = await fetch("https://supersimplebackend.dev/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: cart,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const order = await response.json();
      addOrders(order);
      window.location.href = "orders.html";
    } catch (error) {
      console.log("Unexpected error. Try again later.", error);
    }
  });
}
