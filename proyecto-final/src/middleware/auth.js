export const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
};

export const isNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        res.redirect('/current');
    }
};

export const isUserOrPremium = (req, res, next) => {
    if (req.user && (req.user.role === 'user' || req.user.role === 'premium')) {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado: Solo los usuarios o usuarios premium pueden realizar esta acción.' });
    }
};

export const checkRoles = (...roles) => {
    return (req, res, next) => {
        if (req.user && roles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ message: `Acceso denegado: Solo los usuarios con los roles ${roles.join(' o ')} pueden realizar esta acción.` });
        }
    };
};
