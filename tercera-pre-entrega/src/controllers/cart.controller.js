import Cart from '../dao/classes/cart.dao.js';

const cartService = new Cart();

export const createCart = async (req, res) => {
    try {
        const newCart = await cartService.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error creating cart' });
    }
};

export const getCartById = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartService.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error getting cart' });
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartService.addProductToCart(cid, pid);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error adding product to cart' });
    }
};

export const removeProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartService.removeProductFromCart(cid, pid);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error removing product from cart' });
    }
};

export const updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be a positive number' });
        }

        const cart = await cartService.updateProductQuantity(cid, pid, quantity);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error updating product quantity in cart' });
    }
};

export const clearCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartService.clearCart(cid);
        res.status(200).json({ message: 'All products in the cart have been removed', cart });
    } catch (error) {
        res.status(500).json({ error: 'Error clearing cart' });
    }
};
