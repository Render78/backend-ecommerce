import mongoose from 'mongoose';

const cartsCollection = "Carts";

const cartsSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Products"
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        default: []
    }
});

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;
