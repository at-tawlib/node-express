const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const authenticationMiddleWare = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // check if request has authHeader
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('No token provided');
    }

    // get and decode token from the header
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { id, username } = decoded;
        req.user = { id, username };
        next();
    } catch(error) {
        throw new UnauthenticatedError('Not authorized to access this route');
    }
}

module.exports = authenticationMiddleWare;