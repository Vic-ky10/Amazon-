import { renderOrderSummary } from "../../script/checkout/orderSummary.js";
import { loadFromStorage } from "../../data/cart.js";
import { loadProducts } from "../../data/products.js";

describe("test suite : renderOrderSummary", () => {
  const productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
  const productId2 = "15b6fc6f-327a-4ec4-896f-486349e85a3d";

  beforeAll((done) => {
    loadProducts(() => {
      done();
    });
  });

  beforeEach(() => {
    spyOn(localStorage, "setItem");
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
        {
          productId: productId1,
          quantity: 2,
          deliveryOptionId: "1",
        },
        {
          productId: productId2,
          quantity: 1,
          deliveryOptionId: "2",
        },
      ]);
    });

    loadFromStorage();

    document.querySelector(".js-test-container").innerHTML = `
      <div class="data-order-summary"></div>
      <div class="payment-summary"></div>
    `;

    renderOrderSummary();
  });

  it("displays the cart", () => {
    expect(document.querySelectorAll(".js-cart-item-container").length).toEqual(
      2,
    );
    expect(
      document.querySelector(`.js-product-quantity-${productId1}`).innerText,
    ).toContain("Quantity: 2");
    expect(
      document.querySelector(`.js-product-quantity-${productId2}`).innerText,
    ).toContain("Quantity: 1");
  });

  it("removes a product", () => {
    document
      .querySelector(`.js-delete-link[data-product-id="${productId1}"]`)
      .click();

    expect(document.querySelectorAll(".js-cart-item-container").length).toEqual(
      1,
    );
    expect(
      document.querySelector(`.js-cart-item-container-${productId1}`),
    ).toBeNull();
    expect(localStorage.setItem).toHaveBeenCalled();
  });
});
