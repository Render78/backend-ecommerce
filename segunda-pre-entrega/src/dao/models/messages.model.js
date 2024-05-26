import mongoose from 'mongoose';

const messagesCollection = "Messages";

const messagesSchema = new mongoose.Schema({
    user: { type: String, required: true, max: 100 },
    message: { type: String, required: true, max: 100 }
});

const messagesModel = mongoose.model(messagesCollection, messagesSchema);

export default messagesModel;