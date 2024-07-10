import axios from 'axios'

export const renderHome = async (req, res) => {
    try {
        res.render('home');
    } catch (error) {
        console.log("No se pudo renderizar la vista", error);
    }
};

export const renderProducts = async (req, res) => {
    try {        
        const response = await axios.get(`${req.protocol}://${req.get('host')}/api/products`);
        const productsData = response.data;
        
        res.render('products', { 
            products: productsData.products,
            pagination: productsData.pagination
        });
    } catch (error) {
        console.log("No se pudo renderizar la vista de productos", error);
    }
};

export const renderLogin = async (req, res) => {
    res.render('login');
};

export const renderRegister = async (req, res) => {
    res.render('register');
};

export const renderCurrent = async (req, res) => {
    res.render('current', { user: req.session.user });
};
