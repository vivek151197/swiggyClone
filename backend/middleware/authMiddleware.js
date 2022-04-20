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
      res.status(401)
      throw new Error('Not Authorized, token failed')
    }
  }

  if (!token) {
    res.status(403)
    throw new Error('Not authorised, no token')
  }
}

module.exports = protect
