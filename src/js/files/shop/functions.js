// Функція видаляє усі дочірні елементи
export function clearContainer(selector) {
   const container = document.querySelector(selector);
   while (container.children.length > 0) {
      container.firstChild.remove();
   }
}

/* 
   Функція рендерігу фото:
   <div class="selector__image-ibg">
      <picture>
         <source srcset="photo1.webp" type="image/webp">
         <img src="photo1.jpg" alt="" loading="lazy">
      </picture>
   </div>   
   або (якщо фото відсутнє) 
   <div class="selector__no-photo">
      <img src="/img/icon-no-photo.svg" alt="">
   </div>
*/
export function renderPicture(object, selector) {
   const productImageDiv = document.createElement("div");
   if (object.srcset) {
      productImageDiv.classList = `${selector}__image-ibg`;
      const picture = document.createElement("picture");
      const source = document.createElement("source");
      const img = document.createElement("img");
      source.srcset = object.srcset;
      source.type = "image/webp";
      img.src = object.src;
      img.alt = object.title;
      img.loading = "lazy";
      picture.append(source);
      picture.append(img);
      productImageDiv.append(picture);
   } else {
      productImageDiv.classList = `${selector}__no-photo`;
      const img = document.createElement("img");
      img.src = "./img/icon-no-photo.svg";
      img.alt = object.name;
      productImageDiv.append(img);
   }
   return productImageDiv;
}

export function renderPriceInfo(price, selector) {
   // <div class="selector__price"></div>
   const divCardPrice = document.createElement("div");
   divCardPrice.classList = `${selector}__price`;

   // <span class="selector__price-value">125.00</span>
   const spanPriceValue = document.createElement("span");
   spanPriceValue.classList = `${selector}__price-value`;
   spanPriceValue.textContent = (+price).toFixed(2);
   divCardPrice.append(spanPriceValue);

   // <span class="selector__price-currency">грн.</span>
   const spanPriceCurrency = document.createElement("span");
   spanPriceCurrency.classList = `${selector}__price-currency`;
   spanPriceCurrency.textContent = "грн.";
   divCardPrice.append(spanPriceCurrency);
   return divCardPrice;
}
