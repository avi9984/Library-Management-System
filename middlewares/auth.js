
const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ message: 'Access denied' })
        }
        const decoded = jwt.verify(token.split(' ')[1], process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Session expired, please log in again.',
                expiredAt: error.expiredAt
            });
        }

        console.log(error);
        return res.status(400).json({ message: 'Invalid token' })
    }
}
module.exports = authentication