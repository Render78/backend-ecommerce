import mongoose from 'mongoose';
import Product from '../src/dao/classes/product.dao.js';
import productsModel from '../src/dao/models/product.model.js';
import Cart from '../src/dao/classes/cart.dao.js';
import Assert from 'assert';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker'

const assert = Assert.strict;

dotenv.config();
mongoose.connect(process.env.MONGO_URL);

describe("Testing de productos", () => {

    before(function () {
        this.productsDao = new Product();
    })

    beforeEach(async () => {
        await productsModel.deleteMany({ code: 'EXCD' });
    });

    it("Deberia retornar productos desde la DB", async function () {
        this.timeout(5000);
        try {
            const result = await this.productsDao.getProducts();
            assert.strictEqual(Array.isArray(result) && result.length > 0, true);
        } catch (error) {
            console.error("Error durante el test", error);
            assert.fail("Test fallido con errores");
        }
    })

    it("El dao debe obtener un producto por ID", async function () {

        try {
            const pid = "6653c61b79eab765e692a3ff";
            const product = await this.productsDao.getProductById(pid);
            assert.strictEqual(typeof product, 'object');
            assert.strictEqual(product._id.toString(), pid);
        } catch (error) {
            console.error("Error durante el test", error);
            assert.fail("Test fallido con errores");
        }

    })

    it("El dao debe agregar un producto correctamente a la DB", async function () {
        let product = {
            title: "example title",
            description: "example description",
            category: "example category",
            price: 50,
            thumbnail: "example URL",
            code: "EXCD",
            stock: 5,
            status: true,
            owner: "admin"
        };

        let result = await this.productsDao.saveProduct(product);
        assert.ok(result._id);
    })
})

describe("Testing de carrito", () => {
    before(function () {
        this.cartsDao = new Cart();
    })

    it("El DAO debe crear un carrito", async function () {
        try {

            let result = await this.cartsDao.createCart();

            assert.ok(result._id);
            assert.strictEqual(Array.isArray(result.products), true);
            assert.strictEqual(result.products.length, 0);
        } catch (error) {
            console.error("Error durante el test", error);
            assert.fail("Test fallido con errores");
        }
    })

    it("El DAO debe obtener un carrito por ID", async function () {
        try {
            const cid = "66ca3a836d427f43877262f2";
            const cart = await this.cartsDao.getCartById(cid);
            assert.strictEqual(typeof cart, 'object');
            assert.strictEqual(cart._id.toString(), cid);
        } catch (error) {
            console.error("Error durante el test", error);
            assert.fail("Test fallido con errores");
        }
    })

    it("El DAO debe agregar un producto a un carrito correctamente", async function () {
        try {
            const cart = await this.cartsDao.createCart();
            const productId = new mongoose.Types.ObjectId();

            let updatedCart = await this.cartsDao.addProductToCart(cart._id, productId);

            assert.strictEqual(updatedCart.products.length, 1);
            assert.strictEqual(updatedCart.products[0].product.toString(), productId.toString());
            assert.strictEqual(updatedCart.products[0].quantity, 1);

            updatedCart = await this.cartsDao.addProductToCart(cart._id, productId);

            assert.strictEqual(updatedCart.products.length, 1);
            assert.strictEqual(updatedCart.products[0].quantity, 2);

        } catch (error) {
            console.error("Error durante el test", error);
            assert.fail("Test fallido con errores");
        }
    });
})