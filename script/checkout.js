import { renderOrderSummary } from "./checkout/orderSummary.js";

import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import "../data/back-end-practise.js";
import { loadProducts, loadProductsFetch } from "../data/products.js";
import { loadFromStorage } from "../data/cart.js";
// import '../data/cart-class.js'

async function loadPage() {
  
  await loadProductsFetch();

  const value =  await new Promise((resolve) => {
    loadProducts(() => {
      resolve('value2');
    });
  });

  renderOrderSummary();     // async - await , shortcut for promises  ,  lets us write asynchronous code like normal code.  
                              //  use as
  renderPaymentSummary();
}
loadPage();

/*
Promise.all([
  loadProductsFetch(),
  new Promise((resolve) => {
    loadProducts(() => {
      resolve("productsLoaded");
    });
  }),
  Promise.resolve().then(() => {
    loadFromStorage();
  }),
]).then(() => {
  renderOrderSummary();
  renderPaymentSummary();
});

*/
/*
new Promise((resolve) => {
  loadProducts(() => {
    resolve("value1");
  });
})
  .then((value) => {
    console.log(value);

    return new Promise((resolve) => {
      loadCart(() => {
        resolve();
      });
    });
  })
  .then(() => {
    renderOrderSummary();
    renderPaymentSummary();
  });
*/
/*
loadProducts(() => {
  loadCart(() => {
    renderOrderSummary();
     renderPaymentSummary();
  });
});
*/
