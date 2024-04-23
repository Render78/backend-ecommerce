const express = require("express");
const path = require("path");
const app = express();
const PORT = 8080;
const productsRouter = require("./routes/products.router.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/", productsRouter);

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})