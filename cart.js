/* ================================
   SAFE ELEMENT LOOKUPS
================================ */
const cartItemsEl = document.getElementById("cart-items");
const cartSummaryEl = document.getElementById("cart-summary");
const isCartPage = !!cartItemsEl && !!cartSummaryEl;

/* ================================
   ADD TO CART (PRODUCT PAGES)
================================ */
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartBadge();
}

/* ================================
   CART ICON BADGE
================================ */
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const badge = document.getElementById("cartBadge");
  if (!badge) return;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? "inline-block" : "none";
}

/* ================================
   CART PAGE RENDER
================================ */
function renderCart() {
  if (!isCartPage) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    cartItemsEl.innerHTML =
      `<tr><td colspan="5" style="text-align:center;">Your cart is empty</td></tr>`;
    cartSummaryEl.textContent = "Total: $0";
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    cartItemsEl.innerHTML += `
      <tr>
        <td>
          <div class="cart-product">
            <img src="${item.image}" alt="${item.title}">
            <span>${item.title}</span>
          </div>
        </td>
        <td>$${item.price.toFixed(2)}</td>
        <td>
          <input type="number" min="1"
            class="quantity-input"
            value="${item.quantity}"
            onchange="updateQuantity('${item.id}', this.value)">
        </td>
        <td>$${itemTotal.toFixed(2)}</td>
        <td>
          <button class="remove-btn" onclick="removeFromCart('${item.id}')">
            Remove
          </button>
        </td>
      </tr>
    `;
  });

  cartSummaryEl.textContent = `Total: $${total.toFixed(2)}`;
}

/* ================================
   UPDATE QUANTITY
================================ */
function updateQuantity(id, qty) {
  qty = Math.max(1, Number(qty));

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.map(item =>
    item.id === id ? { ...item, quantity: qty } : item
  );

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartBadge();
}

/* ================================
   REMOVE ITEM
================================ */
function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.id !== id);

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartBadge();
}

/* ================================
   INIT ON PAGE LOAD
================================ */
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCartBadge();
});
