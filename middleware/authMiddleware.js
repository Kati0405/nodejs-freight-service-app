const jwt = require('jsonwebtoken');
const { secret } = require('../config');

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(401)
      .json({ message: 'Please, provide authorization header' });
  }

  const [, token] = authorization.split(' ');

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Please, include token to request' });
  }

  try {
    const tokenPayload = jwt.verify(token, secret);
    req.user = tokenPayload;
    next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }

  return null;
};

// const authMiddleware = (req, res, next) => {
//   if (req.method === 'OPTIONS') {
//     next(0);
//   }

//   try {
//     const token = req.headers.authorization.split(' ')[1];
//     if (!token) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }
//     const decodedData = jwt.verify(token, secret);
//     req.user = decodedData;
//     next();
//   } catch (e) {
//     console.log(e);
//     return res.status(403).json({ message: 'Not authorized' });
//   }
// };

module.exports = {
  authMiddleware,
};
