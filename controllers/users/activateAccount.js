const jwt = require('jsonwebtoken')
const User = require('../../models/User')

const activateAccount = async (req, res) => {
  try {
    const { token } = req.body

    const user = jwt.verify(token, process.env.TOKEN_SECRET)

    const check = await User.findById(user.id)

    if (check.verified === true) {
      return res.status(400).json({
        message: 'This account is already activated',
      })
    } else {
      await User.findByIdAndUpdate(user.id, { verified: true })

      return res.status(200).json({
        message: 'Account has been activated successfully',
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = activateAccount
