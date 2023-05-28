import { getData } from "./api-request.js";
import { Filter } from "./classes/Filters.js";
import { Product } from "./classes/Product.js";
import { clearContainer } from "./functions.js";

export function initShop() { 
   const requestParams = {}; // об'єкт з get параметрами для запиту в БД

   // Отримаємо дані з БД та рендеримо чекбокси (фільтри) магазинів  
   getData("shops").then((data) => {
      data.forEach((item) => new Filter(item));
   });

   // Отримаємо дані з БД та рендеримо карточки товарів (страв для замовлення)     
   getData("foods").then((data) => {
      data.forEach((item) => new Product(item));
   });  

   // При зміні стану чекбоксів відправляємо запит в БД та відображаємо відфільтровані товари 
   const checked = []; // масив відмічених чекбоксів

   document.querySelector(".filters__list").addEventListener("change", (e) => {
      if (!!e.target.closest(".filters__checkbox")) {
         let shopId = e.target.closest(".filters__checkbox").value;
         
         // Якщо значення є в масиві удаляємо його, інакше додаємо
         let i = checked.indexOf(shopId);
         if (i >= 0) {
            checked.splice(i, 1);
         } else {
            checked.push(shopId);
         } 

         // Додаємо id фільтра (ресторану) в об'єкт з get параметрами для запиту в БД
         requestParams.shopIds = checked;
         
         if (checked.length === 0) delete requestParams.shopIds;

         clearContainer(".products-list");
         getData("foods", requestParams).then((data) => {
            data.forEach((item) => new Product(item));
         });          
      }
   });

   // Відображаємо число товарів в корзині
   if (localStorage.getItem("cart") !== null) {
      const productsInCart = JSON.parse(localStorage.getItem("cart"));
      document.querySelector(".header__cart").textContent = productsInCart.length;
   }

}
