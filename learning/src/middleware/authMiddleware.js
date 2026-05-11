const jwt = require('jsonwebtoken');
const { error } = require('node:console');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json({error: 'Non autorisé'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        req.userId = decoded.userId;
        next();
    }catch{
        res.status(401).json({error: 'Token invalide'});
    }
};

module.exports = authMiddleware;