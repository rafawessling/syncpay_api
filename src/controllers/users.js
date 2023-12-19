const knex = require('../database/conection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const lowerCaseEmail = email.toLowerCase().trim();
        const encryptedPassword = await bcrypt.hash(password, 10);
        const user = await knex('users')
            .insert({ name, email: lowerCaseEmail, password: encryptedPassword })
            .returning('*');
        return res.status(201).json(user[0]);
    } catch (error) {
        return res.status(500).json({ message: 'Error registering user', details: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const lowerCaseEmail = email.toLowerCase().trim();

        const user = await knex('users').select('*').where('email', lowerCaseEmail);

        if (user.length < 1) {
            return res.status(400).json({ message: 'Incorrect email and/or password' });
        }

        const confirmPassword = await bcrypt.compare(password, user[0].password);

        if (!confirmPassword) {
            return res.status(400).json({ message: 'Incorrect email and/or password' });
        }

        const token = jwt.sign({ id: user[0].id, name: user[0].name, email: user[0].email }, process.env.JWT_PASS, {
            expiresIn: '8h',
        });

        const { password: _, ...loggedInUser } = user[0];

        return res.status(200).json({ user: loggedInUser, token });
    } catch (error) {
        return res.status(500).json({ message: 'Error when logging in user', details: error.message });
    }
};

const getUserProfile = async (req, res) => {
    return res.json(req.user);
};

const updateUser = async (req, res) => {
    const { name, email, cpf, phone_number, password } = req.body;
    const { id } = req.params;

    try {
        const lowerCaseEmail = email.toLowerCase().trim();
        const encryptedPassword = password ? await bcrypt.hash(password, 10) : '';
        let updateResult;

        if (encryptedPassword) {
            updateResult = await knex('users')
                .where('id', id)
                .update({ name, email: lowerCaseEmail, password: encryptedPassword, cpf, phone_number });
        } else {
            updateResult = await knex('users')
                .where('id', id)
                .update({ name, email: lowerCaseEmail, password, cpf, phone_number });
        }
        return res.status(200).json(updateResult);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', details: error.message });
    }
};

const getEmail = async (req, res) => {
    const { email } = req.query;

    try {
        if (email) {
            const decodedEmail = decodeURIComponent(email);
            const lowerCaseEmail = decodedEmail.toLowerCase().trim();
            const singleEmail = await knex('users').where('email', lowerCaseEmail);
            if (singleEmail.length < 1) {
                return res.status(200).json({ message: 'email available' });
            }
            return res.status(200).json({ message: 'email unavailable' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error checking email', details: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUser,
    getEmail,
};
