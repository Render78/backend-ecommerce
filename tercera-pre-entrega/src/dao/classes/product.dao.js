import productModel from '../models/product.model.js'

export default class Product {
    getProducts = async () => {
        try {
            let products = await productModel.find()
            return products
        } catch (error) {
            console.log(error);
            return null
        }
    }

    getProductById = async (id) => {
        try {
            let product = await productModel.findOne({ _id: id })
            return product
        } catch (error) {
            console.log(error)
            return null
        }
    }

    saveProduct = async (product) => {
        try {
            let result = await productModel.create(product)
            return result
        } catch (error) {
            console.log(error)
        }
    }
}