const bcrypt = require('bcrypt')
const { generateToken } = require('../../helpers/tokens')
const User = require('../../models/User')

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        message: 'The email you have entered is not connected to an account.',
      })
    }

    const check = await bcrypt.compare(password, user.password)

    if (!check) {
      return res.status(400).json({
        message: 'Invalid crediantials, Please try again.',
      })
    }

    const token = generateToken({ id: user.id.toString() }, '7d')

    res.send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      verified: user.verified,
      message: 'Login successful',
      token,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = login
