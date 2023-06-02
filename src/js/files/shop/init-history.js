import { getData } from "./api-request.js";
import { formValidate } from "../forms/forms.js";
import { clearContainer, renderClientInfo, renderPriceInfo, renderPicture } from "./functions.js";

export function initHistory() { 
   const requestParams = {};   
   const emailInput = document.getElementById("email");
   const phoneInput = document.getElementById("phone");
   const ordersContainer = document.querySelector(".orders");

   // Подія при вводі email
   emailInput.addEventListener("keypress", (e) => {      
      if (e.key === "Enter") { 
         e.preventDefault();
         clearContainer(".orders");
         phoneInput.value = "";

         const element = e.target;
         const email = element.value.trim();          
         if (formValidate.emailTest(element)) {
            formValidate.addError(element);
         } else {
            formValidate.removeError(element);
            requestParams.email = email;
            requestParams.phone = '';
            getData('orders', requestParams).then((data) => {
               data.forEach((item) => ordersContainer.append(renderOrder(item)));
            });
         };
      }
   });

   // Подія при вводі телефону
   phoneInput.addEventListener("keypress", (e) => {      
      if (e.key === "Enter") { 
         e.preventDefault();
         clearContainer(".orders");
         emailInput.value = "";cl

         const element = e.target;
         const phone = element.value.trim();          
         requestParams.email = '';
         requestParams.phone = phone;
         getData('orders', requestParams).then((data) => {
            clearContainer(".orders");
            data.forEach((item) => ordersContainer.append(renderOrder(item)));
         });
      }
   });
}

function renderOrder(order) {
   const orderCard = document.createElement("div");
   orderCard.classList = "orders__item";

   const divInfo = document.createElement("div");
   divInfo.classList = "orders__info";
   orderCard.append(divInfo);

   const ulClientInfo = document.createElement("ul");
   ulClientInfo.classList = "orders__client-info";
   divInfo.append(ulClientInfo);

   ulClientInfo.append(renderClientInfo("Ім'я", order.client_name));
   ulClientInfo.append(renderClientInfo("E-mail", order.email));
   ulClientInfo.append(renderClientInfo("Телефон", order.phone));
   ulClientInfo.append(renderClientInfo("Алреса", order.adress));

   const status = document.createElement("div");
   status.classList = "orders__status";
   divInfo.append(status);

   const statusLable = document.createElement("div");
   statusLable.classList = "orders__status-lable";
   
   if (+order.status.id === 1) statusLable.classList.add("done");
   else statusLable.classList.add("process");
   statusLable.textContent = order.status.name;
   status.append(statusLable);

   const totalSum = order.products.reduce((acc, item) => {
      return acc + item.quantity * item.price;
   }, 0);
   divInfo.append(renderPriceInfo(totalSum, "primary-card-gorizontal", "Сума замовлення"));

   const productList = document.createElement("div");
   productList.classList = "orders__products-list";
   orderCard.append(productList);
   order.products.forEach((item) => {
      productList.append(renderOrderProduct(item));
   });

   return orderCard;
}

function renderOrderProduct(product) {
   const productCard = document.createElement("div");
   productCard.classList = "orders__product primary-card-gorizontal";

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

   // <h4 class="primary-card-gorizontal__title">Title</h4>;
   const h4Title = document.createElement("h4");
   h4Title.classList = "primary-card-gorizontal__title";
   h4Title.textContent = `${product.title} (${product.shopTitle})`;
   divInfo.append(h4Title);

   // price
   divInfo.append(renderPriceInfo(product.price, "primary-card-gorizontal", "Ціна"));

   // quantity
   const divQuantity = document.createElement("div");
   divQuantity.classList = "primary-card-gorizontal__quantity";
   divInfo.append(divQuantity);
   
   const quantityTitle = document.createElement("span");
   quantityTitle.classList = "primary-card-gorizontal__quantity-title";
   quantityTitle.textContent = "Кількість:";
   divQuantity.append(quantityTitle);
   
   const quantityValue = document.createElement("span");
   quantityValue.classList = "primary-card-gorizontal__quantity-value";
   quantityValue.textContent = product.quantity;
   divQuantity.append(quantityValue);

   // totalprice
   const totalPrice = product.price * product.quantity;
   divInfo.append(renderPriceInfo(totalPrice, "primary-card-gorizontal", "Разом"));

   return productCard;
}


