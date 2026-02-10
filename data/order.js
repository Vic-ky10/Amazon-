export const orders = JSON.parse(localStorage.getItem("orders")) || [];

export function addOrders(order) {
  orders.unshift(order);
  saveToStorage();
}

export function replaceOrders(nextOrders) {
  orders.length = 0;
  orders.push(...nextOrders);
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem("orders", JSON.stringify(orders));
}
