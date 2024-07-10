import cartModel from '../models/cart.model.js';

export default class Cart {
    async createCart() {
        try {
            const newCart = new cartModel();
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error('Error creating cart:', error);
            throw error;
        }
    }

    async getCartById(id) {
        try {
            const cart = await cartModel.findById(id).populate({
                path: 'products.product',
                select: 'title description category price code stock status'
            });
            return cart;
        } catch (error) {
            console.error('Error getting cart by ID:', error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) throw new Error('Cart not found');

            const existingProductIndex = cart.products.findIndex(item => item.product.toString() === productId);
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += 1;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error adding product to cart:', error);
            throw error;
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) throw new Error('Cart not found');

            const existingProductIndex = cart.products.findIndex(item => item.product.toString() === productId);
            if (existingProductIndex === -1) throw new Error('Product not found in cart');

            cart.products.splice(existingProductIndex, 1);
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error removing product from cart:', error);
            throw error;
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) throw new Error('Cart not found');

            const existingProduct = cart.products.find(item => item.product.toString() === productId);
            if (!existingProduct) throw new Error('Product not found in cart');

            existingProduct.quantity = quantity;
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error updating product quantity in cart:', error);
            throw error;
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) throw new Error('Cart not found');

            cart.products = [];
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    }
}
