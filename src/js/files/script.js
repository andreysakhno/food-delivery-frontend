// Подключение функционала 
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";

import { initShop } from "./shop/init-shop.js";
import { initCart } from "./shop/init-cart.js";
import { initHistory } from "./shop/init-history.js";

// Запускаємо функцію для роботи з магазином товарів (страви для замовлення)
if (document.getElementById("shop-page")) initShop();
// Запускаємо функцію для роботи з корзиною
if (document.getElementById("cart-page")) initCart();
// Запускаємо функцію для роботи з історією замовлень
if (document.getElementById("history-page")) initHistory();