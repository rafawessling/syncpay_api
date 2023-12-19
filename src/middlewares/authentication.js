const jwt = require('jsonwebtoken')
const knex = require('../database/conection')

const validateUser = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ message: 'Not Authorized' })
    }

    const token = authorization.split(' ')[1]

    try {
        const { id } = jwt.verify(token, process.env.JWT_PASS)

        const user = await knex('users').select('*').where('id', id)

        if (user.length < 1) {
            return res.status(404).json({ message: 'User not found' })
        }

        req.user = user[0]

        next()
    } catch (error) {
        return res.status(401).json({message: 'Invalid token', details: error.message})

    }
}

module.exports = validateUser