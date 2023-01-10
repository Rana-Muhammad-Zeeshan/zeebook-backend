const bcrypt = require('bcrypt')
const { sendVerificationEmail } = require('../helpers/mailer')
const { generateToken } = require('../helpers/tokens')

const {
  validateEmail,
  validateLength,
  validateUsername,
} = require('../helpers/validation')
const User = require('../models/User')

exports.register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      username,
      email,
      password,
      byear,
      bmonth,
      bday,
      gender,
    } = req.body

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: 'invalid email address',
      })
    }

    const checkEmailExist = await User.findOne({ email })

    if (checkEmailExist) {
      return res.status(400).json({
        message:
          'This email address already exists, try with a different email address',
      })
    }

    if (!validateLength(first_name, 3, 30)) {
      return res.status(400).json({
        message: 'First name must be between 3 and 30 characters.',
      })
    }

    if (!validateLength(last_name, 3, 30)) {
      return res.status(400).json({
        message: 'Last name must be between 3 and 30 characters.',
      })
    }

    if (!validateLength(password, 6, 40)) {
      return res.status(400).json({
        message: 'Password must be atleast 6 characters',
      })
    }

    const cryptedPassword = await bcrypt.hash(password, 12)

    let tempUsername = first_name + last_name
    let newUsername = await validateUsername(tempUsername)

    const user = await new User({
      first_name,
      last_name,
      username: newUsername,
      email,
      password: cryptedPassword,
      byear,
      bmonth,
      bday,
      gender,
    }).save()

    const emailVerificationToken = generateToken(
      { id: user._id.toString() },
      '30m'
    )

    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`
    sendVerificationEmail(user.email, user.first_name, url)

    const token = generateToken({ id: user._id.toString() }, '7d')

    res.send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      verified: user.verified,
      message: 'Registration successful ! Please activate your email',
      token,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}
