import { renderPicture, renderPriceInfo } from "../functions.js";

export class Product {

   constructor(product) {
      this.id = product.id;
      this.shopId = product.shop?.id;
      this.shopTitle = product.shop?.title;
      this.shopCoords = product.shop?.coords;
      this.title = product.title;
      this.price = product.price.toFixed(2);      
      this.src = product.photo?.src;
      this.srcset = product.photo?.srcset;

      this._renderProductCard(); 
   }

   _renderProductCard() {
      const filtersCont = document.querySelector(".products-list");     
      //  <div class="shop-main__product-card product-card"></div>
      const divProductCard = document.createElement("div");
      divProductCard.classList = "shop-main__product-card product-card";
      filtersCont.append(divProductCard);
      
      // picture
      divProductCard.append(renderPicture(this, "product-card"));  

      // <div class="product-card__body"></div>
      const divCardBody = document.createElement("div");
      divCardBody.classList = "product-card__body";
      divProductCard.append(divCardBody);

      // <div class="product-card__info"></div>
      const divCardInfo = document.createElement("div");
      divCardInfo.classList = "product-card__info";
      divCardBody.append(divCardInfo);

      // <h4 class="product-card__title">Чизбургер</h4>
      const h4CardTitle = document.createElement("h4");
      h4CardTitle.classList = "product-card__title";
      h4CardTitle.textContent = `${this.title} (${this.shopTitle})`;
      divCardInfo.append(h4CardTitle);

      // price 
      divCardInfo.append(renderPriceInfo(this.price, "product-card"));

      //<button class="product-card__order" data-id="1" data-shop-id="1" data-title="1" data-price="1">Замовити</button>
      const buttonOrder = document.createElement("button");
      buttonOrder.classList = "product-card__order";
      buttonOrder.textContent = "Замовити";
      buttonOrder.addEventListener("click", (e) => {
         this._addToCart();
      });

      divCardBody.append(buttonOrder);
   } 

   _addToCart() {           
      const cartElement = document.querySelector(".header__cart");
      const product = { ...this, quantity: 1 };
      if (localStorage.getItem("cart") === null) {         
         localStorage.setItem("cart", JSON.stringify([product]));
         cartElement.textContent = 1;
      } else {
         const productsInCart = JSON.parse(localStorage.getItem("cart"));
         const isInCart = productsInCart.some((item) => item.id === product.id);         
         if (!isInCart) {
            productsInCart.push(product);
            localStorage.setItem("cart", JSON.stringify(productsInCart));
            cartElement.textContent = productsInCart.length;
         }         
      }      
   }
}