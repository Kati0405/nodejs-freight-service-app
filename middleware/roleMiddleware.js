const jwt = require('jsonwebtoken');
const { secret } = require('../config');

function roleMiddleware(role) {
  return (req, res, next) => {
    if (req.method === 'OPTIONS') {
      next(0);
    }

    try {
      const jwt_token = req.headers.authorization.split(' ')[1];
      if (!jwt_token) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      const { role: userRoles } = jwt.verify(jwt_token, secret);
      let hasRole = false;
      if (role === userRoles) {
        hasRole = true;
      }

      if (!hasRole) {
        return res.status(403).json({ message: 'You have no permission' });
      }
      next();
    } catch (e) {
      console.log(e);
      return res.status(403).json({ message: 'Not authorized' });
    }
  };
}

module.exports = {
  roleMiddleware,
};
