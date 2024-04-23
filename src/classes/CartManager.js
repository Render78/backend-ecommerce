const fs = require("fs").promises;

class CartManager {

    constructor(filePath) {
        this.carts = [];
        this.path = filePath;
    }

    async saveCart(arrayCarts) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayCarts, null, 2))
        } catch (error) {
            console.log('Error al guardar el archivo: ', error)
        }
    }

    async readFile() {
        try {
            const read = await fs.readFile(this.path, 'utf-8');
            const cartsArray = JSON.parse(read);
            return cartsArray;
        } catch (error) {
            console.log('Error al leer el archivo: ', error);
        }
    }

    async addCart(newCart) {
        try {
            const { products } = newCart;

            const existingCarts = await this.readFile();
            const maxId = existingCarts.reduce((max, cart) => (cart.id > max ? cart.id : max), 0);
            const newId = maxId + 1;

            const cart = {
                id: newId,
                products: products || []
            };

            existingCarts.push(cart);

            await this.saveCart(existingCarts);

            return cart;
        } catch (error) {
            console.error('Error al agregar el carrito: ', error);
            throw error;
        }
    }

    async getCartById(id) {
        try {
            const cartsArray = await this.readFile();
            const cart = cartsArray.find(cart => cart.id === id);
            return cart;
        } catch (error) {
            console.error('Error al obtener el carrito por ID: ', error);
            throw error;
        }
    }

}