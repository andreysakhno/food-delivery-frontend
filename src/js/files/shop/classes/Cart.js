export class Cart {
	constructor() {
		if (!this._storageSupported()){
			throw "Браузер не підтримує localStorage";
		}
		if (!this._isEmpty()) {
			this.products = JSON.parse(localStorage.getItem('cart'));
		} else {
			this.products = {};
		}
	}	

	remove(uniqueId) {
		const product_index = this._findIndexOf(uniqueId);
		if (product_index !== -1) {
			this.products.splice(product_index, 1);
			this._save();
		}      
		
	}

	increaseQuantiti (uniqueId) {
		const product_index = this._findIndexOf(uniqueId);
		if (product_index !== -1) {			
			this.products[product_index].quantity++;
			this._save();
		}		
   }
      
	decreaseQuantity(uniqueId) {
		const product_index = this._findIndexOf(uniqueId);
		if (product_index !== -1) {
			if (this.products[product_index].quantity > 1) this.products[product_index].quantity--;
			this._save();
		}		
	}

	getItemSum(uniqueId) {
		const product_index = this._findIndexOf(uniqueId);
		if (product_index !== -1) {			
			return this.products[product_index].quantity * this.products[product_index].price;			
		}
	}

	getTotalSum() {	
		return this.products.reduce((sum, product) => {
			return sum + product.quantity * product.price;
		}, 0);
	}

	clear() {
		localStorage.removeItem('cart');
	}

	_save() {
		localStorage.setItem("cart", JSON.stringify(this.products));
		if (this._isEmpty()) this.clear();
	}

	_findIndexOf(uniqueId) {
		let indexOf = -1;
		this.products.forEach((product, index) => {
			if (product.id === uniqueId) indexOf = index;
		});
		return indexOf;
	}

	_isEmpty() {
		return localStorage.getItem("cart") === null || JSON.parse(localStorage.getItem('cart')).length === 0
	}

	_isIsset(id) {
		return this.products.some((item) => item.id === id);
	}

	_storageSupported() {
		return (typeof(Storage) !== "undefined") ? true : false;
	}
}