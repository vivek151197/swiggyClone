const jwt = require('jsonwebtoken')

const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.id = decoded.id

      next()
    } catch (error) {
      res.status(401).send('Not Authorised, token failed')
    }
  }

  if (!token) {
    res.status(403).send('Not authorised, no token')
  }
}

module.exports = protect
