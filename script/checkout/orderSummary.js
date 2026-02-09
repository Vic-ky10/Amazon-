import { cart, removeFromCart, updateDeliveryOption } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { hello } from "https://unpkg.com/supersimpledev@1.0.1/hello.esm.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

const today = dayjs();
hello();

const deliveryDate = today.add(7, "day");
console.log(deliveryDate.format("dddd, MMMM D"));

export function renderOrderSummary() {
  let cartSummaryHTML = " ";
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    let matchingProduct;

    products.forEach((product) => {
      if (product.id === productId) {
        matchingProduct = product;
      }
    });

    const deliveryOptionId = cartItem.deliveryOptionId || deliveryOptions[0].id;
    const deliveryOption =
      deliveryOptions.find((option) => option.id === deliveryOptionId) ||
      deliveryOptions[0];

    const deliveryDate = today.add(deliveryOption.deliveryDays, "day");
    const dateString = deliveryDate.format("dddd, MMMM D");

    cartSummaryHTML += `
  <div class="cart-item-container
  js-cart-item-container 
   js-cart-item-container-${matchingProduct.id}">
    <div class="delivery-date" >
     Delivery date: ${dateString}
   
    </div>

    <div class="cart-item-details-grid">
    <img class="product-image"
        src="${matchingProduct.image}">

    <div class="cart-item-details">
        <div class="product-name">
     ${matchingProduct.name}
        </div>
        <div class="product-price">
       ${formatCurrency(matchingProduct.priceCents)}
        </div>
        <div class="product-quantity js-product-quantity-${matchingProduct.id}">
        <span>
            Quantity: <span class="quantity-label">${cartItem.quantity}</span>
        </span>
        <span class="update-quantity-link link-primary">
            Update
        </span>
        

        <span class="delete-quantity-link link-primary js-delete-link-${matchingProduct.id}
        " data-product-id="${matchingProduct.id}">
            Delete
        </span>
        </div>
    </div>


    <div class="delivery-options">
        <div class="delivery-options-title">
        Choose a delivery option:
        </div>
    
    
        ${deliveryOptionsHtml(matchingProduct, cartItem)}
    </div>
    </div>
    </div> 

    `;
  });

  document.querySelector(".data-order-summary").innerHTML = cartSummaryHTML;

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);

      const buttons = document.querySelector(
        `.js-cart-item-container-${productId}`,
      );
      buttons.remove();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll(".js-delivery-option").forEach((input) => {
    input.addEventListener("change", () => {
      const { productId, deliveryOptionId } = input.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}

function deliveryOptionsHtml(matchingProduct, cartItem) {
  let html = "";
  deliveryOptions.forEach((deliveryOption) => {
    const deliveryDate = today.add(deliveryOption.deliveryDays, "day");
    const dateString = deliveryDate.format("dddd, MMMM D");

    const priceString =
      deliveryOption.priceCents === 0
        ? "FREE Shipping"
        : `${formatCurrency(deliveryOption.priceCents)} - Shipping`;

    const isChecked =
      deliveryOption.id ===
      (cartItem.deliveryOptionId || deliveryOptions[0].id);

    html += `
     <div class="delivery-option">
        <input type="radio" 
        ${isChecked ? "checked" : ""}
        class="delivery-option-input js-delivery-option"
            data-product-id="${matchingProduct.id}"
            data-delivery-option-id="${deliveryOption.id}"
            name="delivery-option-${matchingProduct.id}">
        <div>
            <div class="delivery-option-date">
           ${dateString}
            </div>
            <div class="delivery-option-price">
          ${priceString}
            </div>
        </div>
        </div>`;
  });
  return html;
}
