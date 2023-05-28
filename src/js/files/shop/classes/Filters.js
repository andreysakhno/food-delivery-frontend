export class Filter {   
   constructor(filter) {
      this.id = filter.id;
      this.title = filter.title;
      this.coord = filter.coords;

      this._renderCheckBox(); 
   }

   _renderCheckBox() {
      const filtersCont = document.querySelector(".filters__list");

      // <li class="filters__item"></li>
      const li = document.createElement("li");
      li.classList.add("filters__item");
      
      // <input type="checkbox" id="filter_1" value="1" class="filters__checkbox">
      const input = document.createElement("input");
      input.setAttribute("type", "checkbox");
      input.setAttribute("id", `filter_${this.id}`);
      input.setAttribute("name", `filter_${this.id}`);
      input.setAttribute("value", `${this.id}`);
      input.classList.add("filters__checkbox");
      input.addEventListener("change", () => {
         // alert(1);
      });
      li.append(input);

      // <label for="filter_1" class="filters__label"></label>
      const label = document.createElement("label");
      label.setAttribute("for", `filter_${this.id}`);
      label.classList = "filters__label";
      li.append(label);

      // <span class="filters__text">McDonald's</span>
      const span = document.createElement("span");
      span.classList.add("filters__text");
      span.textContent = `${this.title}`;
      label.append(span);
      
      filtersCont.append(li);
   }
}