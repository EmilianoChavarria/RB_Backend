const verifyRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({ message: `Acceso denegado: se requiere rol '${requiredRole}'` });
        }
        next();
    };
};

module.exports = verifyRole;
