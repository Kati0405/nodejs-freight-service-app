const jwt = require('jsonwebtoken');
const { secret } = require('../config');

const roleMiddleware = (role) =>
  function (req, res, next) {
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

// module.exports = function (roles) {
//   return function (req, res, next) {
//     if (req.method === 'OPTIONS') {
//       next(0);
//     }

//     try {
//       const token = req.headers.authorization.split(' ')[1];
//       if (!token) {
//         return res.status(403).json({ message: 'Not authorized' });
//       }
//       const { roles: userRoles } = jwt.verify(token, secret);
//       let hasRole = false;
//       userRoles.forEach((role) => {
//         if (roles.includes(role)) {
//           hasRole = true;
//         }
//       });
//       if (!hasRole) {
//         return res.status(403).json({ message: 'You have no permission' });
//       }
//       next();
//     } catch (e) {
//       console.log(e);
//       return res.status(403).json({ message: 'Not authorized' });
//     }
//   };
// };

module.exports = {
  roleMiddleware,
};
