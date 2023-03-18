const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
    return `Bearer ${jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })}`;
};

module.exports = generateToken;