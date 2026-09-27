import { loadHeaderFooter } from "../js/utils.mjs";
import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>

 

  <p class="cart-card__quantity">qty: 1</p>
<p class="cart-card__price">$${item.FinalPrice}</p>
<button class="cart-card__remove" data-id="${item.Id}">X</button>
</li>`;

  return newItem;
}

function removeFromCart(event) {
  const productId = event.target.dataset.id;
  const cartItems = getLocalStorage("so-cart");

  const updatedCart = cartItems.filter(
    (item) => item.Id !== productId
  );

  localStorage.setItem("so-cart", JSON.stringify(updatedCart));

  renderCartContents();
}
renderCartContents();

document.querySelector(".product-list").addEventListener("click", removeFromCart);

loadHeaderFooter();