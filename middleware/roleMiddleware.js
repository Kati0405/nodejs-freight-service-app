const jwt = require('jsonwebtoken');
const { secret } = require('../config');

// function authorize(roles = []) {
//   // roles param can be a single role string (e.g. Role.User or 'User')
//   // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
//   if (typeof roles === 'string') {
//     roles = [roles];
//   }

//   return [
//     // authorize based on user role
//     (req, res, next) => {
//       if (roles.length && !roles.includes(req.user.role)) {
//         // user's role is not authorized
//         return res.status(401).json({ message: 'Unauthorized' });
//       }

//       // authentication and authorization successful
//       next();
//     },
//   ];
// }

function roleMiddleware(role) {
  return (req, res, next) => {
    if (req.method === 'OPTIONS') {
      next(0);
    }

    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      const { role: userRoles } = jwt.verify(token, secret);
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
