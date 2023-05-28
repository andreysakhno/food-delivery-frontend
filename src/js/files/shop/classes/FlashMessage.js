export class FlashMessage {   
   static get _CONSTANTS () {
      return {
         TYPES: {
            SUCCESS: 'success',
            WARNING: 'warning',
            ERROR: 'error',
            INFO: 'info',
         },
         CONTAINER: '.flash-messages',
         CLASSES: {
            CONTAINER: 'flash-messages',
            MESSAGE: 'flash-messages__message',
            TEXT: 'flash-messages__text',
            CLOSE: 'flash-messages__close',
            FADEIN: 'fadein',
            FADEOUT: 'fadeout',
         },
      }
   }
   /* 
      message - текстове повідомлення
      type - тип повідомлення success | warning | error | info
      container - css селектор контейнера з повідомленнями
   */
   constructor(
      message,
      type = FlashMessage._CONSTANTS.SUCCESS,
      container = FlashMessage._CONSTANTS.CONTAINER
   ) {      
      this._message = message;
      this._type = type;
      this._container = document.querySelector(container) || null;      
      this._createContainer();   
      this._createMessage();
   }
   
   // Статичні методи для доступу у вигляді FlashMessage.success('This is a successs flash message!');
   static success (message) {
      return new FlashMessage(message, FlashMessage._CONSTANTS.TYPES.SUCCESS)
   }
   static warning (message) {
      return new FlashMessage(message, FlashMessage._CONSTANTS.TYPES.WARNING)
   }
   static error (message) {
      return new FlashMessage(message, FlashMessage._CONSTANTS.TYPES.ERROR)
   }
   static info (message) {
      return new FlashMessage(message, FlashMessage._CONSTANTS.TYPES.INFO)
   }

   _createContainer() { 
      if (this._container === null) {
         this._container = document.createElement('div');
         this._container.classList.add(FlashMessage._CONSTANTS.CLASSES.CONTAINER);
         document.body.append(this._container);
      } else if (!this._container.classList.contains(FlashMessage._CONSTANTS.CLASSES.CONTAINER)) {
         this._container.classList.add(FlashMessage._CONSTANTS.CLASSES.CONTAINER);
      }      
   }

   _createMessage() {
      // Створюємо елемент повідомлення, що містить текст та кнопку закрити
      this._messageElement = document.createElement("div");
      this._messageElement.classList.add(FlashMessage._CONSTANTS.CLASSES.MESSAGE, this._type);
      
      // Створюємо елемент з текстом повідомлення
      let messageText = document.createElement("div");
      messageText.classList.add(FlashMessage._CONSTANTS.CLASSES.TEXT);
      messageText.textContent = this._message;
      this._messageElement.append(messageText);
      
      // Створюємо кнопку закрити повідомлення
      let messageCloseBtn = document.createElement("button");
      messageCloseBtn.classList.add(FlashMessage._CONSTANTS.CLASSES.CLOSE);
      messageCloseBtn.addEventListener("click", () => {
         this._stop();
      });
      this._messageElement.append(messageCloseBtn);
      
      this._container.append(this._messageElement);
      // поведінка повідомлення - відображається і зникає через 10 секунд
      this._behavior();
   }

   _behavior () {
      this._run();
      window.setTimeout(
         () => this._messageElement.classList.add(FlashMessage._CONSTANTS.CLASSES.FADEIN),
      0);
   }

   _run () {
      this._c_timeout = window.setTimeout(() => this._close(), 10000);
   }

   _stop() {      
      this._close();
      if (this._c_timeout !== null) {
         window.clearTimeout(this._c_timeout);
         this._c_timeout = null;
      }
   }

   _close () {
      this._messageElement.classList.remove(FlashMessage._CONSTANTS.CLASSES.FADEIN);      
      this._messageElement.addEventListener("transitionend", () => {         
         this._container.removeChild(this._messageElement);
         this._clear();
      });
   }

   _clear () {
      if (!this._container.children.length) {
         this._container.parentNode.removeChild(this._container);
      }
   }   
}





