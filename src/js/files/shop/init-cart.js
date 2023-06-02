import { Cart } from "./classes/Cart.js";
import { renderPicture, renderPriceInfo } from "./functions.js";
import { postData } from "./api-request.js";
import { FlashMessage } from "./classes/FlashMessage.js";

export function initCart() { 
   const orderContainer = document.querySelector(".form-order__list"); 
   const totalSum = document.querySelector(".form-submit_sum-value");
   const cartIcon = document.querySelector(".header__cart");

   // Відображаємо число товарів в корзині
   if (localStorage.getItem("cart") !== null) {
      const productsInCart = JSON.parse(localStorage.getItem("cart"));
      cartIcon.textContent = productsInCart.length;
   }

   const cart = new Cart();
   
   if (Object.keys(cart.products).length === 0) {
      orderContainer.textContent = "Корзина пуста";
      totalSum.textContent = (0).toFixed(2);
   } else {
      for (const key in cart.products) {
         orderContainer.append(renderProduct(cart.products[key]));
         totalSum.textContent = cart.getTotalSum().toFixed(2);
      }
   }

   orderContainer.addEventListener("click", (e) => {
      const el = e.target;
      const cardClass = ".primary-card-gorizontal";      
      const closestCard = el.closest(cardClass);
      const productId = +closestCard.dataset.productId;
      const priceValue = closestCard.querySelectorAll(cardClass + "__price-value")[1];
      
      if (el.closest(cardClass + "__remove-btn")) {
         cart.remove(productId);
         closestCard.remove();
         totalSum.textContent = cart.getTotalSum().toFixed(2);
         cartIcon.textContent = cartIcon.textContent - 1;
         if (orderContainer.childNodes.length === 0) {
            orderContainer.textContent = "Корзина пуста";
            cartIcon.textContent = "";
         }
      }
      if (el.closest(".quantity__button_plus")) {
         cart.increaseQuantiti(productId);         
         priceValue.textContent = cart.getItemSum(productId).toFixed(2);
         totalSum.textContent = cart.getTotalSum().toFixed(2);
      }
      if (el.closest(".quantity__button_minus")) {
         cart.decreaseQuantity(productId);         
         priceValue.textContent = cart.getItemSum(productId).toFixed(2);
         totalSum.textContent = cart.getTotalSum().toFixed(2);
      }
   });
   // Після валідації форми генерується подія formSent. В цьому місці ми її перехоплюємо
   document.addEventListener("formSent", (e) => {
      if (Object.keys(cart.products).length !== 0) { 
         const requestData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            adress: document.getElementById("adress").value,
            products: cart.products,
         };
         cart.clear();
         orderContainer.textContent = "Корзина пуста";
         cartIcon.textContent = "";
         postData("orders", requestData).then(() => {
            FlashMessage.success("Замовлення відправлено!!!");
         });
      }      
   });
}

function renderProduct(product) {
   const productCard = document.createElement("div");
   productCard.classList = "form-order__item primary-card-gorizontal";
   productCard.setAttribute("data-product-id", product.id);

   // picture
   productCard.append(renderPicture(product, "primary-card-gorizontal"));

   // <div class="primary-card-gorizontal__body">
   const divBody = document.createElement("div");
   divBody.classList = "primary-card-gorizontal__body";
   productCard.append(divBody);

   // <div class="primary-card-gorizontal__info"></div>
   const divInfo = document.createElement("div");
   divInfo.classList = "primary-card-gorizontal__info";
   divBody.append(divInfo);

   // <h4 class="primary-card-gorizontal__title">Ємності для палива Parallel</h4>;
   const h4Title = document.createElement("h4");
   h4Title.classList = "primary-card-gorizontal__title";
   h4Title.textContent = `${product.title} (${product.shopTitle})`;
   divInfo.append(h4Title);

   // price
   divInfo.append(renderPriceInfo(product.price, "primary-card-gorizontal"));

   // <div class="primary-card-gorizontal__bottom"></div>
   const divBottom = document.createElement("div");
   divBottom.classList = "primary-card-gorizontal__bottom";
   divBody.append(divBottom);

   //<div data-quantity class="primary-card-gorizontal__quantity quantity">
   const divQuantity = document.createElement("div");
   divQuantity.classList = "primary-card-gorizontal__quantity quantity";
   divQuantity.setAttribute("data-quantity", "");
   divBottom.append(divQuantity);

   //<button data-quantity-plus type="button" class="quantity__button quantity__button_plus"></button>
   const buttonQuantityPlus = document.createElement("button");
   buttonQuantityPlus.classList = "quantity__button quantity__button_plus";
   buttonQuantityPlus.setAttribute("type", "button");
   buttonQuantityPlus.setAttribute("data-quantity-plus", "");
   divQuantity.append(buttonQuantityPlus);

   // <<div class="quantity__input"></div>
   const divQuantityInput = document.createElement("div");
   divQuantityInput.classList = "quantity__input";
   divQuantity.append(divQuantityInput);

   // <input data-quantity-value autocomplete="off" type="text" name="form[quantity]" value="1"></input>
   const inputQuantity = document.createElement("input");
   inputQuantity.setAttribute("type", "text");
   inputQuantity.setAttribute("data-quantity-value", "");
   inputQuantity.setAttribute("autocomplete", "off");
   inputQuantity.setAttribute("disabled", "");
   inputQuantity.name = `form[quantity${product.id}]`;
   inputQuantity.value = product.quantity;
   divQuantityInput.append(inputQuantity);

   //<button data-quantity-minus type="button" class="quantity__button quantity__button_minus"></button>
   const buttonQuantityMinus = document.createElement("button");
   buttonQuantityMinus.setAttribute("type", "button");
   buttonQuantityMinus.classList = "quantity__button quantity__button_minus";
   buttonQuantityMinus.setAttribute("data-quantity-minus", "");
   divQuantity.append(buttonQuantityMinus);

   // total-price
   divBottom.append(
      renderPriceInfo(product.price * product.quantity, "primary-card-gorizontal")
   );

   // <div class="primary-card-gorizontal__remove">
   const divRemove = document.createElement("div");
   divRemove.classList = "primary-card-gorizontal__remove";
   divBottom.append(divRemove);

   // <button type="button" class="primary-card-gorizontal__remove-btn">x</button>
   const buttonRemove = document.createElement("button");
   buttonRemove.setAttribute("type", "button");
   buttonRemove.classList = "primary-card-gorizontal__remove-btn";
   buttonRemove.textContent = "x";

   divRemove.append(buttonRemove);

   return productCard;
}


