const jwt = require('jsonwebtoken');

const authGuard = (req, res, next) => {
    const { authorization } = req.headers;
    console.log(authorization);
    
    
    try {
        const token = authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        console.log(decodedToken);

        if (!decodedToken) {
            res.status(403).send('Forbidden!');
        }

        const { id, role } = decodedToken;
        req.id = id;
        req.role = role;
        next();
    } catch (err) {
        console.log(err.message);
        
        next('Authorization failed!');
    }
};

module.exports = authGuard;
