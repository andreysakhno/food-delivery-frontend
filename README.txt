Проект замовлення їжі
1. Проект складається з FRONTEND та BACKEND частин.

FRONTEND частина: 
git репозіторій: https://github.com/andreysakhno/food-delivery-frontend
Сторінка на хостінгу: https://static.welesgard.com/delivery/frontend/web

BACKEND частина: 
git репозіторій: https://github.com/andreysakhno/food-delivery-backend
Сторінка на хостінгу: https://static.welesgard.com/delivery/backend/web 
Для входу в адмінку: Логін - admin , Пароль - qwerty123

API: 
GET https://static.welesgard.com/delivery/frontend/web/api/shops
GET https://static.welesgard.com/delivery/frontend/web/api/foods
POST https://static.welesgard.com/delivery/frontend/web/api/orders

2. FRONTEND частина написана на HTML, SCSS, JS (без використання фрейморків). Сборка проекту: GULP + WEBPACK
Для встановлення FRONTEND необхідно:
- Клонувати цей репозиторій git clone https://github.com/andreysakhno/food-delivery-frontend.git
- Якщо ви до цього моменту не користувалися збирачем GULP, введіть у термінал команду npm i gulp-cli -g це встановить GULP в систему глобально. Після встановлення GULP введіть npm i
Запуск шаблону та режими роботи:
Режим розробника. Команда запуску npm run dev
Режим продакшену. Команда запуску npm run build

3. BACKEND частина написана на PHP (Yii2 Framework)
Для встановлення BACKEND необхідно:
- Установити composer, якщо він відсутній
- Клонувати цей репозиторій git clone https://github.com/andreysakhno/food-delivery-backend.git
- В консолі ввести команду init, щоб ініціалізувати Yii2 проект 
- В консолі ввести команду composer install, щоб встановити залежності
- Встановити ім'я БД, користувача та пароль у конфігу common/config/main-local.php 
- Запустити міграції, що створить необхідні таблиці. Команда yii migrate
- Встановити налаштування в common/config/params.php.